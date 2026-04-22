import React, { useState, useEffect } from 'react';
import { X, Briefcase, User, Home, DollarSign, Calendar, Percent, ShieldCheck } from 'lucide-react';

const STAGES = ['Inquiry', 'Negotiation', 'Agreement', 'Closed'];

const DealModal = ({ isOpen, onClose, onSave, deal }) => {
  const initialData = {
    client_name: '',
    property_name: '',
    amount: '',
    commission: '',
    closing_date: '',
    assigned_agent: '',
    stage: 'Inquiry'
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (deal) {
      setFormData(deal);
    } else {
      setFormData(initialData);
    }
  }, [deal, isOpen]);

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
      <div className="bg-white rounded-[2rem] w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Deal Parameters</h2>
            <p className="text-sm font-bold text-gray-400">Configure transaction specifics and commission rates.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Stakeholders</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  required
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-bold tracking-tight"
                  placeholder="Client Name"
                />
              </div>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  name="assigned_agent"
                  value={formData.assigned_agent}
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-bold tracking-tight"
                  placeholder="Lead Selling Agent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Asset & Value</label>
              <div className="relative group">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  required
                  name="property_name"
                  value={formData.property_name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-bold tracking-tight"
                  placeholder="Target Property Name/Address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    required
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-bold tracking-tight"
                    placeholder="Valuation"
                  />
                </div>
                <div className="relative group">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="commission"
                    value={formData.commission}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-bold tracking-tight"
                    placeholder="Comm. %"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Temporal & Status</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="date"
                  name="closing_date"
                  value={formData.closing_date}
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-bold tracking-tight"
                />
              </div>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-black text-gray-700 uppercase tracking-widest"
              >
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-8 bg-white border border-gray-200 text-gray-500 font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all text-[10px] active:scale-95"
          >
            Abort
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[2] py-4 px-8 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 text-[10px] active:scale-95"
          >
            {deal ? 'Finalize Changes' : 'Initialize Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealModal;
