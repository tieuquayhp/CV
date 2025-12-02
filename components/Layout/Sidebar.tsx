import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  Book, 
  Users, 
  Building2, 
  Briefcase, 
  Settings,
  FileText,
  Building
} from 'lucide-react';
import { User, UserRole } from '../../types';

interface SidebarProps {
  user: User;
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activePage, onNavigate }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  // const isClerk = user.role === UserRole.CLERK;

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => onNavigate(id)}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
        activePage === id 
          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${activePage === id ? 'text-blue-600' : 'text-slate-400'}`} />
      {label}
    </button>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <FileText className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-bold text-slate-800 tracking-tight">E-Office</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Chung</div>
        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem id="incoming" icon={Inbox} label="Công văn đến" />
        <NavItem id="outgoing" icon={Send} label="Công văn đi" />

        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Danh mục</div>
        <NavItem id="projects" icon={Briefcase} label="Dự án" />
        <NavItem id="companies" icon={Building} label="Công ty phát hành" />
        <NavItem id="departments" icon={Building2} label="Phòng ban" />
        <NavItem id="employees" icon={Users} label="Nhân viên" />
        <NavItem id="doc-types" icon={Book} label="Loại công văn" />

        {isAdmin && (
          <>
            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Hệ thống</div>
            <NavItem id="admin" icon={Settings} label="Quản trị hệ thống" />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="text-xs text-slate-400 text-center">
          Phiên bản 1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
