import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Briefcase, FileText, Settings, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
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

  return (
    <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} h-screen z-20`}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        {isOpen && (
          <span className="text-xl font-bold text-blue-600">
            Agnayi CRM
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="flex-shrink-0">{link.icon}</span>
            {isOpen && <span className="ml-3 text-sm">{link.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-400">
        {isOpen ? '© 2026 Agnayi CRM' : '©'}
      </div>
    </aside>
  );
};

export default Sidebar;
