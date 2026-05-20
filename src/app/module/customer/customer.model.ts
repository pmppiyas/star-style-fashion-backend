import { Schema, model } from 'mongoose';

const customerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    area: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ['facebook', 'website', 'whatsapp'],
      default: 'website',
    },

    customerType: {
      type: String,
      enum: ['REGULAR', 'VIP'],
      default: 'REGULAR',
    },

    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    averageOrderValue: {
      type: Number,
      default: 0,
    },

    lastOrderAt: {
      type: Date,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Customer = model('Customer', customerSchema);
