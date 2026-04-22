import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, Mail, Phone, Calendar as CalendarIcon, Tag, Flame, Loader2 } from 'lucide-react';
import LeadModal from '../components/LeadModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/SkeletonLoader';

const StatusBadge = ({ status }) => {
  const colors = {
    'New': 'bg-blue-100 text-blue-800 border-blue-200',
    'Contacted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Qualified': 'bg-purple-100 text-purple-800 border-purple-200',
    'Closed': 'bg-green-100 text-green-800 border-green-200',
    'Lost': 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const ScoreBadge = ({ score }) => {
  const colors = {
    'Hot': 'text-red-600 bg-red-50',
    'Warm': 'text-orange-500 bg-orange-50',
    'Cold': 'text-slate-500 bg-slate-100',
  };
  return (
    <span className={`flex justify-center items-center px-2 py-1 rounded-md text-xs font-bold ${colors[score]}`}>
      <Flame size={12} className="mr-1" /> {score}
    </span>
  );
};

export const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lead = null) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (leadData.id) {
        // Update
        const { error } = await supabase
          .from('leads')
          .update(leadData)
          .eq('id', leadData.id);
        if (error) throw error;
        toast.success('Lead updated successfully');
      } else {
        // Insert
        const { id, ...insertData } = leadData;
        const { error } = await supabase
          .from('leads')
          .insert([insertData]);
        if (error) throw error;
        toast.success('Lead added successfully');
      }
      fetchLeads();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) throw error;
        toast.success('Lead deleted');
        fetchLeads();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const displayLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-sm text-gray-500">View, track, and manage all your prospects.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} /> Add Lead
        </button>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 rounded-t-xl">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="p-8">
                <TableSkeleton rows={5} cols={6} />
             </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Lead Info</th>
                  <th className="px-6 py-3 font-medium">Status / Score</th>
                  <th className="px-6 py-3 font-medium">Budget / Source</th>
                  <th className="px-6 py-3 font-medium">Agent</th>
                  <th className="px-6 py-3 font-medium">Follow-Up</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {displayLeads.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12">
                      <EmptyState 
                        title="No Prospects Found"
                        message="Your lead search or filters returned zero matches. Refine your query or onboard a new lead to begin."
                        icon={Users}
                        actionLabel="Add New Lead"
                        onAction={() => handleOpenModal()}
                      />
                    </td>
                  </tr>
                ) : displayLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{lead.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Mail size={12} /> {lead.email || 'No email'}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Phone size={12} /> {lead.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      <StatusBadge status={lead.status} />
                      <div className="mt-1">
                        <ScoreBadge score={lead.score} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{lead.budget || '-'}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Tag size={12}/> {lead.source || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {lead.assigned_agent || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {lead.followup_date ? (
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <CalendarIcon size={14} className="text-blue-500" />
                          {lead.followup_date}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No reminder set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center border border-gray-200 rounded-lg p-1 bg-white">
                        <button onClick={() => handleOpenModal(lead)} className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium transition">Edit</button>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button onClick={() => handleDelete(lead.id)} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-xl">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{displayLeads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="font-semibold text-gray-900">{filteredLeads.length}</span> Entries
            </span>
            <div className="inline-flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Prev
              </button>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-sm font-medium">
                {currentPage}
              </div>
              <button 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveLead}
        lead={editingLead}
      />
    </motion.div>
  );
};
