import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import IncomingDocs from './pages/IncomingDocs';
import OutgoingDocs from './pages/OutgoingDocs';
import CategoryManager from './pages/CategoryManager';
import Login from './pages/Login';
import { 
  MOCK_USERS, 
  MOCK_INCOMING, 
  MOCK_OUTGOING, 
  MOCK_DEPARTMENTS, 
  MOCK_PROJECTS, 
  MOCK_CATEGORIES 
} from './constants';
import { User, IncomingDocument, OutgoingDocument } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data State
  const [incomingDocs, setIncomingDocs] = useState<IncomingDocument[]>(MOCK_INCOMING);
  const [outgoingDocs, setOutgoingDocs] = useState<OutgoingDocument[]>(MOCK_OUTGOING);

  // Load user from local storage logic skipped for simplicity in mock

  const handleLogin = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
        setCurrentUser(user);
        setActivePage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (activePage) {
      case 'dashboard':
        return (
            <Dashboard 
                user={currentUser} 
                incomingDocs={incomingDocs}
                outgoingDocs={outgoingDocs}
                onNavigate={setActivePage}
            />
        );
      case 'incoming':
        return (
            <IncomingDocs 
                user={currentUser}
                documents={incomingDocs}
                departments={MOCK_DEPARTMENTS}
                projects={MOCK_PROJECTS}
                onAdd={(doc) => setIncomingDocs([doc, ...incomingDocs])}
                onUpdate={(doc) => setIncomingDocs(incomingDocs.map(d => d.id === doc.id ? doc : d))}
            />
        );
      case 'outgoing':
        return (
            <OutgoingDocs 
                user={currentUser}
                documents={outgoingDocs}
                departments={MOCK_DEPARTMENTS}
                projects={MOCK_PROJECTS}
                categories={MOCK_CATEGORIES}
                onAdd={(doc) => setOutgoingDocs([doc, ...outgoingDocs])}
                onUpdate={(doc) => setOutgoingDocs(outgoingDocs.map(d => d.id === doc.id ? doc : d))}
            />
        );
      case 'projects':
        return <CategoryManager title="Quản lý Dự án" data={MOCK_PROJECTS} />;
      case 'departments':
        return <CategoryManager title="Quản lý Phòng ban" data={MOCK_DEPARTMENTS} />;
      case 'employees':
        return <CategoryManager title="Quản lý Nhân viên" data={MOCK_USERS} />;
      case 'companies':
        return <CategoryManager title="Công ty phát hành" data={MOCK_CATEGORIES.filter(c => c.type === 'COMPANY')} />;
      case 'doc-types':
         return <CategoryManager title="Loại công văn" data={MOCK_CATEGORIES.filter(c => c.type === 'DOC_TYPE')} />;
      case 'admin':
        return (
            <div className="p-8 text-center text-slate-500">
                <h2 className="text-xl font-bold mb-2">Quản trị hệ thống</h2>
                <p>Khu vực dành cho cấu hình nâng cao và phân quyền người dùng.</p>
            </div>
        );
      default:
        return <div>404 Not Found</div>;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
       <Sidebar 
         user={currentUser} 
         activePage={activePage} 
         onNavigate={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
         }} 
       />
       
       {/* Mobile Sidebar Overlay */}
       {sidebarOpen && (
         <div 
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
         ></div>
       )}

       <div className={`transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-0'} lg:pl-64`}>
          <Header 
            user={currentUser} 
            onLogout={handleLogout} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="pt-20 pb-8 px-4 sm:px-6 md:px-8 max-w-[1600px] mx-auto min-h-screen">
             {renderContent()}
          </main>
       </div>
    </div>
  );
}

export default App;
