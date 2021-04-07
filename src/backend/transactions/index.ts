// pending,
// confident,
// confidentError,
// confidentRetry,
// confirmed,
// confirmedError,
// confirmedRetry,
// cancelled,

export enum TransactionStatus {
  Pending = "pending",
  Confirmed = "confirmed"
}

export enum TransactionType {
  Deposit = "deposit",
  Withdrawal = "withdrawal",
  Internal = "internal"
}

export { Transaction } from "./transaction.entity";
export { TransactionMeta } from "./transaction-meta.entity";
