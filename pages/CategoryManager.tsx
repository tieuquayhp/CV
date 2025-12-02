import React from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2,
  FolderOpen
} from 'lucide-react';

interface CategoryManagerProps {
  title: string;
  data: any[];
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ title, data }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center">
            <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">Tên</th>
                <th className="px-6 py-4 w-32">Mã</th>
                <th className="px-6 py-4 w-32 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {data.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                           {item.code ? <span className="px-2 py-1 bg-slate-100 rounded text-xs">{item.code}</span> : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                             <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                 <Edit2 className="w-4 h-4" />
                             </button>
                             <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                 <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
         {data.length === 0 && (
            <div className="p-12 text-center text-slate-400">
                <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-20" />
                Chưa có dữ liệu
            </div>
         )}
      </div>
    </div>
  );
};

export default CategoryManager;
