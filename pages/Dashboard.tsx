import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ArrowUpRight, ArrowDownLeft, FileText, Clock, AlertCircle } from 'lucide-react';
import { User, UserRole, IncomingDocument, OutgoingDocument } from '../types';

interface DashboardProps {
  user: User;
  incomingDocs: IncomingDocument[];
  outgoingDocs: OutgoingDocument[];
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, incomingDocs, outgoingDocs, onNavigate }) => {
  const isStaff = user.role === UserRole.STAFF;

  // Stats Logic
  const totalIncoming = incomingDocs.length;
  const totalOutgoing = outgoingDocs.length;
  const today = new Date().toISOString().slice(0, 10);
  
  const incomingToday = incomingDocs.filter(d => d.issueDate === today).length;
  const outgoingToday = outgoingDocs.filter(d => d.issueDate === today).length;

  const myDeptIncoming = isStaff 
    ? incomingDocs.filter(d => d.receivingDepartmentIds.includes(user.departmentId || ''))
    : [];
    
  // Chart Data (Mock)
  const chartData = [
    { name: 'T1', den: 40, di: 24 },
    { name: 'T2', den: 30, di: 13 },
    { name: 'T3', den: 20, di: 58 },
    { name: 'T4', den: 27, di: 39 },
    { name: 'T5', den: 18, di: 48 },
    { name: 'T6', den: 23, di: 38 },
    { name: 'T7', den: 34, di: 43 },
  ];

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          <p className="text-xs text-slate-400 mt-2">{subtext}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan</h2>
        <p className="text-slate-500">Xin chào, {user.name}!</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {!isStaff ? (
          <>
            <StatCard 
              title="Tổng công văn đến" 
              value={totalIncoming} 
              subtext={`+${incomingToday} hôm nay`}
              icon={ArrowDownLeft}
              colorClass="bg-blue-500"
            />
            <StatCard 
              title="Tổng công văn đi" 
              value={totalOutgoing} 
              subtext={`+${outgoingToday} hôm nay`}
              icon={ArrowUpRight}
              colorClass="bg-emerald-500"
            />
            <StatCard 
              title="Chờ xử lý" 
              value="5" 
              subtext="Yêu cầu phản hồi gấp"
              icon={Clock}
              colorClass="bg-amber-500"
            />
            <StatCard 
              title="Văn bản quá hạn" 
              value="2" 
              subtext="Cần kiểm tra ngay"
              icon={AlertCircle}
              colorClass="bg-rose-500"
            />
          </>
        ) : (
          <>
            <StatCard 
              title="CV đến phòng ban" 
              value={myDeptIncoming.length} 
              subtext="Trong năm nay"
              icon={InboxIcon}
              colorClass="bg-blue-500"
            />
             <StatCard 
              title="CV mới trong tuần" 
              value={2} 
              subtext="Chưa xem"
              icon={Clock}
              colorClass="bg-emerald-500"
            />
          </>
        )}
      </div>

      {/* Charts & Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        {!isStaff && (
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Thống kê công văn theo tháng</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <Tooltip 
                    cursor={{fill: '#F1F5F9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="den" name="CV Đến" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="di" name="CV Đi" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Activity / List */}
        <div className={`${isStaff ? 'lg:col-span-3' : 'lg:col-span-1'} bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              {isStaff ? 'Công văn đến mới nhất' : 'Hoạt động gần đây'}
            </h3>
            <button 
              onClick={() => onNavigate('incoming')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {(isStaff ? myDeptIncoming : incomingDocs).slice(0, 5).map((doc) => (
              <div key={doc.id} className="group p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Đến</span>
                  <span className="text-xs text-slate-400">{doc.issueDate}</span>
                </div>
                <h4 className="text-sm font-medium text-slate-800 line-clamp-2 group-hover:text-blue-700">
                  {doc.content}
                </h4>
                <div className="flex items-center mt-2 text-xs text-slate-500">
                  <span className="font-semibold mr-1">{doc.number}</span>
                  <span>• {doc.issuer}</span>
                </div>
              </div>
            ))}
            
            {(!isStaff && outgoingDocs.length > 0) && outgoingDocs.slice(0, 3).map((doc) => (
               <div key={doc.id} className="group p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
               <div className="flex justify-between items-start mb-1">
                 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Đi</span>
                 <span className="text-xs text-slate-400">{doc.issueDate}</span>
               </div>
               <h4 className="text-sm font-medium text-slate-800 line-clamp-2 group-hover:text-emerald-700">
                 {doc.content}
               </h4>
               <div className="flex items-center mt-2 text-xs text-slate-500">
                 <span className="font-semibold mr-1">{doc.code}</span>
                 <span>• {doc.receiver}</span>
               </div>
             </div>
            ))}

            {(isStaff && myDeptIncoming.length === 0) && (
              <div className="text-center py-8 text-slate-400">
                <InboxIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>Chưa có công văn nào gần đây</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InboxIcon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
);

export default Dashboard;
