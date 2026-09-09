import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Save } from 'lucide-react';

export const CreateProductPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitPrice: '',
    currentStock: '0',
    minimumStock: '10',
    warehouse: 'Main WH',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = null;

      // Upload image first if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        currentStock: parseInt(formData.currentStock),
        minimumStock: parseInt(formData.minimumStock),
        imageUrl
      };

      await api.post('/products', payload);
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add product. Please check your inputs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Create Product</h1>
          <p style={{ margin: 0 }}>Add a new item to inventory</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>
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
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Widget Pro" />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>SKU *</label>
              <input type="text" name="sku" required value={formData.sku} onChange={handleChange} style={{ textTransform: 'uppercase' }} placeholder="e.g. WID-001" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} placeholder="e.g. Electronics" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Unit Price ($) *</label>
              <input type="number" step="0.01" min="0" name="unitPrice" required value={formData.unitPrice} onChange={handleChange} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Warehouse *</label>
              <input type="text" name="warehouse" required value={formData.warehouse} onChange={handleChange} placeholder="e.g. Main WH" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Initial Stock *</label>
              <input type="number" min="0" name="currentStock" required value={formData.currentStock} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Minimum Stock *</label>
              <input type="number" min="0" name="minimumStock" required value={formData.minimumStock} onChange={handleChange} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
