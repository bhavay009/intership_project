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
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Client Roster</h1>
          <p className="text-gray-400 font-bold text-sm tracking-tight">Active Buyer & Seller Portfolio Management</p>
        </div>
        <button 
          onClick={() => { setEditingClient(null); setIsModalOpen(true); }}
          className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-[2.5rem] hover:bg-blue-700 transition-all font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-200 active:scale-95"
        >
          <UserPlus size={18} /> New Account
        </button>
      </div>

      {/* Control Bar */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Filter clients by name, contact info, or dossier tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[2rem] text-sm font-bold tracking-tight outline-none focus:ring-4 focus:ring-blue-50 shadow-sm focus:shadow-xl transition-all placeholder:text-gray-300"
        />
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Synchronizing Local Roster</p>
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
              <div className="col-span-full py-32 text-center">
                <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={40} className="text-gray-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">No Dossiers Found</h3>
                <p className="text-gray-400 font-bold max-w-xs mx-auto mt-2 tracking-tight">Your search yielded no matched client profiles in the active database.</p>
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
