import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const LeadModal = ({ isOpen, onClose, onSave, lead }) => {
  const defaultState = {
    name: '',
    phone: '',
    email: '',
    budget: '',
    source: 'Website',
    preferences: '',
    assigned_agent: '',
    status: 'New',
    priority: 'Normal',
    followup_date: '',
    score: 'Warm',
    tags: ''
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData(defaultState);
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl p-4 w-full">
        <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100">
          
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {lead ? 'Edit Lead' : 'Add New Lead'}
            </h3>
            <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="+1 (555) 000-0000" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Budget</label>
                <input name="budget" value={formData.budget} onChange={handleChange} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="$500,000" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Source</label>
                <select name="source" value={formData.source} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Zillow">Zillow</option>
                  <option value="Cold Call">Cold Call</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Assigned Agent</label>
                <input name="assigned_agent" value={formData.assigned_agent} onChange={handleChange} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Jane Smith" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Closed">Closed</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">AI Score</label>
                <select name="score" value={formData.score} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Follow-up Date</label>
                <input name="followup_date" value={formData.followup_date || ''} onChange={handleChange} type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Tags (comma separated)</label>
                  <input name="tags" value={formData.tags} onChange={handleChange} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="VIP, Cash Buyer" />
                </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Preferences</label>
              <textarea name="preferences" value={formData.preferences} onChange={handleChange} rows="3" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Prefers 3 bed, 2 bath, near downtown..."></textarea>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Lead</button>
              <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">Cancel</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LeadModal;
