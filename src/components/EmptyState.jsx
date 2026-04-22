import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const EmptyState = ({ 
  title, 
  message, 
  icon: Icon, 
  actionLabel, 
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-gray-100 shadow-sm"
    >
      <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-inner">
        {Icon ? <Icon size={32} strokeWidth={1.5} /> : <div className="h-4 w-4 bg-blue-400 rounded-full animate-pulse" />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
      <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm font-medium leading-relaxed">
        {message}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-8 btn-primary"
        >
          <Plus size={18} /> {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
