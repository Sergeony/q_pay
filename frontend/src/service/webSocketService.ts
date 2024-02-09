import store from '../store/store';
import {
  addTransaction,
  moveTransaction,
  updateTransactionStatus
} from "../store/reducers/webSocketSlice";
import {refreshToken} from "../utils";


class WebSocketService {
  private ws: WebSocket | null = null;
  private pingInterval: number | null = null;

  connect(token: string | null) {
    if (!token)
      return;

    // this.ws = new WebSocket(`ws://ec2-16-16-56-239.eu-north-1.compute.amazonaws.com/api/ws/trader/?token=${token}`);
    this.ws = new WebSocket(`ws://localhost:8000/api/ws/trader/?token=${token}`);

    this.ws.onopen = () => {
      this.startPing();
    };

    this.ws.onmessage = (event) => {
      const { action, transaction_data, transaction_type } = JSON.parse(event.data);
      switch (action) {
        case 'new_transaction':
          store.dispatch(addTransaction({transactionData: transaction_data, transactionType: transaction_type}));
          break;
        case 'updated_transaction':
          store.dispatch(moveTransaction({id: transaction_data.id, transactionType: transaction_type}))
          break;
        default:
          console.log("Unknown action");
      }
    };

    this.ws.onclose = (event) => {
      this.stopPing();

      if (event.code === 401) {
        this.reconnectWithNewToken();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  async reconnectWithNewToken() {
    try {
      const newToken = await refreshToken(store);

      if (newToken) {
        this.connect(newToken);
      } else {
        console.error("Unable to refresh token.");
        this.disconnect();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }


  sendMessageUpdateTransactionStatus(transactionId: string, newStatus: number, transactionType: 'input' | 'output') {
    const message = {
      action: 'update_transaction_status',
      transaction_id: transactionId,
      new_status: newStatus,
      transaction_type: transactionType,
    };
    this.sendMessage(message);

    store.dispatch(updateTransactionStatus({id: transactionId, status: newStatus, transactionType: transactionType}));
  }

  startPing() {
    this.pingInterval = window.setInterval(() => {
      this.ws?.send(JSON.stringify({ action: 'ping' }));
    }, 5000);
  }

  stopPing() {
    if (this.pingInterval) clearInterval(this.pingInterval);
  }

  sendMessage(message: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  disconnect() {
    this.ws?.close();
  }
}

export const webSocketService = new WebSocketService();
