import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Bell, Palette, Globe, Shield, 
  Smartphone, Mail, Lock, CheckCircle2, 
  Moon, Sun, Upload, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsSection = ({ title, subtitle, children, icon: Icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
        <Icon size={22} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm font-medium text-gray-400">{subtitle}</p>
      </div>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </motion.div>
);

const InputField = ({ label, placeholder, type = 'text', value, onChange, icon: Icon }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />}
      <input 
        type={type}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-12' : 'px-6'} pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-bold tracking-tight text-gray-700`}
      />
    </div>
  </div>
);

const ToggleSwitch = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
    <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{label}</span>
    <button 
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

export const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  const handleUpdate = () => {
    toast.success("Preferences updated successfully");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personalization and platform parameters.</p>
        </div>
        <button onClick={handleUpdate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm">
          <RefreshCw size={16} /> Synchronize All
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Profile Management */}
        <SettingsSection title="Identity" subtitle="Manage your professional dossier and credentials" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Designation" placeholder="Sarah Jenkins" icon={User} />
            <InputField label="Email Access" placeholder="sarah@agnayi.com" type="email" icon={Mail} />
            <InputField label="Direct Contact" placeholder="+1 (555) 902-1244" icon={Smartphone} />
            <InputField label="Specialization" placeholder="Luxury Waterfront" icon={Globe} />
          </div>
          <div className="pt-4">
            <button className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
              <Lock size={14} /> Update Security Protocol
            </button>
          </div>
        </SettingsSection>

        {/* Platform Aesthetics */}
        <SettingsSection title="Aesthetics" subtitle="Interface visualization and branding controls" icon={Palette}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div 
               onClick={() => setDarkMode(false)}
               className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${!darkMode ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-white'}`}
             >
               <div className="flex items-center gap-3">
                 <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${!darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                   <Sun size={20} />
                 </div>
                 <span className={`text-xs font-black uppercase tracking-widest ${!darkMode ? 'text-blue-600' : 'text-gray-400'}`}>Solar Base</span>
               </div>
               {!darkMode && <CheckCircle2 size={18} className="text-blue-600" />}
             </div>

             <div 
               onClick={() => setDarkMode(true)}
               className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${darkMode ? 'border-indigo-600 bg-indigo-50' : 'border-gray-50 bg-white'}`}
             >
               <div className="flex items-center gap-3">
                 <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                   <Moon size={20} />
                 </div>
                 <span className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-indigo-600' : 'text-gray-400'}`}>Orbit Alpha</span>
               </div>
               {darkMode && <CheckCircle2 size={18} className="text-indigo-600" />}
             </div>
           </div>

           <div className="space-y-4 pt-4 border-t border-gray-50">
             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Mark</label>
             <div className="flex items-center gap-6">
               <div className="h-20 w-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer group">
                  <Upload size={24} className="group-hover:scale-110 transition-transform" />
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-700">PNG or SVG format</p>
                  <p className="text-xs text-gray-400 font-medium">Max resolution: 512x512px</p>
               </div>
             </div>
           </div>
        </SettingsSection>

        {/* Alert Matrix */}
        <SettingsSection title="Alert Protocols" subtitle="Synchronize communications across terminals" icon={Bell}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch label="Direct Email Intelligence" enabled={emailAlerts} onChange={setEmailAlerts} />
            <ToggleSwitch label="Terminal Push Notifications" enabled={pushAlerts} onChange={setPushAlerts} />
            <ToggleSwitch label="Daily Performance Recap" enabled={true} onChange={() => {}} />
            <ToggleSwitch label="Inquiry Alert Ping" enabled={false} onChange={() => {}} />
          </div>
        </SettingsSection>

        {/* Structural Logic */}
        <SettingsSection title="Governance" subtitle="Organization-wide policies and API tokens" icon={Shield}>
           <div className="space-y-4">
             <InputField label="Enterprise Domain" placeholder="agnayi.crm.io" icon={Globe} />
             <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master API Token</h4>
                 <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase">Active</span>
               </div>
               <div className="flex gap-3">
                 <input readOnly value="sk_production_8829_xX55102L" className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-mono text-gray-500" />
                 <button className="px-4 py-2 bg-white border border-gray-200 text-[10px] font-black uppercase rounded-xl hover:bg-gray-100">Refresh</button>
               </div>
             </div>
           </div>
        </SettingsSection>

      </div>
    </motion.div>
  );
};
