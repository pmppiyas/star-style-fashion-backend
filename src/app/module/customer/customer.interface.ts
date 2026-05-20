export interface ICustomer {
  name?: string;

  phone: string;
  email?: string;

  address?: string;
  city?: string;
  area?: string;

  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: Date;

  isBlocked?: boolean;
  isVerified?: boolean;

  averageOrderValue?: number;

  note?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
