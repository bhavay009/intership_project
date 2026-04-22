import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Edit, Trash2, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const defaultForm = { client_name: '', property_name: '', amount: '', stage: 'Negotiation', commission: '', closing_date: '' };
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchDeals(); }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDeals(data || []);
    } catch (error) { toast.error(error.message); } 
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('deals').update(formData).eq('id', editingId);
        if (error) throw error; toast.success('Deal updated');
      } else {
        const { error } = await supabase.from('deals').insert([formData]);
        if (error) throw error; toast.success('Deal added');
      }
      setFormData(defaultForm); setEditingId(null); fetchDeals();
    } catch (error) { toast.error(error.message); } 
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this deal?')) return;
    try {
      const { error } = await supabase.from('deals').delete().eq('id', id);
      if (error) throw error; toast.success('Deleted'); fetchDeals();
    } catch (error) { toast.error(error.message); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Deal' : 'Add Deal'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Client Name</label><input required value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Property</label><input required value={formData.property_name} onChange={e => setFormData({...formData, property_name: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-sm font-medium text-gray-700">Amount ($)</label><input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Commission %</label><input type="number" step="0.1" required value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Stage</label>
              <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border">
                <option>Discovery</option><option>Offer</option><option>Negotiation</option><option>Closed Won</option><option>Closed Lost</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Closing Date</label><input type="date" value={formData.closing_date} onChange={e => setFormData({...formData, closing_date: e.target.value})} className="mt-1 block w-full rounded border-gray-300 p-2 border" /></div>
            
            <div className="pt-2 flex gap-2">
              <button disabled={saving} type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded shadow-sm hover:bg-blue-700">{saving ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Save'}</button>
              {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData(defaultForm);}} className="p-2 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="card p-4 lg:col-span-2 overflow-y-auto max-h-[700px]">
          {loading ? <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500 w-8 h-8"/></div> : 
           deals.length === 0 ? <div className="text-center text-gray-500 py-10">No deals active.</div> :
            <div className="space-y-4">
              {deals.map(d => (
                <div key={d.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md bg-white">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center"><Briefcase size={16} className="mr-2 text-blue-500"/> {d.property_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Client: {d.client_name}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center text-green-600 font-semibold"><DollarSign size={14}/>{Number(d.amount).toLocaleString()}</span>
                      <span className="flex items-center"><Calendar size={14} className="mr-1"/>{d.closing_date || 'TBD'}</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between mt-4 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.stage==='Closed Won'?'bg-green-100 text-green-700':d.stage==='Closed Lost'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{d.stage}</span>
                    <div className="flex gap-2 mt-2">
                       <button onClick={() => {setEditingId(d.id); setFormData(d);}} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                       <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </motion.div>
  );
};
