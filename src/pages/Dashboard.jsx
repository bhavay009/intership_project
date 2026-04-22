import React from 'react';
import { TrendingUp, Users, Home, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon, trend }) => (
  <div className="card p-6">
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
  </div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors text-sm font-medium shadow-sm">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$2.4M" icon={<DollarSign />} trend="+12.5%" />
        <StatCard title="Properties Sold" value="142" icon={<Home />} trend="+8.2%" />
        <StatCard title="Active Clients" value="48" icon={<Users />} trend="+4.1%" />
        <StatCard title="New Leads" value="3,214" icon={<TrendingUp />} trend="+24.5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="card p-6 lg:col-span-2 min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h2>
          <div className="flex-1 rounded-xl bg-gray-50 border border-gray-200 border-dashed flex items-center justify-center">
            <span className="text-gray-400">Loading chart data...</span>
          </div>
        </div>
        <div className="card p-6 min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="flex-1 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center p-3 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-100 transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {i}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New deal closed</p>
                  <p className="text-xs text-gray-500">2 hours ago by Sarah J.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GenericPage = ({ title }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
    <div className="card p-6 min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-700">{title} Data</h2>
        <p className="text-gray-500 mt-2">Data syncing in progress...</p>
      </div>
    </div>
  </div>
);
