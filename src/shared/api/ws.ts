import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { store } from "app/providers/StoreProvider/ui/StoreProvider";
import { transformKeyFormat } from "shared/lib/utils/utils";
import { ReduxStoreWithManager } from "app/providers/StoreProvider";
import { transactionActions, transactionReducer } from "entities/Transaction";
import { balanceActions, balanceReducer } from "entities/Balance";
import { refreshToken } from "./api";

export class WebSocketService {
    private socket: WebSocket | null = null;

    private pingInterval: number | null = null;

    connect() {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        this.socket = new WebSocket(`ws://localhost:8000/ws/?token=${accessToken}`);
        this.socket.onopen = () => {
            this.startPing();
            (store as ReduxStoreWithManager)
                .reducerManager.add("activeTransactions", transactionReducer);
            (store as ReduxStoreWithManager)
                .reducerManager.add("balance", balanceReducer);
        };
        this.socket.onmessage = (event) => {
            const { action, data } = JSON.parse(event.data);
            const formattedData = transformKeyFormat(data, "camel");
            if (action === "active_transactions") {
                store.dispatch(transactionActions.setActiveTransactions(formattedData));
            } else if (action === "updated_transaction_status") {
                store.dispatch(transactionActions.updateActiveTransactions(formattedData));
            } else if (action === "current_balance") {
                store.dispatch(balanceActions.setBalance(formattedData));
            } else if (action === "error") {
                // TODO: add handling
            } else {
                // TODO: add handling: Unknown action
            }
        };
        this.socket.onclose = (event) => {
            this.stopPing();

            if (event.code === 401) {
                this.reconnectWithNewToken();
            }
        };
        this.socket.onerror = () => {
            // TODO: add handling
        };
    }

    async reconnectWithNewToken() {
        try {
            const newToken = await refreshToken();

            if (newToken) {
                this.connect();
            } else {
                // TODO: add handling
                this.disconnect();
            }
        } catch {
            // TODO: add handling
        }
    }

    sendMessageChangeTransactionStatus(
        transactionId: string,
        newStatus: number,
        newActualAmount?: number
    ) {
        const message: any = {
            action: "change_transaction_status",
            transaction_id: transactionId,
            new_status: newStatus,
        };
        if (newActualAmount) {
            message.actual_amount = newActualAmount;
        }
        this.sendMessage(message);
    }

    sendMessageSettleTransactionStatus(
        transactionId: string,
        newStatus: number,
        newActualAmount?: number
    ) {
        const message: any = {
            action: "change_transaction_status",
            transaction_id: transactionId,
            new_status: newStatus,
        };
        if (newActualAmount) {
            message.actual_amount = newActualAmount;
        }
        this.sendMessage(message);
    }

    startPing() {
        this.pingInterval = window.setInterval(() => {
            this.socket?.send(JSON.stringify({ action: "ping" }));
        }, 5000);
    }

    stopPing() {
        if (this.pingInterval) clearInterval(this.pingInterval);
    }

    sendMessage(message: object) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    disconnect() {
        this.socket?.close();
    }
}

export const webSocketService = new WebSocketService();
