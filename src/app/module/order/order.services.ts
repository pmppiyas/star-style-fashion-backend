import { Order } from './order.model';
import { Product } from '../../module/product/product.model';
import { AppError } from '../../error/appError';
import { StatusCodes } from 'http-status-codes';
import { IOrder, OrderStatus } from '../../module/order/order.interface';
import { Customer } from '../customer/customer.model';

const createOrder = async ({ payload }: { payload: IOrder }) => {
  const { items, customer, paymentMethod, shippingFee } = payload;

  if (!items.length) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'No items provided');
  }

  let subtotal = 0;

  const verifiedItems = [];

  for (const item of items) {
    const product = await Product.findOne({
      slug: item.slug,
    });

    if (!product) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        `Product not found: ${item.slug}`
      );
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `${product.name} has insufficient stock`
      );
    }

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    verifiedItems.push({
      slug: item.slug,
      quantity: item.quantity,
      size: item.size,
    });

    product.stock -= item.quantity;
    product.solded += item.quantity;

    await product.save();
  }

  const grandTotal = subtotal + shippingFee;

  let existingCustomer = await Customer.findOne({
    phone: customer.phone,
  });

  if (!existingCustomer) {
    existingCustomer = await Customer.create({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,

      totalOrders: 0,
      totalSpent: 0,
      orders: [],
    });
  }

  const order = await Order.create({
    customer,
    customerId: existingCustomer._id,
    paymentMethod,
    items: verifiedItems,
    subtotal,
    shippingFee,
    grandTotal,
    status: 'PENDING',
  });

  existingCustomer.orders.push(order._id);

  existingCustomer.totalOrders += 1;
  existingCustomer.totalSpent += grandTotal;

  existingCustomer.averageOrderValue =
    existingCustomer.totalSpent / existingCustomer.totalOrders;

  existingCustomer.lastOrderAt = new Date();

  await existingCustomer.save();

  return order;
};

const getOrders = async ({ status }: { status?: string }) => {
  const query: Record<string, any> = {};
  if (status) {
    query.status = status.toLocaleUpperCase();
  }
  const orders = await Order.find(query).sort({ createdAt: -1 });
  return orders;
};

const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  } else {
    order.status = status.toLocaleUpperCase() as OrderStatus;
    await order.save();
    return order;
  }
};

export const OrderService = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
