import { Search, Bell, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="h-16 w-full bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out sm:text-sm shadow-sm"
            placeholder="Search CRM..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-gray-500 hover:text-gray-700 transition relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || 'Agent'}</div>
            <div className="text-xs text-gray-500">{user?.user_metadata?.role || 'Logged In'}</div>
          </div>
          <button 
            onClick={handleLogout}
            title="Sign Out"
            className="h-10 w-10 px-2 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition shadow-sm"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
