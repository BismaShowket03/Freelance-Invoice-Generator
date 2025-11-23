import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { invoiceApi } from '../services/api';
import { Invoice } from '../types';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const InvoicePreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const data = await invoiceApi.getById(id!);
      setInvoice(data);
    } catch (error: any) {
      toast.error('Failed to load invoice');
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!id) return;

    try {
      setDownloading(true);
      await invoiceApi.downloadPDF(id);
      toast.success('PDF downloaded successfully');
    } catch (error: any) {
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  const getClient = () => {
    if (!invoice) return null;
    if (typeof invoice.clientId === 'object' && invoice.clientId !== null) {
      return invoice.clientId;
    }
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!invoice) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-gray-500 mb-4">Invoice not found</p>
          <Link to="/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const client = getClient();

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Invoice Preview</h1>
          <div className="flex space-x-2">
            <Button onClick={handleDownloadPDF} disabled={downloading}>
              {downloading ? 'Downloading...' : 'Download PDF'}
            </Button>
            <Link to="/invoices">
              <Button variant="secondary">Back to Invoices</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date(invoice.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Due Date:</span>{' '}
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <Badge status={invoice.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Client Details */}
          {client && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
              <p className="text-gray-700">{client.name}</p>
              <p className="text-gray-700">{client.email}</p>
              <p className="text-gray-700">{client.phone}</p>
              <p className="text-gray-700">{client.address}</p>
            </div>
          )}

          {/* Items Table */}
          <div className="mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax:</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InvoicePreview;

