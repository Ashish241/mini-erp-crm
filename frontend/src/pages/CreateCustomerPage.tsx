import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Save } from 'lucide-react';

export const CreateCustomerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    mobile: '',
    email: '',
    type: 'RETAIL',
    status: 'ACTIVE',
    address: '',
    gstNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/customers', formData);
      navigate('/customers');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map((e: any) => `${(e.field || '').replace('body.', '')}: ${e.message}`).join(', ');
        setError(`Validation error: ${messages}`);
      } else {
        setError(err.response?.data?.message || 'Failed to add customer. Please check your inputs.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Create Customer</h1>
          <p style={{ margin: 0 }}>Add a new client to the system</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/customers')}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1.5rem', backgroundColor: 'var(--status-danger-bg)', color: 'var(--status-danger)', borderRadius: '8px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Contact Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" />
            </div>
            
            <div className="form-group">
              <label>Business Name *</label>
              <input type="text" name="businessName" required value={formData.businessName} onChange={handleChange} placeholder="e.g. Acme Corp" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Mobile *</label>
              <input type="tel" name="mobile" required minLength={8} value={formData.mobile} onChange={handleChange} placeholder="e.g. 9876543210" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Optional" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Customer Type *</label>
              <select name="type" required value={formData.type} onChange={handleChange}>
                <option value="RETAIL">Retail</option>
                <option value="WHOLESALE">Wholesale</option>
                <option value="DISTRIBUTOR">Distributor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select name="status" required value={formData.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="LEAD">Lead</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>GST Number</label>
            <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="Optional" />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea name="address" required rows={3} value={formData.address} onChange={handleChange} placeholder="Full address details"></textarea>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/customers')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
