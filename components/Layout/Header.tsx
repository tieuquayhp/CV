import React from 'react';
import { Bell, Search, LogOut, ChevronDown, Menu } from 'lucide-react';
import { User, UserRole } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, toggleSidebar }) => {
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'Quản trị viên';
      case UserRole.CLERK: return 'Văn thư';
      case UserRole.STAFF: return 'Nhân viên';
      default: return 'User';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-64 z-10 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden p-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-md">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">Quản lý công văn nội bộ</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm nhanh..." 
            className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder-slate-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-slate-800">{user.name}</div>
            <div className="text-xs text-slate-500">{getRoleName(user.role)} {user.departmentName ? ` - ${user.departmentName}` : ''}</div>
          </div>
          
          <button 
            onClick={onLogout}
            className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
