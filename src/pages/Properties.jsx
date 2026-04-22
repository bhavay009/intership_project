import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, LayoutGrid, List, Map, 
  ChevronDown, MapPin, DollarSign, Home, Maximize2, 
  Bed, Bath, MoreHorizontal, Edit, Trash2, Loader2,
  X, Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import PropertyModal from '../components/PropertyModal';

const PropertyCard = ({ property, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
        alt={property.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
          property.availability_status === 'Available' 
            ? 'bg-emerald-500/80 text-white border-emerald-400' 
            : 'bg-amber-500/80 text-white border-amber-400'
        }`}>
          {property.availability_status}
        </span>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
          <button onClick={() => onEdit(property)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-white transition-colors">
            <Edit size={16} />
          </button>
          <button onClick={() => onDelete(property.id)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-white transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
    
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 text-lg leading-tight truncate flex-1">{property.title}</h3>
        <span className="text-blue-600 font-bold text-lg ml-2">${Number(property.price).toLocaleString()}</span>
      </div>
      
      <p className="text-gray-500 text-sm flex items-center mb-4">
        <MapPin size={14} className="mr-1 text-gray-400" /> {property.location}
      </p>
      
      <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4">
        <div className="flex flex-col items-center">
          <Bed size={16} className="text-gray-400 mb-1" />
          <span className="text-xs font-semibold text-gray-700">{property.bedrooms} Beds</span>
        </div>
        <div className="flex flex-col items-center border-x border-gray-50">
          <Bath size={16} className="text-gray-400 mb-1" />
          <span className="text-xs font-semibold text-gray-700">{property.bathrooms} Baths</span>
        </div>
        <div className="flex flex-col items-center">
          <Maximize2 size={16} className="text-gray-400 mb-1" />
          <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
            {property.size_sqft}<br/>sqft
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const MapPlaceholder = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-5xl h-[80vh] overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Map className="text-blue-600" /> Interactive Map Preview
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 bg-slate-100 relative group overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <MapPin size={48} className="text-blue-500" />
              </div>
              <p className="text-lg font-medium text-slate-500">Stylized Map Integration Placeholder</p>
              <p className="text-sm mt-1">Real-time geospatial data syncing enabled.</p>
              
              {/* Abstract Map Design */}
              <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
            
            {/* Random Pin Placeholders */}
            <div className="absolute top-1/3 left-1/4 animate-bounce"><MapPin className="text-red-500 fill-current" /></div>
            <div className="absolute top-2/3 left-3/4 animate-bounce" style={{animationDelay: '1s'}}><MapPin className="text-blue-500 fill-current" /></div>
            <div className="absolute top-1/2 left-1/2 animate-bounce" style={{animationDelay: '0.5s'}}><MapPin className="text-emerald-500 fill-current" /></div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Properties = () => {
  const [view, setView] = useState('grid');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(formData)
          .eq('id', editingProperty.id);
        if (error) throw error;
        toast.success("Property updated!");
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([formData]);
        if (error) throw error;
        toast.success("Property created!");
      }
      fetchProperties();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      toast.success("Property deleted");
      fetchProperties();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || p.availability_status === statusFilter;
    const matchesMinPrice = minPrice === '' || Number(p.price) >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || Number(p.price) <= Number(maxPrice);
    
    return matchesSearch && matchesType && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Property Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage and monitor your full real estate inventory.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setView('table')}
              className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={20} />
            </button>
          </div>
          <button 
            onClick={() => setIsMapOpen(true)}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-semibold shadow-sm"
          >
            <Map size={18} /> Map
          </button>
          <button 
            onClick={() => { setEditingProperty(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> Add Property
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, address, or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Types</option>
            <option>House</option>
            <option>Villa</option>
            <option>Apartment</option>
            <option>Commercial</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Sold">Sold</option>
          </select>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
             <span className="text-xs font-bold text-gray-400">$</span>
             <input 
               type="number" 
               placeholder="Min" 
               value={minPrice}
               onChange={(e) => setMinPrice(e.target.value)}
               className="w-20 bg-transparent border-none text-sm outline-none font-medium"
             />
             <span className="text-gray-300">-</span>
             <input 
               type="number" 
               placeholder="Max" 
               value={maxPrice}
               onChange={(e) => setMaxPrice(e.target.value)}
               className="w-20 bg-transparent border-none text-sm outline-none font-medium"
             />
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500 font-medium">Syncing property records...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProperties.length > 0 ? (
                filteredProperties.map(p => (
                  <PropertyCard 
                    key={p.id} 
                    property={p} 
                    onEdit={(p) => { setEditingProperty(p); setIsModalOpen(true); }}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <Home size={64} className="mx-auto text-gray-200 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">No properties found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProperties.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image_url} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                            <div className="font-bold text-gray-900">{p.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.location}</td>
                        <td className="px-6 py-4 font-bold text-blue-600">${Number(p.price).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.bedrooms} bds • {p.bathrooms} ba • {p.size_sqft} sqft
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            p.availability_status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {p.availability_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => { setEditingProperty(p); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                             <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Overlays */}
      <PropertyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        property={editingProperty}
      />
      <MapPlaceholder 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />
    </motion.div>
  );
};
