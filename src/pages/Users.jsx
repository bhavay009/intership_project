import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users as UsersIcon, Shield, ShieldCheck, 
  ShieldAlert, UserPlus, Search, MoreVertical, 
  Check, X, Loader2 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ROLES = [
  { name: 'Admin', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', desc: 'Full system access & financial controls' },
  { name: 'Manager', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', desc: 'Team oversight & report generation' },
  { name: 'Agent', icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'Lead management & personal pipeline' },
];

const PERMISSIONS = [
  { key: 'leads_view', label: 'View Leads' },
  { key: 'leads_edit', label: 'Edit Leads' },
  { key: 'deals_view', label: 'View Pipeline' },
  { key: 'finance_view', label: 'Financial Reports' },
  { key: 'user_mgmt', label: 'User Management' },
];

const PermissionCell = ({ active }) => (
  <div className="flex justify-center">
    {active ? (
      <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
        <Check size={14} strokeWidth={3} />
      </div>
    ) : (
      <div className="h-6 w-6 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center">
        <X size={14} strokeWidth={3} />
      </div>
    )}
  </div>
);

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      toast.error("Failed to fetch staff roster");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          <p className="text-sm text-gray-500 mt-1">Define organizational hierarchy and personnel access.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm">
          <UserPlus size={16} /> Invite Colleague
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User List Detail */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="Search staff by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Personnel</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Assignment</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Created</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                   <tr>
                     <td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" size={32} /></td>
                   </tr>
                ) : filteredUsers.map(u => {
                  const roleObj = ROLES.find(r => r.name === u.role) || ROLES[2];
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 ${roleObj.bg} ${roleObj.color} flex items-center justify-center rounded-xl font-black text-lg border ${roleObj.border}`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 uppercase tracking-tight text-sm">{u.name}</div>
                            <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-blue-500 transition-all ${roleObj.bg} ${roleObj.color}`}
                        >
                          {ROLES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                          {new Date(u.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><MoreVertical size={18} /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Table Sidebar */}
        <div className="space-y-6">
          <div className="card p-8 bg-gray-900 text-white overflow-hidden relative">
            <ShieldAlert size={120} className="absolute -bottom-10 -right-10 text-white opacity-5 rotate-12" />
            <h3 className="text-xl font-black tracking-tighter uppercase italic mb-2">Access Matrix</h3>
            <p className="text-gray-400 text-sm font-medium mb-8">Current logic for organizational tier permissions.</p>
            
            <div className="space-y-6 relative z-10">
              {ROLES.map(role => (
                <div key={role.name} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <role.icon className={`mt-1 flex-shrink-0 ${role.color}`} size={20} />
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-[10px] mb-1">{role.name} Role</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 overflow-hidden">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Permission Grid</h3>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr>
                     <th className="text-left py-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">Key</th>
                     {ROLES.map(r => <th key={r.name} className="py-4 text-[9px] font-black text-gray-300 uppercase tracking-widest text-center">{r.name.charAt(0)}</th>)}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {PERMISSIONS.map(p => (
                      <tr key={p.key}>
                        <td className="py-4 text-[11px] font-bold text-gray-700">{p.label}</td>
                        <td className="py-4"><PermissionCell active={true} /></td>
                        <td className="py-4"><PermissionCell active={p.key.includes('view') && !p.key.includes('user')} /></td>
                        <td className="py-4"><PermissionCell active={p.key.includes('leads') || p.key === 'deals_view'} /></td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
