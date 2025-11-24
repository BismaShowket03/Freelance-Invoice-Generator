import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  currency: string;
  logoUrl?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    logoUrl: { type: String },
    currency: { type: String, enum: ['INR', 'USD', 'EUR', 'GBP'], default: 'USD' },
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);


