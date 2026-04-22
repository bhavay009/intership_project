import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Home, DollarSign, Activity, 
  Plus, FileText, Mail, Calendar, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar
} from 'recharts';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

const leadGrowthData = [
  { name: 'Week 1', leads: 40 },
  { name: 'Week 2', leads: 55 },
  { name: 'Week 3', leads: 45 },
  { name: 'Week 4', leads: 80 },
];

const topAgentsData = [
  { name: 'Sarah J.', sales: 12 },
  { name: 'Mike T.', sales: 10 },
  { name: 'Emma W.', sales: 8 },
  { name: 'David L.', sales: 7 },
];

const recentActivity = [
  { id: 1, type: 'deal', text: 'Sarah J. closed Deal #4052', time: '10 mins ago', icon: <DollarSign size={16} /> },
  { id: 2, type: 'lead', text: 'New lead assigned to Mike T.', time: '1 hour ago', icon: <Users size={16} /> },
  { id: 3, type: 'property', text: '124 Beach Ave listed', time: '2 hours ago', icon: <Home size={16} /> },
  { id: 4, type: 'meeting', text: 'Meeting confirmed with Smith family', time: '3 hours ago', icon: <Calendar size={16} /> },
  { id: 5, type: 'deal', text: 'Emma W. closed Deal #4048', time: '5 hours ago', icon: <DollarSign size={16} /> },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const StatCard = ({ title, value, icon, trend }) => (
  <motion.div variants={itemVariants} className="card p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
      <span className="text-emerald-500 font-medium">{trend}</span>
      <span className="text-gray-500 ml-2">vs last month</span>
    </div>
  </motion.div>
);

export const Dashboard = () => {
  return (
    <motion.div 
      className="space-y-6 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header & Quick Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors text-sm font-medium shadow-sm">
            <FileText size={16} /> Report
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm">
            <Plus size={16} /> New Lead
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Leads" value="3,214" icon={<Users />} trend="+24.5%" />
        <StatCard title="Total Properties" value="842" icon={<Home />} trend="+12.2%" />
        <StatCard title="Active Deals" value="148" icon={<Activity />} trend="+4.1%" />
        <StatCard title="Monthly Revenue" value="$2.4M" icon={<DollarSign />} trend="+18.5%" />
        <StatCard title="Conversion Rate" value="4.2%" icon={<TrendingUp />} trend="+1.2%" />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Main Revenue Chart */}
        <motion.div variants={itemVariants} className="card p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg py-1 px-2">
              <option>This Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Sidebar */}
        <motion.div variants={itemVariants} className="card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            {recentActivity.map((activity, idx) => (
              <div key={activity.id} className="relative flex gap-4">
                {/* Timeline line */}
                {idx !== recentActivity.length - 1 && (
                  <div className="absolute top-8 left-4 bottom-0 w-px bg-gray-200 -ml-px"></div>
                )}
                
                <div className="relative mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 ring-4 ring-white">
                  <span className="text-blue-600">{activity.icon}</span>
                </div>
                
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lead Growth Chart */}
        <motion.div variants={itemVariants} className="card p-6 flex flex-col min-h-[300px]">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Lead Growth</h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Agents Chart */}
        <motion.div variants={itemVariants} className="card p-6 flex flex-col min-h-[300px] lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top Performing Agents</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              Leaderboard <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAgentsData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 13, fontWeight: 500}} width={70} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export const GenericPage = ({ title }) => (
  <motion.div 
    className="space-y-6"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
    <div className="card p-6 min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-700">{title} Data</h2>
        <p className="text-gray-500 mt-2">Data syncing in progress...</p>
      </div>
    </div>
  </motion.div>
);
