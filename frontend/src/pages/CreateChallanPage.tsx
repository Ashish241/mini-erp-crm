import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export const CreateChallanPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const custRes = await api.get('/customers?limit=100');
      const prodRes = await api.get('/products?limit=100');
      setCustomers(custRes.data.data);
      setProducts(prodRes.data.data);
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = field === 'quantity' ? parseInt(value) || 1 : value;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        customerId: parseInt(selectedCustomerId),
        items: items.map(item => ({
          productId: parseInt(item.productId),
          quantity: item.quantity
        }))
      };
      await api.post('/challans', payload);
      navigate('/challans');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create draft challan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Create Challan</h1>
          <p style={{ margin: 0 }}>Draft a new sales order</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/challans')}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Customer *</label>
            <select 
              required 
              value={selectedCustomerId} 
              onChange={e => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Choose a customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.businessName})</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3>Products</h3>
          </div>
          
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'end', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 300px', marginBottom: 0 }}>
                <label>Product *</label>
                <select 
                  required 
                  value={item.productId} 
                  onChange={e => handleItemChange(index, 'productId', e.target.value)}
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - Stock: {p.currentStock}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group" style={{ flex: '0 0 120px', marginBottom: 0 }}>
                <label>Qty *</label>
                <input 
                  type="number" 
                  min="1" 
                  required 
                  value={item.quantity}
                  onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                />
              </div>

              {items.length > 1 && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => handleRemoveItem(index)}
                  style={{ height: '46px', padding: '0 1rem' }}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleAddItem}
            style={{ marginBottom: '3rem' }}
          >
            <Plus size={18} /> Add Another Product
          </button>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/challans')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
