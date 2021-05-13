export interface IPayoutRequest {
  _id: any;
  source?: string;
  sourceId?: string;
  sourceInfo?: any;
  paymentAccountInfo: any;
  requestNote?: string;
  adminNote?: string;
  status?: string;
  requestTokens?: number;
  createdAt?: Date;
  updatedAt?: Date;
}