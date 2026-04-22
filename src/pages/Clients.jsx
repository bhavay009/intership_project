import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, Mail, Phone, Loader2, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const defaultForm = { name: '', email: '', phone: '', buyer_or_seller: 'Buyer', preferences: '', notes: '' };
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setClients(data || []);
    } catch (error) { toast.error(error.message); } 
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('clients').update(formData).eq('id', editingId);
        if (error) throw error; toast.success('Client updated');
      } else {
        const { error } = await supabase.from('clients').insert([formData]);
        if (error) throw error; toast.success('Client added');
      }
      setFormData(defaultForm); setEditingId(null); fetchClients();
    } catch (error) { toast.error(error.message); } 
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this client?')) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error; toast.success('Deleted'); fetchClients();
    } catch (error) { toast.error(error.message); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Client Roster</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Client' : 'Add Client'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" placeholder="John Doe" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Email</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" placeholder="john@example.com" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Phone</label><input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" placeholder="555-0199" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Type</label><select value={formData.buyer_or_seller} onChange={e => setFormData({...formData, buyer_or_seller: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border"><option>Buyer</option><option>Seller</option><option>Both</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700">Preferences</label><input value={formData.preferences} onChange={e => setFormData({...formData, preferences: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" placeholder="3bd/2ba in suburbs" /></div>
            <div className="pt-2 flex gap-2">
              <button disabled={saving} type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded shadow-sm hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center">{saving ? <Loader2 className="animate-spin h-5 w-5" /> : (editingId ? 'Update' : 'Save')}</button>
              {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData(defaultForm);}} className="p-2 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="card p-4 lg:col-span-2 overflow-y-auto max-h-[700px]">
          {loading ? <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500 w-8 h-8"/></div> : 
           clients.length === 0 ? <div className="text-center text-gray-500 py-10">No clients yet.</div> :
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map(c => (
                <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded mb-2">{c.buyer_or_seller}</span>
                    <div className="flex gap-1"><button onClick={() => {setEditingId(c.id); setFormData(c);}} className="text-gray-400 hover:text-blue-600"><Edit size={16}/></button><button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button></div>
                  </div>
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <p className="flex items-center text-gray-500 text-sm mt-1"><Mail size={14} className="mr-1"/>{c.email}</p>
                  <p className="flex items-center text-gray-500 text-sm mt-1 mb-2"><Phone size={14} className="mr-1"/>{c.phone}</p>
                  <p className="text-xs text-gray-400 border-t pt-2 mt-2">{c.preferences}</p>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </motion.div>
  );
};
