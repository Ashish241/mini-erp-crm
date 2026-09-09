import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: string;
  currentStock: number;
  minimumStock: number;
  imageUrl?: string;
}

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products?search=${search}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (p: Product) => {
    const qtyStr = prompt(`Adjust stock for ${p.name} (${p.sku}).\nEnter quantity to ADD (use negative numbers to remove):`);
    if (!qtyStr) return;
    
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty)) {
      alert("Please enter a valid number");
      return;
    }

    try {
      await api.post(`/products/${p.id}/stock`, {
        quantity: Math.abs(qty),
        type: qty >= 0 ? 'IN' : 'OUT',
        reason: 'Manual adjustment'
      });
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to adjust stock');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Products & Inventory</h1>
          <p style={{ margin: 0 }}>Manage your catalog and stock levels</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/products/new')}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>No Img</div>
                      )}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.sku}</td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>${p.unitPrice}</td>
                    <td>
                      <span className={p.currentStock <= p.minimumStock ? 'badge badge-danger' : 'badge badge-success'}>
                        {p.currentStock} {p.currentStock <= p.minimumStock && '(Low)'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleAdjustStock(p)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        <Edit size={14} /> Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No products found. Try adjusting your search or add a new product.
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
