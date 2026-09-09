import React, { useEffect, useState } from 'react';
import { Users, Package, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

interface Stats {
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  draftChallans: number;
  confirmedChallans: number;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading dashboard...</div>;
  if (!stats) return <div style={{ padding: '2rem', color: 'var(--status-danger)' }}>Failed to load stats.</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Dashboard Overview</h1>
          <p style={{ margin: 0 }}>Welcome back, here's what's happening today.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="title">Total Customers</span>
            <Users size={20} color="var(--text-muted)" />
          </div>
          <span className="value">{stats.totalCustomers}</span>
        </div>
        
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="title">Total Products</span>
            <Package size={20} color="var(--text-muted)" />
          </div>
          <span className="value">{stats.totalProducts}</span>
        </div>
        
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="title">Low Stock</span>
            <AlertTriangle size={20} color={stats.lowStockProducts > 0 ? 'var(--status-warning)' : 'var(--text-muted)'} />
          </div>
          <span className="value">
            {stats.lowStockProducts}
          </span>
        </div>
        
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="title">Draft Challans</span>
            <FileText size={20} color="var(--text-muted)" />
          </div>
          <span className="value">{stats.draftChallans}</span>
        </div>
        
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="title">Confirmed</span>
            <CheckCircle2 size={20} color="var(--status-success)" />
          </div>
          <span className="value">{stats.confirmedChallans}</span>
        </div>
      </div>
    </div>
  );
};
