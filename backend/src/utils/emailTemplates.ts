import { IInvoice } from '../models/Invoice';
import { IClient } from '../models/Client';

interface InvoiceWithClient extends IInvoice {
  clientId: IClient;
}

export const buildInvoiceEmailTemplate = (invoice: InvoiceWithClient, client: IClient) => {
  const dueDate = new Date(invoice.dueDate).toLocaleDateString();
  const invoiceDate = new Date(invoice.date).toLocaleDateString();

  return `
    <div style="font-family: Arial, sans-serif; color: #1f2933; line-height: 1.6; padding: 24px;">
      <h2 style="color: #2563eb;">Hi ${client.name},</h2>
      <p>Thanks for your business! Please find your invoice attached.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tbody>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Invoice #:</td>
            <td style="padding: 8px 0;">${invoice.invoiceNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Invoice Date:</td>
            <td style="padding: 8px 0;">${invoiceDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Due Date:</td>
            <td style="padding: 8px 0;">${dueDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Amount Due:</td>
            <td style="padding: 8px 0;"><strong>$${invoice.total.toFixed(2)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Status:</td>
            <td style="padding: 8px 0;">${invoice.status.toUpperCase()}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-bottom: 16px;">Please review the attached PDF for a detailed breakdown of services and payment instructions.</p>

      <p style="margin-top: 24px;">Best regards,<br/>Freelance CRM Team</p>
    </div>
  `;
};


