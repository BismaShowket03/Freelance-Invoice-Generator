import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Clients from './pages/Clients';
import ClientForm from './pages/ClientForm';
import Invoices from './pages/Invoices';
import InvoiceForm from './pages/InvoiceForm';
import InvoicePreview from './pages/InvoicePreview';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/clients"
              element={
                <RequireAuth>
                  <Clients />
                </RequireAuth>
              }
            />
            <Route
              path="/clients/new"
              element={
                <RequireAuth>
                  <ClientForm />
                </RequireAuth>
              }
            />
            <Route
              path="/clients/edit/:id"
              element={
                <RequireAuth>
                  <ClientForm />
                </RequireAuth>
              }
            />
            <Route
              path="/invoices"
              element={
                <RequireAuth>
                  <Invoices />
                </RequireAuth>
              }
            />
            <Route
              path="/invoices/new"
              element={
                <RequireAuth>
                  <InvoiceForm />
                </RequireAuth>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <RequireAuth>
                  <InvoicePreview />
                </RequireAuth>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

