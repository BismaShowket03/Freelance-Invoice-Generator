import express from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
  downloadInvoicePDF,
} from '../controllers/invoiceController';

const router = express.Router();

router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.get('/:id/pdf', downloadInvoicePDF);
router.post('/', createInvoice);
router.delete('/:id', deleteInvoice);

export default router;

