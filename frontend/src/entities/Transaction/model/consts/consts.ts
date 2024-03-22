export enum TransactionType {
    IN = 1,
    OUT = 2,
}

export type TransactionTypeRepr = "in" | "out";

export const getTransactionTypeFromRepr = (repr: TransactionTypeRepr) => {
    if (repr === "in") return TransactionType.IN;
    if (repr === "out") return TransactionType.OUT;
    throw new Error(`Unknown TransactionTypeRepr provided: ${repr}`);
};

export const getTransactionTypeRepr = (type: TransactionType) => {
    if (type === TransactionType.IN) return "in";
    if (type === TransactionType.OUT) return "out";
    throw new Error(`Unknown TransactionType provided: ${type}`);
};

export enum TransactionStatus {
    REJECTED = 1,
    PENDING = 2,
    CANCELLED = 3,
    REVIEWING = 4,
    DISPUTING = 5,
    COMPLETED = 6,
    FAILED = 7,
    PARTIAL = 8,
    REFUND_REQUESTED = 9,
    REFUNDING = 10,
    REFUNDED = 11,
    REFUND_FAILED = 12,
    REDIRECT = 13,
}

export const TransactionStatusRepr: Record<TransactionStatus, string> = {
    [TransactionStatus.REJECTED]: "rejected",
    [TransactionStatus.PENDING]: "pending",
    [TransactionStatus.CANCELLED]: "cancelled",
    [TransactionStatus.REVIEWING]: "reviewing",
    [TransactionStatus.DISPUTING]: "disputing",
    [TransactionStatus.COMPLETED]: "completed",
    [TransactionStatus.FAILED]: "failed",
    [TransactionStatus.PARTIAL]: "partial",
    [TransactionStatus.REFUND_REQUESTED]: "refund_requested",
    [TransactionStatus.REFUNDING]: "refunding",
    [TransactionStatus.REFUNDED]: "refunded",
    [TransactionStatus.REFUND_FAILED]: "refund_failed",
    [TransactionStatus.REDIRECT]: "redirect",
};

export const getTransactionStatusRepr = (status: TransactionStatus) => {
    if (status === TransactionStatus.REJECTED) return "rejected";
    if (status === TransactionStatus.PENDING) return "pending";
    if (status === TransactionStatus.CANCELLED) return "cancelled";
    if (status === TransactionStatus.REVIEWING) return "reviewing";
    if (status === TransactionStatus.DISPUTING) return "disputing";
    if (status === TransactionStatus.COMPLETED) return "completed";
    if (status === TransactionStatus.FAILED) return "failed";
    if (status === TransactionStatus.PARTIAL) return "partial";
    if (status === TransactionStatus.REFUND_REQUESTED) return "refund_requested";
    if (status === TransactionStatus.REFUNDING) return "refunding";
    if (status === TransactionStatus.REFUNDED) return "refunded";
    if (status === TransactionStatus.REFUND_FAILED) return "refund_failed";
    if (status === TransactionStatus.REDIRECT) return "redirect";
    throw new Error(`Unknown TransactionType provided: ${status}`);
};

export const getTransactionStatusGroup = (status: TransactionStatus) => {
    if ([
        TransactionStatus.REVIEWING,
        TransactionStatus.PENDING
    ].includes(status)) return "active";
    if ([
        TransactionStatus.FAILED,
        TransactionStatus.CANCELLED,
        TransactionStatus.COMPLETED,
        TransactionStatus.REJECTED,
        TransactionStatus.REFUNDED,
        TransactionStatus.PARTIAL,
        TransactionStatus.REDIRECT,
    ].includes(status)) return "completed";
    if ([
        TransactionStatus.DISPUTING,
        TransactionStatus.REFUNDING,
        TransactionStatus.REFUND_REQUESTED,
        TransactionStatus.REFUND_FAILED,
    ].includes(status)) return "disputed";
    throw new Error(`Unknown TransactionStatus provided: ${status}`);
};

export enum TransactionStatusGroup {
    ACTIVE = "active",
    COMPLETED = "completed",
    DISPUTED = "disputed",
    CHECKING = "checking",
}
