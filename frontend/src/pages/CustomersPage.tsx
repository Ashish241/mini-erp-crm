import React, { useEffect, useState } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

interface Customer {
  id: number;
  name: string;
  mobile: string;
  businessName: string;
  type: string;
  status: string;
}

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get(`/customers?search=${search}`);
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'badge badge-success';
      case 'LEAD': return 'badge badge-info';
      case 'INACTIVE': return 'badge badge-warning';
      default: return 'badge';
    }
  };

  const handleView = (customer: Customer) => {
    alert(`Customer Details:\n\nName: ${customer.name}\nBusiness: ${customer.businessName}\nMobile: ${customer.mobile}\nType: ${customer.type}\nStatus: ${customer.status}\n\n(Full edit page coming soon!)`);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Customers</h1>
          <p style={{ margin: 0 }}>Manage your clients and leads</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/customers/new')}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading customers...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Business Name</th>
                  <th>Mobile</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td>{c.businessName}</td>
                    <td>{c.mobile}</td>
                    <td>{c.type}</td>
                    <td><span className={getStatusBadge(c.status)}>{c.status}</span></td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleView(c)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No customers found. Try adjusting your search or add a new customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
