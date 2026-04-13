import { IStatus, IUser, Role } from '@app/module/user/user.interface';
import { model, Schema, Types } from 'mongoose';

const UserSchema = new Schema<IUser>(
  {
    _id: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    name: {
      type: String,
    },
    number: {
      type: String,
      required: true,
    },
    location: {
      type: [String],
    },
    role: {
      type: String,
      enum: Object.values(Role),
    },
    status: {
      type: String,
      enum: Object.values(IStatus),
      default: () => IStatus.ACTIVE,
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>('User', UserSchema);
