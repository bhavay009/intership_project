import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, DollarSign, Calendar, User, Home, 
  MoreHorizontal, ChevronRight, Briefcase, 
  Loader2, Trash2, Edit, Percent, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import DealModal from '../components/DealModal';

const STAGES = ['Inquiry', 'Negotiation', 'Agreement', 'Closed'];

const DealCard = ({ deal, onEdit, onDelete, onMove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all group mb-4"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
          {deal.property_name.charAt(0)}
        </div>
        <h4 className="font-extrabold text-gray-900 text-sm tracking-tight truncate max-w-[120px]">{deal.property_name}</h4>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(deal)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
          <Edit size={14} />
        </button>
        <button onClick={() => onDelete(deal.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
        <User size={12} className="text-gray-300" /> {deal.client_name}
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Valuation</p>
          <p className="text-lg font-black text-blue-600 tracking-tighter">${Number(deal.amount).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Comm.</p>
          <p className="text-xs font-bold text-gray-700">{deal.commission}%</p>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
          <Calendar size={10} />
          {deal.closing_date ? new Date(deal.closing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
          <Briefcase size={10} />
          {deal.assigned_agent || 'Unassigned'}
        </div>
      </div>
    </div>

    {deal.stage !== 'Closed' && (
      <button 
        onClick={() => onMove(deal)}
        className="mt-4 w-full py-2 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center justify-center gap-2 group/btn"
      >
        Advance <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    )}
  </motion.div>
);

export const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setDeals(data || []);
    } catch (err) {
      toast.error("Pipeline Sync Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingDeal) {
        const { error } = await supabase.from('deals').update(formData).eq('id', editingDeal.id);
        if (error) throw error;
        toast.success("Transaction Record Updated");
      } else {
        const { error } = await supabase.from('deals').insert([formData]);
        if (error) throw error;
        toast.success("New Opportunity Logged");
      }
      setIsModalOpen(false);
      fetchDeals();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMove = async (deal) => {
    const currentIndex = STAGES.indexOf(deal.stage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      try {
        const { error } = await supabase
          .from('deals')
          .update({ stage: nextStage })
          .eq('id', deal.id);
        if (error) throw error;
        toast.success(`Deal moved to ${nextStage}`);
        fetchDeals();
      } catch (err) {
        toast.error("Migration Failed");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this transaction from history?")) return;
    try {
      const { error } = await supabase.from('deals').delete().eq('id', id);
      if (error) throw error;
      toast.success("Record Destroyed");
      fetchDeals();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Deal Pipeline</h1>
          <p className="text-gray-400 font-bold text-sm tracking-tight uppercase">High-Performance Transaction Kanban</p>
        </div>
        <button 
          onClick={() => { setEditingDeal(null); setIsModalOpen(true); }}
          className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95"
        >
          <Plus size={18} /> New Deal
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-8 -mx-4 px-4 min-h-[600px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Pipeline State</p>
          </div>
        ) : (
          <div className="flex gap-6 h-full min-w-max">
            {STAGES.map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage);
              const totalAmount = stageDeals.reduce((sum, d) => sum + Number(d.amount), 0);

              return (
                <div key={stage} className="w-[300px] flex flex-col group/column">
                  <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic">{stage}</h3>
                      <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{stageDeals.length}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 tracking-tighter">${(totalAmount / 1000).toFixed(1)}K</span>
                  </div>
                  
                  <div className="flex-1 bg-gray-50/50 rounded-[2rem] p-3 border border-gray-100/50 min-h-[500px]">
                    <AnimatePresence mode="popLayout">
                      {stageDeals.map(deal => (
                        <DealCard 
                          key={deal.id} 
                          deal={deal} 
                          onEdit={(d) => { setEditingDeal(d); setIsModalOpen(true); }}
                          onDelete={handleDelete}
                          onMove={handleMove}
                        />
                      ))}
                    </AnimatePresence>
                    
                    {stageDeals.length === 0 && (
                      <div className="h-full flex items-center justify-center px-6 text-center border-2 border-dashed border-gray-100 rounded-3xl m-2 opacity-30 group-hover/column:opacity-100 transition-opacity">
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose">No deals in {stage} stage</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DealModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        deal={editingDeal}
      />
    </motion.div>
  );
};
