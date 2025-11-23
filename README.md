# Freelance Invoice Generator

A complete full-stack web application for generating and managing invoices for freelancers. Built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- **Client Management**: Add, view, edit, and delete clients
- **Invoice Creation**: Create invoices with unlimited line items
- **Auto-calculation**: Automatic calculation of subtotal, tax, and total
- **Invoice Management**: View all invoices with filtering and sorting
- **PDF Generation**: Download invoices as PDF files
- **Status Tracking**: Track invoice status (Paid/Pending)
- **Responsive Design**: Fully responsive UI built with TailwindCSS

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- TailwindCSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- TypeScript
- Mongoose (MongoDB ODM)
- PDFKit (PDF generation)

### Database
- MongoDB

## Project Structure

```
Freelance-Invoice-Generator/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── clientController.ts
│   │   │   └── invoiceController.ts
│   │   ├── models/
│   │   │   ├── Client.ts
│   │   │   └── Invoice.ts
│   │   ├── routes/
│   │   │   ├── clientRoutes.ts
│   │   │   └── invoiceRoutes.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── src/
│   ├── components/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Textarea.tsx
│   ├── pages/
│   │   ├── Clients.tsx
│   │   ├── ClientForm.tsx
│   │   ├── Invoices.tsx
│   │   ├── InvoiceForm.tsx
│   │   └── InvoicePreview.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance-invoice-generator
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the root directory (if not already there):
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Clients

- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a new client
- `PUT /api/clients/:id` - Update a client
- `DELETE /api/clients/:id` - Delete a client

### Invoices

- `GET /api/invoices` - Get all invoices (supports query params: `clientId`, `sortBy`, `sortOrder`)
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/:id/pdf` - Download invoice as PDF
- `POST /api/invoices` - Create a new invoice
- `DELETE /api/invoices/:id` - Delete an invoice

## Database Schema

### Client Collection

```typescript
{
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}
```

### Invoice Collection

```typescript
{
  clientId: ObjectId;
  items: [
    {
      description: string;
      quantity: number;
      price: number;
    }
  ];
  subtotal: number;
  tax: number;
  total: number;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: "paid" | "pending";
  createdAt: Date;
}
```

## Usage

1. **Add Clients**: Navigate to the Clients page and click "Add New Client" to create client profiles.

2. **Create Invoices**: 
   - Go to the Invoices page
   - Click "Create New Invoice"
   - Select a client
   - Add line items (description, quantity, price)
   - Set tax amount
   - Set invoice date and due date
   - Click "Create Invoice"

3. **View Invoices**: 
   - View all invoices on the Invoices page
   - Filter by client
   - Sort by date or amount
   - Click "View" to see invoice details

4. **Download PDF**: 
   - Open an invoice preview
   - Click "Download PDF" to generate and download the invoice as a PDF

## Development

### Backend Development

```bash
cd backend
npm run dev  # Runs with hot reload using tsx
npm run build  # Builds TypeScript to JavaScript
npm start  # Runs the built application
```

### Frontend Development

```bash
npm run dev  # Starts Vite dev server
npm run build  # Builds for production
npm run preview  # Preview production build
```

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
npm run build
```

The production build will be in the `dist` directory.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
