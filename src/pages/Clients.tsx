import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientApi } from '../services/api';
import { Client } from '../types';
import Button from '../components/Button';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientApi.getAll();
      setClients(data);
    } catch (error: any) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }
    try {
      await clientApi.delete(id);
      toast.success('Client deleted successfully');
      loadClients();
    } catch (error: any) {
      toast.error('Failed to delete client');
    }
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

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 px-2 pt-14 sm:pt-0">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 w-full sm:w-auto">Clients</h1>
        <Link to="/clients/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Add New Client</Button>
        </Link>
      </div>
      {clients.length === 0 ? (
        <div className="bg-white rounded-lg px-4 py-8 text-center">
          <p className="text-gray-500 mb-4">No clients found</p>
          <Link to="/clients/new">
            <Button className="w-full sm:w-auto">Add Your First Client</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-[650px] w-full text-xs sm:text-sm bg-white rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-4 sm:px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">{client.name}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-500">{client.email}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-500">{client.phone}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-500">{client.address}</td>
                  <td className="px-4 sm:px-6 py-4 text-right font-medium">
                    <Link
                      to={`/clients/edit/${client._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Clients;

