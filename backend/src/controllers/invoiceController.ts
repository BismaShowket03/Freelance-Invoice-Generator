import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import Client from '../models/Client';
import PDFDocument from 'pdfkit';

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

    const client = invoice.clientId as any;
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Invoice details
    doc.fontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, { align: 'left' });
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, { align: 'left' });
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, { align: 'left' });
    doc.text(`Status: ${invoice.status.toUpperCase()}`, { align: 'left' });
    doc.moveDown();

    // Client details
    doc.text('Bill To:', { align: 'left' });
    doc.text(client.name, { align: 'left' });
    doc.text(client.email, { align: 'left' });
    doc.text(client.phone, { align: 'left' });
    doc.text(client.address, { align: 'left' });
    doc.moveDown(2);

    // Items table
    const tableTop = doc.y;
    const itemHeight = 30;
    const tableLeft = 50;
    const descriptionWidth = 300;
    const quantityWidth = 80;
    const priceWidth = 100;
    const totalWidth = 100;

    // Table header
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Description', tableLeft, tableTop);
    doc.text('Qty', tableLeft + descriptionWidth, tableTop);
    doc.text('Price', tableLeft + descriptionWidth + quantityWidth, tableTop);
    doc.text('Total', tableLeft + descriptionWidth + quantityWidth + priceWidth, tableTop);

    // Table rows
    let y = tableTop + 20;
    doc.font('Helvetica');
    invoice.items.forEach((item) => {
      const itemTotal = item.quantity * item.price;
      doc.fontSize(10);
      doc.text(item.description, tableLeft, y, { width: descriptionWidth });
      doc.text(item.quantity.toString(), tableLeft + descriptionWidth, y);
      doc.text(`$${item.price.toFixed(2)}`, tableLeft + descriptionWidth + quantityWidth, y);
      doc.text(`$${itemTotal.toFixed(2)}`, tableLeft + descriptionWidth + quantityWidth + priceWidth, y);
      y += itemHeight;
    });

    // Totals
    y += 10;
    doc.moveTo(tableLeft, y).lineTo(tableLeft + descriptionWidth + quantityWidth + priceWidth + totalWidth, y).stroke();
    y += 20;

    doc.fontSize(12);
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, tableLeft + descriptionWidth + quantityWidth, y);
    y += 20;
    doc.text(`Tax: $${invoice.tax.toFixed(2)}`, tableLeft + descriptionWidth + quantityWidth, y);
    y += 20;
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text(`Total: $${invoice.total.toFixed(2)}`, tableLeft + descriptionWidth + quantityWidth, y);

    doc.end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

