import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Home, MapPin, DollarSign, Loader2, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Simple form state for Add/Edit
  const defaultForm = {
    title: '', type: 'House', location: '', price: '', bedrooms: '', bathrooms: '', availability_status: 'Available'
  };
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('properties').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success('Property updated');
      } else {
        const { error } = await supabase.from('properties').insert([formData]);
        if (error) throw error;
        toast.success('Property added');
      }
      setFormData(defaultForm);
      setEditingId(null);
      fetchProperties();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this property?')) return;
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted');
      fetchProperties();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500">Manage real estate listings and inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Panel */}
        <div className="card p-6 lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Property' : 'Add Property'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title / Address</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="123 Ocean Ave" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                  <option>House</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="450000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Beds</label>
                <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Baths</label>
                <input type="number" step="0.5" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="2.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Miami, FL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select value={formData.availability_status} onChange={e => setFormData({...formData, availability_status: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                <option>Available</option>
                <option>Pending</option>
                <option>Sold</option>
              </select>
            </div>
            <div className="pt-2 flex gap-2">
              <button disabled={saving} type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded shadow-sm hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center">
                {saving ? <Loader2 className="animate-spin h-5 w-5" /> : (editingId ? 'Update' : 'Save Property')}
              </button>
              {editingId && (
                <button type="button" onClick={() => {setEditingId(null); setFormData(defaultForm);}} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* List Panel */}
        <div className="card p-4 lg:col-span-2 overflow-y-auto max-h-[700px]">
          {loading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500 w-8 h-8"/></div>
          ) : properties.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No properties found. Add one to get started.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map(p => (
                <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${p.availability_status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.availability_status}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => {setEditingId(p.id); setFormData(p);}} className="p-1 text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 truncate">{p.title}</h3>
                  <p className="flex items-center text-gray-500 text-sm mt-1 mb-3"><MapPin size={14} className="mr-1"/> {p.location || 'No location'}</p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex gap-3 text-sm text-gray-600">
                      <span className="flex items-center"><Home size={14} className="mr-1"/> {p.type}</span>
                      <span>{p.bedrooms || 0} bds</span>
                      <span>{p.bathrooms || 0} ba</span>
                    </div>
                    <span className="font-bold text-blue-600">${Number(p.price).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
