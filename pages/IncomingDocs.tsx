import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  Download, 
  X, 
  Paperclip,
  Save,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { IncomingDocument, User, UserRole, Department, Project } from '../types';

interface IncomingDocsProps {
  user: User;
  documents: IncomingDocument[];
  departments: Department[];
  projects: Project[];
  onAdd: (doc: IncomingDocument) => void;
  onUpdate: (doc: IncomingDocument) => void;
}

const IncomingDocs: React.FC<IncomingDocsProps> = ({ user, documents, departments, projects, onAdd, onUpdate }) => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [selectedDoc, setSelectedDoc] = useState<IncomingDocument | null>(null);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [filterText, setFilterText] = useState('');
  
  const canEdit = user.role === UserRole.ADMIN || user.role === UserRole.CLERK;

  // --- Form State ---
  const initialFormState: Partial<IncomingDocument> = {
    number: '',
    issueDate: '',
    issuer: '',
    originalNumber: '',
    originalDate: '',
    content: '',
    projectId: '',
    receivingDepartmentIds: [],
    attachments: [],
    year: new Date().getFullYear()
  };
  const [formData, setFormData] = useState<Partial<IncomingDocument>>(initialFormState);

  // --- Logic ---
  
  const handleEditClick = (doc: IncomingDocument) => {
    setSelectedDoc(doc);
    setFormData(doc);
    setView('FORM');
  };

  const handleCreateClick = () => {
    setSelectedDoc(null);
    setFormData(initialFormState);
    setView('FORM');
  };

  const handleSave = () => {
    if (!formData.number || !formData.issueDate) {
      alert('Vui lòng điền các trường bắt buộc');
      return;
    }

    const docToSave = {
      ...formData,
      id: selectedDoc ? selectedDoc.id : `IN${Date.now()}`,
    } as IncomingDocument;

    if (selectedDoc) {
      onUpdate(docToSave);
    } else {
      onAdd(docToSave);
    }
    setView('LIST');
  };

  const filteredDocs = documents.filter(doc => {
    // Role filter
    if (user.role === UserRole.STAFF && user.departmentId) {
      if (!doc.receivingDepartmentIds.includes(user.departmentId)) return false;
    }
    
    // UI Filters
    if (doc.year !== filterYear) return false;
    if (filterText) {
      const lower = filterText.toLowerCase();
      return doc.number.toLowerCase().includes(lower) || 
             doc.content.toLowerCase().includes(lower) ||
             doc.issuer.toLowerCase().includes(lower);
    }
    return true;
  });

  // --- Components ---

  const renderList = () => (
    <div className="space-y-4">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Tìm theo số CV, trích yếu..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>
        </div>

        {canEdit && (
          <button 
            onClick={handleCreateClick}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm công văn đến
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4 whitespace-nowrap w-24">Số CV đến</th>
                <th className="px-6 py-4 whitespace-nowrap w-32">Ngày ban hành</th>
                <th className="px-6 py-4 whitespace-nowrap w-48">Đơn vị phát hành</th>
                <th className="px-6 py-4">Trích yếu</th>
                <th className="px-6 py-4 w-48">Nơi nhận</th>
                <th className="px-6 py-4 w-20 text-center">File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                <tr 
                  key={doc.id} 
                  onClick={() => handleEditClick(doc)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{doc.number}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{doc.issueDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">{doc.issuer}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={doc.content}>{doc.content}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.receivingDepartmentIds.slice(0, 2).map(deptId => {
                         const dept = departments.find(d => d.id === deptId);
                         return dept ? (
                          <span key={deptId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                            {dept.code}
                          </span>
                         ) : null;
                      })}
                      {doc.receivingDepartmentIds.length > 2 && (
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                           +{doc.receivingDepartmentIds.length - 2}
                         </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {doc.attachments.length > 0 ? (
                      <Paperclip className="w-4 h-4 text-slate-400 mx-auto" />
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                     <div className="flex flex-col items-center justify-center text-slate-400">
                       <FileText className="w-10 h-10 mb-2 opacity-20" />
                       <p className="text-sm">Không tìm thấy công văn nào</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Simple Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">Hiển thị {filteredDocs.length} bản ghi</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-600 text-sm font-medium">1</button>
              <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled><ChevronRight className="w-4 h-4" /></button>
            </div>
        </div>
      </div>
    </div>
  );

  const renderForm = () => {
    const isReadOnly = !canEdit && selectedDoc !== null;

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full max-w-5xl mx-auto">
        {/* Form Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
          <div className="flex items-center">
            <button 
              onClick={() => setView('LIST')}
              className="mr-3 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              {selectedDoc ? (canEdit ? 'Chi tiết / Cập nhật CV Đến' : 'Chi tiết công văn đến') : 'Thêm mới công văn đến'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setView('LIST')}
               className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
             >
               Hủy
             </button>
             {!isReadOnly && (
               <button 
                 onClick={handleSave}
                 className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
               >
                 <Save className="w-4 h-4 mr-2" />
                 Lưu lại
               </button>
             )}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Section 1: General Info */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Thông tin chung</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số công văn đến <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="VD: 123/UBND"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày phát hành CV đến <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={formData.issueDate}
                onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Đơn vị phát hành</label>
              <input 
                type="text" 
                value={formData.issuer}
                onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                placeholder="Nhập tên đơn vị..."
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dự án liên quan</label>
              <select
                value={formData.projectId || ''}
                onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              >
                <option value="">-- Chọn dự án --</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mã công văn gốc</label>
              <input 
                type="text" 
                value={formData.originalNumber}
                onChange={(e) => setFormData({...formData, originalNumber: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm disabled:bg-slate-100"
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày phát hành CV gốc</label>
              <input 
                type="date" 
                value={formData.originalDate}
                onChange={(e) => setFormData({...formData, originalDate: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm disabled:bg-slate-100"
              />
            </div>


            {/* Section 2: Content & Distribution */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Nội dung & Phân phối</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung công văn (Trích yếu)</label>
              <textarea 
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Các đơn vị nhận</label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-300 rounded-lg bg-slate-50 min-h-[60px]">
                 {departments.map(dept => {
                   const isSelected = formData.receivingDepartmentIds?.includes(dept.id);
                   return (
                     <button
                        key={dept.id}
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => {
                          const current = formData.receivingDepartmentIds || [];
                          const newIds = isSelected 
                            ? current.filter(id => id !== dept.id)
                            : [...current, dept.id];
                          setFormData({...formData, receivingDepartmentIds: newIds});
                        }}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                          isSelected 
                            ? 'bg-blue-100 border-blue-200 text-blue-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                        } ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                     >
                       {dept.name}
                     </button>
                   );
                 })}
              </div>
            </div>

            {/* Section 3: Attachments */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Tệp đính kèm</h3>
            </div>

            <div className="md:col-span-2">
              {!isReadOnly && (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer mb-4">
                  <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                    <Download className="w-6 h-6 rotate-180" />
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-blue-600">Click để tải lên</span> hoặc kéo thả file vào đây
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, Word, Excel (Max 10MB)</p>
                  <input type="file" className="hidden" />
                </div>
              )}

              <div className="space-y-2">
                {formData.attachments?.map((file) => (
                   <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-50 text-red-600 rounded flex items-center justify-center mr-3">
                           <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{file.name}</p>
                          <p className="text-xs text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem">
                           <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Tải xuống">
                           <Download className="w-4 h-4" />
                        </button>
                        {!isReadOnly && (
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-1" title="Xóa">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                   </div>
                ))}
                {formData.attachments?.length === 0 && (
                   <p className="text-sm text-slate-400 italic">Chưa có tệp đính kèm.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Quản lý công văn đến</h1>
      {view === 'LIST' ? renderList() : renderForm()}
    </div>
  );
};

export default IncomingDocs;
