import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0].id);
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedUser);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">E-Office</h1>
            <p className="text-blue-100 text-sm">Hệ thống quản lý công văn nội bộ</p>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Đăng nhập với vai trò (Demo)</label>
                    <select 
                        value={selectedUser} 
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {MOCK_USERS.map(u => (
                            <option key={u.id} value={u.id}>
                                {u.name} - {u.role === UserRole.ADMIN ? 'Admin' : u.role === UserRole.CLERK ? 'Văn thư' : 'Nhân viên'}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-600/30"
                >
                    Đăng nhập
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                    Hệ thống quản lý công văn nội bộ – chỉ dành cho nhân viên công ty.
                </p>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
