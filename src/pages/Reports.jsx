import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, FileText, Database, TrendingUp, 
  Users, BarChart3, PieChart as PieIcon, Loader2,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Cell, Pie, LineChart, Line, Legend
} from 'recharts';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 40000 },
  { month: 'Feb', revenue: 52000, target: 42000 },
  { month: 'Mar', revenue: 48000, target: 45000 },
  { month: 'Apr', revenue: 61000, target: 48000 },
  { month: 'May', revenue: 55000, target: 50000 },
  { month: 'Jun', revenue: 67000, target: 52000 },
];

const conversionData = [
  { name: 'New Leads', value: 400, color: '#3b82f6' },
  { name: 'Contacted', value: 300, color: '#8b5cf6' },
  { name: 'Qualified', value: 200, color: '#f59e0b' },
  { name: 'Closed', value: 50, color: '#10b981' },
];

const agentData = [
  { name: 'Sarah J.', volume: 1.2, leads: 45 },
  { name: 'Mike T.', volume: 0.9, leads: 38 },
  { name: 'Emma W.', volume: 0.8, leads: 32 },
  { name: 'David L.', volume: 0.7, leads: 28 },
];

const ReportsCard = ({ title, subtitle, children, icon: Icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-6 flex flex-col h-full"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
        <Icon size={20} />
      </div>
    </div>
    <div className="flex-1 min-h-[300px]">
      {children}
    </div>
  </motion.div>
);

export const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [dbStats, setDbStats] = useState({ totalDeals: 0, avgDealValue: 0 });

  useEffect(() => {
    const fetchDbAnalytics = async () => {
      try {
        setLoading(true);
        const { data: deals } = await supabase.from('deals').select('amount');
        if (deals) {
          const total = deals.reduce((sum, d) => sum + Number(d.amount), 0);
          setDbStats({
            totalDeals: deals.length,
            avgDealValue: deals.length ? total / deals.length : 0
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDbAnalytics();
  }, []);

  const handleExport = (type) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Generating ${type} report...`,
        success: `${type} Report downloaded successfully`,
        error: 'Export failed!',
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">View detailed performance metrics and financial forensics.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => handleExport('CSV')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
          >
            <Database size={16} /> Export CSV
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Market Volume', value: '$8.4M', trend: '+12%', icon: TrendingUp },
          { label: 'Client Retention', value: '94%', trend: '+2%', icon: Users },
          { label: 'Active Pipeline', value: dbStats.totalDeals, trend: 'Global', icon: BarChart3 },
          { label: 'Avg. Transaction', value: `$${(dbStats.avgDealValue/1000).toFixed(1)}K`, trend: 'Market', icon: DollarSign },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <kpi.icon size={18} />
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{kpi.trend}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ReportsCard title="Revenue Growth" subtitle="Monthly actual vs target revenue performance" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </ReportsCard>

        <ReportsCard title="Conversion Funnel" subtitle="Lead processing stages and close rates" icon={PieIcon}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600, fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ border: 'none', borderRadius: '12px' }} />
              <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                {conversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportsCard>

        <ReportsCard title="Agent Performance" subtitle="Sales volume per assigned representative ($M)" icon={Users}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="volume" name="Sales Volume ($M)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="leads" name="Leads Handled" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportsCard>

        <ReportsCard title="Regional Distribution" subtitle="Active inventory by geographic sector" icon={Database}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Downtown', value: 40 },
                  { name: 'Suburbs', value: 30 },
                  { name: 'Emerald Bay', value: 20 },
                  { name: 'Metro North', value: 10 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {[ '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b' ].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: 'none', borderRadius: '12px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ReportsCard>
      </div>
    </motion.div>
  );
};
