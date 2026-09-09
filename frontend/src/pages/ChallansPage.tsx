import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, FileText } from 'lucide-react';
import { api } from '../lib/api';

interface Challan {
  id: number;
  challanNumber: string;
  status: string;
  totalQuantity: number;
  createdAt: string;
  customer: {
    name: string;
    businessName: string;
  };
}

export const ChallansPage: React.FC = () => {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      const response = await api.get('/challans');
      setChallans(response.data.data);
    } catch (error) {
      console.error('Failed to fetch challans', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmChallan = async (id: number) => {
    try {
      await api.post(`/challans/${id}/confirm`);
      fetchChallans();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to confirm challan');
    }
  };

  const downloadPdf = async (id: number) => {
    try {
      const response = await api.get(`/challans/${id}`);
      const challanDetails = response.data;
      import('../utils/pdfGenerator').then(module => {
        module.generateChallanPDF(challanDetails);
      });
    } catch (error) {
      alert('Failed to download PDF');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'badge badge-success';
      case 'DRAFT': return 'badge badge-warning';
      case 'CANCELLED': return 'badge badge-danger';
      default: return 'badge';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Sales Challans</h1>
          <p style={{ margin: 0 }}>Manage deliveries and stock dispatches</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/challans/new')}>
          <Plus size={18} /> Create Challan
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading challans...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {challans.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.challanNumber}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>{c.customer.name} ({c.customer.businessName})</td>
                    <td>{c.totalQuantity} items</td>
                    <td><span className={getStatusBadge(c.status)}>{c.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => downloadPdf(c.id)}
                          title="Download PDF"
                        >
                          <FileText size={14} /> PDF
                        </button>
                        {c.status === 'DRAFT' && (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => confirmChallan(c.id)}
                          >
                            <CheckCircle size={14} /> Confirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {challans.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No challans found. Create a new draft challan to get started.
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
