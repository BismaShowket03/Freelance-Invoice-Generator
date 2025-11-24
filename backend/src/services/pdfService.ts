import PDFDocument from 'pdfkit';
import { IInvoice } from '../models/Invoice';
import { IClient } from '../models/Client';

interface InvoiceWithClient extends IInvoice {
  clientId: IClient;
}

const renderInvoiceContent = (doc: PDFKit.PDFDocument, invoice: InvoiceWithClient, client: IClient) => {
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
};

export const streamInvoicePDF = (stream: NodeJS.WritableStream, invoice: InvoiceWithClient, client: IClient) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(stream);
  renderInvoiceContent(doc, invoice, client);
  doc.end();
};

export const generateInvoicePDFBuffer = (invoice: InvoiceWithClient, client: IClient): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (error) => reject(error));

    renderInvoiceContent(doc, invoice, client);
    doc.end();
  });
};


