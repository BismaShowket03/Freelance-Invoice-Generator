export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  _id: string;
  clientId: Client | string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending';
  createdAt: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceFormData {
  clientId: string;
  items: InvoiceItem[];
  tax: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending';
}

