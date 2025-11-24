import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface IInvoice extends Document {
  clientId: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending';
  createdAt: Date;
  lastSentAt?: Date;
  emailSentCount?: number;
}

const InvoiceItemSchema: Schema = new Schema({
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than or equal to 0'],
  },
});

const InvoiceSchema: Schema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required'],
  },
  items: {
    type: [InvoiceItemSchema],
    required: [true, 'Invoice items are required'],
    validate: {
      validator: (items: IInvoiceItem[]) => items.length > 0,
      message: 'Invoice must have at least one item',
    },
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal must be greater than or equal to 0'],
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax must be greater than or equal to 0'],
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total must be greater than or equal to 0'],
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Invoice date is required'],
  },
  dueDate: {
    type: String,
    required: [true, 'Due date is required'],
  },
  status: {
    type: String,
    enum: ['paid', 'pending'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSentAt: {
    type: Date,
  },
  emailSentCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);

