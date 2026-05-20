import { Types } from 'mongoose';

export interface IOrderItem {
  slug: string;
  quantity: number;
  size: string;
}

export interface ICustomerInfo {
  name: string;
  phone: string;
  address: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface IOrder {
  customer: ICustomerInfo;
  customerId?: Types.ObjectId;

  paymentMethod: string;
  items: IOrderItem[];

  subtotal: number;
  shippingFee: number;
  grandTotal: number;

  status: OrderStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
