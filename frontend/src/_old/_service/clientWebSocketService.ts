import store from '_store/store';
import { setTransaction } from "_store/reducers/clientTransactionSlice";
import { TransactionStatus } from "./transactionsService";


class WebSocketService {
  private ws: WebSocket | null = null;

  connect(apiKey: string) {
    // this.ws = new WebSocket(`ws://ec2-16-16-56-239.eu-north-1.compute.amazonaws.com/api/ws/trader/?api_key=${'i00000000'}`);
    this.ws = new WebSocket(`ws://localhost:8000/ws/?api_key=${apiKey}`);

    this.ws.onmessage = (event) => {
      const { action, data } = JSON.parse(event.data);
      switch (action) {
        case 'updated_transaction_status':
          store.dispatch(setTransaction(data));
          break;
        case 'error':
          alert(data.message);
          break;
        default:
          alert("Unknown action");
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessageChangeTransactionStatus(orderId: string, newStatus: TransactionStatus, newActualAmount?: number) {
    const message: any = {
      action: 'change_transaction_status',
      order_id: orderId,
      status: newStatus,
    };
    if (newActualAmount) {
      message["actual_amount"] = newActualAmount;
    }
    this.sendMessage(message);
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

export const clientWebSocketService = new WebSocketService();
