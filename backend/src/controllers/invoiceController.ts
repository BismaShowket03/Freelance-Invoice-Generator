import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import Client, { IClient } from '../models/Client';
import { streamInvoicePDF, generateInvoicePDFBuffer } from '../services/pdfService';
import { sendInvoiceEmail as sendInvoiceEmailMessage } from '../services/emailService';
import { buildInvoiceEmailTemplate } from '../utils/emailTemplates';

// Generate unique invoice number
const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const { clientId, sortBy, sortOrder } = req.query;
    
    let query: any = {};
    if (clientId) {
      query.clientId = clientId;
    }

    let sort: any = { createdAt: -1 };
    if (sortBy === 'date') {
      sort = { date: sortOrder === 'asc' ? 1 : -1 };
    } else if (sortBy === 'amount') {
      sort = { total: sortOrder === 'asc' ? 1 : -1 };
    }

    const invoices = await Invoice.find(query)
      .populate('clientId', 'name email phone address')
      .sort(sort);
    
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate('clientId');

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { clientId, items, tax, date, dueDate, status } = req.body;

    if (!clientId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Client ID and items are required' });
    }

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.price);
    }, 0);

    const taxAmount = tax || 0;
    const total = subtotal + taxAmount;

    // Generate unique invoice number
    let invoiceNumber = generateInvoiceNumber();
    let exists = await Invoice.findOne({ invoiceNumber });
    while (exists) {
      invoiceNumber = generateInvoiceNumber();
      exists = await Invoice.findOne({ invoiceNumber });
    }

    const invoice = new Invoice({
      clientId,
      items,
      subtotal,
      tax: taxAmount,
      total,
      invoiceNumber,
      date: date || new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      status: status || 'pending',
    });

    const savedInvoice = await invoice.save();
    const populatedInvoice = await Invoice.findById(savedInvoice._id).populate('clientId');
    
    res.status(201).json(populatedInvoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadInvoicePDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate('clientId');

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const client = invoice.clientId as IClient;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    streamInvoicePDF(res, invoice as any, client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const sendInvoiceEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate('clientId');

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const client = invoice.clientId as IClient;
    if (!client.email) {
      return res.status(400).json({ error: 'Client does not have an email address' });
    }

    const pdfBuffer = await generateInvoicePDFBuffer(invoice as any, client);
    const html = buildInvoiceEmailTemplate(invoice as any, client);

    await sendInvoiceEmailMessage({
      to: client.email,
      subject: `Invoice ${invoice.invoiceNumber} - ${client.name}`,
      html,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    invoice.lastSentAt = new Date();
    invoice.emailSentCount = (invoice.emailSentCount || 0) + 1;
    await invoice.save();

    const updatedInvoice = await Invoice.findById(id).populate('clientId');

    res.json({ message: 'Invoice emailed successfully', invoice: updatedInvoice });
  } catch (error: any) {
    console.error('Failed to send invoice email', error);
    res.status(500).json({ error: error.message || 'Failed to send invoice email' });
  }
};

