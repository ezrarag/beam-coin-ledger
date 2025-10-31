export type LedgerEntryType = "ISSUANCE" | "REDEMPTION" | "ADJUSTMENT";

export type RedemptionStatus = "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "REJECTED";

export interface WalletBalance {
  userId: string;
  balance: number;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  amount: number;
  type: LedgerEntryType;
  refId?: string;
  note?: string;
  createdAt: Date;
}

export interface RedemptionRequest {
  id: string;
  userId: string;
  amount: number;
  status: RedemptionStatus;
  stripeTransferId?: string;
  stripePayoutId?: string;
  feeBps: number;
  createdAt: Date;
  updatedAt: Date;
}

