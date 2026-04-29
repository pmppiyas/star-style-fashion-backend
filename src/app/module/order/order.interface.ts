export interface IOrderItem {
  slug: string;
  quantity: number;
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
  paymentMethod: string;
  items: IOrderItem[];

  subtotal: number;
  shippingFee: number;
  grandTotal: number;

  status: OrderStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
