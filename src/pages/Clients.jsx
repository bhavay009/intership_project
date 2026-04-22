import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Mail, Phone, 
  MapPin, Heart, FileText, Trash2, Edit, 
  Loader2, ShoppingBag, History
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import ClientModal from '../components/ClientModal';
import { CardSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const ClientCard = ({ client, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
  >
    {/* Profile Type Badge */}
    <div className="absolute top-0 right-0">
      <div className={`px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter ${
        client.buyer_or_seller === 'Buyer' ? 'bg-blue-600 text-white' : 
        client.buyer_or_seller === 'Seller' ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
      }`}>
        {client.buyer_or_seller} Profile
      </div>
    </div>

    <div className="flex items-start gap-4 mb-6">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl border ${
        client.buyer_or_seller === 'Buyer' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
        client.buyer_or_seller === 'Seller' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
      }`}>
        {client.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{client.name}</h3>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center text-xs text-gray-400 font-medium truncate">
            <Mail size={12} className="mr-1.5" /> {client.email}
          </div>
          <div className="flex items-center text-xs text-gray-400 font-medium">
            <Phone size={12} className="mr-1.5" /> {client.phone}
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      {client.preferences && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
             <Heart size={10} className="text-red-400" /> Preferences
           </div>
           <p className="text-xs text-gray-600 font-medium leading-relaxed italic">"{client.preferences}"</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">History</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold">
            <ShoppingBag size={12} className="text-blue-500" /> 
            {client.visited_properties ? client.visited_properties.split(',').length : 0} Tours
          </div>
        </div>
        <div className="flex flex-col gap-1">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added</span>
           <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold capitalize">
             <History size={12} className="text-emerald-500" />
             {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
           </div>
        </div>
      </div>
    </div>

    <div className="mt-8 pt-4 border-t border-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
      <button onClick={() => onDelete(client.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
        <Trash2 size={16} />
      </button>
      <button onClick={() => onEdit(client)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
        <Edit size={14} /> View Dossier
      </button>
    </div>
  </motion.div>
);

export const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      toast.error("Network error: Failed to fetch client roster");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingClient) {
        const { error } = await supabase.from('clients').update(formData).eq('id', editingClient.id);
        if (error) throw error;
        toast.success(`Client profile updated: ${formData.name}`);
      } else {
        const { error } = await supabase.from('clients').insert([formData]);
        if (error) throw error;
        toast.success(`New client onboarded: ${formData.name}`);
      }
      setIsModalOpen(false);
      fetchClients();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this client dossier?")) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      toast.success("Client data purged successfully");
      fetchClients();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Roster</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your active buyer and seller portfolio.</p>
        </div>
        <button 
          onClick={() => { setEditingClient(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
        >
          <UserPlus size={16} /> New Account
        </button>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search leads by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredClients.length > 0 ? (
              filteredClients.map(c => (
                <ClientCard 
                  key={c.id} 
                  client={c} 
                  onEdit={(cl) => { setEditingClient(cl); setIsModalOpen(true); }}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState 
                  title="No Client Dossiers"
                  message="Your current query doesn't match any existing client records. Onboard a new buyer or seller to grow your portfolio."
                  icon={Users}
                  actionLabel="New Account"
                  onAction={() => { setEditingClient(null); setIsModalOpen(true); }}
                />
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        client={editingClient}
      />
    </motion.div>
  );
};
