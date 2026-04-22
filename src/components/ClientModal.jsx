import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, ShoppingBag, Heart, FileText, ClipboardList, PlusCircle } from 'lucide-react';

const ClientModal = ({ isOpen, onClose, onSave, client }) => {
  const initialData = {
    name: '',
    email: '',
    phone: '',
    buyer_or_seller: 'Buyer',
    preferences: '',
    notes: '',
    visited_properties: ''
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData(initialData);
    }
  }, [client, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{client ? 'Edit Client Profile' : 'Add New Client'}</h2>
            <p className="text-sm text-gray-400">Manage client data and interaction history.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form id="client-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Identity Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Identity & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="e.g. Johnathan Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Classification Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Client Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                  {['Buyer', 'Seller', 'Both'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, buyer_or_seller: type })}
                      className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                        formData.buyer_or_seller === type 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 leading-tight">Preferences</label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="e.g. 4BHK, Near Metro, High-floor"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* History & Notes Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Interaction History</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-gray-400" /> Visited Properties
                </label>
                <textarea
                  name="visited_properties"
                  value={formData.visited_properties}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="e.g. Sunset Villa #402, Downtown Condo A..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" /> Private Agent Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="e.g. High attention to detail, prefers quick closures..."
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all text-sm active:scale-95 shadow-sm"
          >
            Close
          </button>
          <button
            form="client-form"
            type="submit"
            className="flex-[2] py-3 px-6 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 text-sm active:scale-95 flex items-center justify-center gap-2"
          >
            {client ? 'Update Client' : 'Initialize Client'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
