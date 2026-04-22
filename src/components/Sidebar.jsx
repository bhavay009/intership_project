import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building, Briefcase, 
  FileText, Settings, UserPlus, ChevronLeft, 
  ChevronRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen }) => {
  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/leads', icon: <UserPlus size={20} /> },
    { name: 'Properties', path: '/properties', icon: <Building size={20} /> },
    { name: 'Clients', path: '/clients', icon: <Users size={20} /> },
    { name: 'Deals', path: '/deals', icon: <Briefcase size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
        <AnimatePresence mode="wait">
          {(isOpen || isMobileOpen) && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-black text-blue-600 tracking-tighter italic"
            >
              AGNAYI CRM
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Desktop Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Mobile Close */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'
              }`
            }
          >
            <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
            <AnimatePresence>
              {(isOpen || isMobileOpen) && (
                <motion.span 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-3 text-sm whitespace-nowrap"
                >
                  {link.name}
                </motion.span>
              )}
            </AnimatePresence>
            {!isOpen && !isMobileOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {link.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {(isOpen || isMobileOpen) && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col border-r border-gray-100 transition-all duration-500 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } h-screen z-30 bg-white`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 z-[50] shadow-2xl bg-white"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
