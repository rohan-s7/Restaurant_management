import React from 'react';
import { reportService } from '../../services/reportService';
import { formatCurrency } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { RevenueBarChart, CategoryDonutChart } from '../../components/common/Charts';
import { Download, Printer, TrendingUp, DollarSign, ShoppingBag, Users, Award, AlertTriangle } from 'lucide-react';

export const ReportsPage = () => {
  const { addToast } = useToast();
  const kpis = reportService.getDashboardKPIs();
  const chartData = reportService.getSalesChartData();
  const foodReports = reportService.getFoodReports();

  const handleExport = () => {
    addToast('Generating and downloading executive PDF summary report...', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Top action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-text-main)' }}>Executive Analytics & Reports</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Comprehensive sales audits, menu performance, and diner retention data
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-secondary btn-sm">
            <Printer size={16} />
            Print Report
          </button>
          <button onClick={handleExport} className="btn btn-primary btn-sm">
            <Download size={16} />
            Export Summary (CSV/PDF)
          </button>
        </div>
      </div>

      {/* 1. SALES REPORT METRICS */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>1. Sales & Revenue Audit</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Today's Revenue</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
              ₹24,850
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', fontWeight: 600 }}>
              +14% vs last Tuesday
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Weekly Revenue</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '4px' }}>
              ₹2,21,400
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', fontWeight: 600 }}>
              7-Day Net Profit margin: 38%
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Projected</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '4px' }}>
              ₹8,94,000
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              On track to exceed target
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Revenue Graph (Past 7 Days)</h4>
          <RevenueBarChart data={chartData.weeklyRevenue} />
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Category Performance Share</h4>
          <CategoryDonutChart data={chartData.popularCategories} />
        </div>
      </div>

      {/* 3. FOOD REPORT (TOP & LOW PERFORMING) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Most Ordered */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Award size={20} color="var(--color-primary)" />
            <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Top 5 Best-Selling Dishes</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {foodReports.topSelling.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.6rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.category} • {item.orders} orders</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                  {formatCurrency(item.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Least Ordered / Needs Promotion */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <AlertTriangle size={20} color="var(--color-warning)" />
            <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Least Ordered Items (Low Demand)</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {foodReports.lowSelling.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.6rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.category} • {item.orders} orders only</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {formatCurrency(item.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
