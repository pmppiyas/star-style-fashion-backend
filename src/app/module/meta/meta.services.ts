import { Category } from '../category/category.model';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';

const getAdminMeta = async () => {
  const totalRevenue = await Order.aggregate([
    {
      $match: {
        status: 'CONFIRMED',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: '$subtotal',
        },
      },
    },
  ]);

  const grandRevenue = await Order.aggregate([
    {
      $match: {
        status: 'CONFIRMED',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: '$grandTotal',
        },
      },
    },
  ]);

  const total = await Order.countDocuments();
  const pending = await Order.countDocuments({
    status: 'PENDING',
  });
  const confirm = await Order.countDocuments({
    status: 'CONFIRMED',
  });
  const cancel = await Order.countDocuments({
    status: 'CANCELLED',
  });

  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('customer');

  const lowStockProducts = await Product.find({
    stock: { $lte: 5 },
  })
    .sort({ stock: 1 })
    .limit(5);

  return {
    totalRevenue,
    grandRevenue,
    order: {
      total,
      pending,
      confirm,
      cancel,
    },
    totalProducts,
    totalCategories,

    recentOrders,
    lowStockProducts,
  };
};

export const MetaServices = {
  getAdminMeta,
};
