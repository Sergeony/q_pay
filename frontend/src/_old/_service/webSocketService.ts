import store from '_store/store';
import {
  updateTransaction,
  loadTransactions,
} from "_store/reducers/webSocketSlice";
import {refreshToken} from "../utils";
import {setBalance} from "_store/reducers/balanceSlice";


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
      const { action, data } = JSON.parse(event.data);
      switch (action) {
        case 'updated_transaction_status':
          store.dispatch(updateTransaction(data));
          break;
        case 'updated_balance':
          store.dispatch(setBalance(data));
          break;
        case 'current_balance':
          store.dispatch(setBalance(data));
          break;
        case 'active_transactions':
          store.dispatch(loadTransactions(data));
          break;
        case 'error':
          alert(data.message);
          break;
        default:
          alert("Unknown action");
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

  sendMessageChangeTransactionStatus(transactionId: string, newStatus: number, newActualAmount?: number) {
    const message: any = {
      action: 'change_transaction_status',
      transaction_id: transactionId,
      new_status: newStatus,
    };
    if (newActualAmount) {
      message["actual_amount"] = newActualAmount;
    }
    this.sendMessage(message);
  }

    sendMessageSettleTransactionStatus(transactionId: string, newStatus: number, newActualAmount?: number) {
    const message: any = {
      action: 'change_transaction_status',
      transaction_id: transactionId,
      new_status: newStatus,
    };
    if (newActualAmount) {
      message["actual_amount"] = newActualAmount;
    }
    this.sendMessage(message);
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
