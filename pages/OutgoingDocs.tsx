import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  X, 
  Paperclip,
  Save,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send
} from 'lucide-react';
import { OutgoingDocument, User, UserRole, Department, Project, Category } from '../types';

interface OutgoingDocsProps {
  user: User;
  documents: OutgoingDocument[];
  departments: Department[];
  projects: Project[];
  categories: Category[];
  onAdd: (doc: OutgoingDocument) => void;
  onUpdate: (doc: OutgoingDocument) => void;
}

const OutgoingDocs: React.FC<OutgoingDocsProps> = ({ user, documents, departments, projects, categories, onAdd, onUpdate }) => {
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [selectedDoc, setSelectedDoc] = useState<OutgoingDocument | null>(null);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [filterText, setFilterText] = useState('');
  
  const canEdit = user.role === UserRole.ADMIN || user.role === UserRole.CLERK;

  // --- Form State ---
  const initialFormState: Partial<OutgoingDocument> = {
    code: '',
    issueDate: '',
    issuerCompanyId: '',
    typeId: '',
    styleId: '',
    receiver: '',
    content: '',
    projectId: '',
    relatedDepartmentIds: [],
    attachments: [],
    year: new Date().getFullYear()
  };
  const [formData, setFormData] = useState<Partial<OutgoingDocument>>(initialFormState);

  // --- Logic ---
  
  const handleEditClick = (doc: OutgoingDocument) => {
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
    if (!formData.code || !formData.issueDate) {
      alert('Vui lòng điền các trường bắt buộc');
      return;
    }

    const docToSave = {
      ...formData,
      id: selectedDoc ? selectedDoc.id : `OUT${Date.now()}`,
    } as OutgoingDocument;

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
      if (!doc.relatedDepartmentIds.includes(user.departmentId)) return false;
    }
    
    // UI Filters
    if (doc.year !== filterYear) return false;
    if (filterText) {
      const lower = filterText.toLowerCase();
      return doc.code.toLowerCase().includes(lower) || 
             doc.content.toLowerCase().includes(lower) ||
             doc.receiver.toLowerCase().includes(lower);
    }
    return true;
  });

  const companies = categories.filter(c => c.type === 'COMPANY');
  const docTypes = categories.filter(c => c.type === 'DOC_TYPE');
  const docStyles = categories.filter(c => c.type === 'DOC_STYLE');

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
              placeholder="Tìm theo mã CV, trích yếu, nơi nhận..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm công văn đi
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4 whitespace-nowrap w-32">Mã công văn</th>
                <th className="px-6 py-4 whitespace-nowrap w-32">Ngày phát hành</th>
                <th className="px-6 py-4 whitespace-nowrap w-40">Đơn vị nhận</th>
                <th className="px-6 py-4">Trích yếu</th>
                <th className="px-6 py-4 w-48">Phòng ban liên quan</th>
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
                  <td className="px-6 py-4 text-sm font-medium text-emerald-600">{doc.code}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{doc.issueDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">{doc.receiver}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={doc.content}>{doc.content}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.relatedDepartmentIds.slice(0, 2).map(deptId => {
                         const dept = departments.find(d => d.id === deptId);
                         return dept ? (
                          <span key={deptId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                            {dept.code}
                          </span>
                         ) : null;
                      })}
                      {doc.relatedDepartmentIds.length > 2 && (
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                           +{doc.relatedDepartmentIds.length - 2}
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
                       <Send className="w-10 h-10 mb-2 opacity-20" />
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
              <button className="w-8 h-8 flex items-center justify-center rounded bg-emerald-50 text-emerald-600 text-sm font-medium">1</button>
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
              {selectedDoc ? (canEdit ? 'Chi tiết / Cập nhật CV Đi' : 'Chi tiết công văn đi') : 'Thêm mới công văn đi'}
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
                 className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Công ty phát hành</label>
              <select
                value={formData.issuerCompanyId || ''}
                onChange={(e) => setFormData({...formData, issuerCompanyId: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              >
                <option value="">-- Chọn công ty --</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mã công văn <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100"
                placeholder="VD: CV-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loại công văn</label>
              <select
                value={formData.typeId || ''}
                onChange={(e) => setFormData({...formData, typeId: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              >
                <option value="">-- Chọn loại --</option>
                {docTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kiểu công văn</label>
              <select
                value={formData.styleId || ''}
                onChange={(e) => setFormData({...formData, styleId: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              >
                <option value="">-- Chọn kiểu --</option>
                {docStyles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày phát hành CV đi <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={formData.issueDate}
                onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              />
            </div>

            {/* Section 2: Content & Recipients */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Nội dung & Đối tượng</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Đơn vị nhận công văn</label>
              <input 
                type="text" 
                value={formData.receiver}
                onChange={(e) => setFormData({...formData, receiver: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
                placeholder="Nhập tên đối tác hoặc đơn vị..."
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dự án liên quan</label>
              <select
                value={formData.projectId || ''}
                onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              >
                <option value="">-- Chọn dự án --</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung công văn (Trích yếu)</label>
              <textarea 
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                disabled={isReadOnly}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Phòng ban liên quan</label>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-300 rounded-lg bg-slate-50 min-h-[60px]">
                 {departments.map(dept => {
                   const isSelected = formData.relatedDepartmentIds?.includes(dept.id);
                   return (
                     <button
                        key={dept.id}
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => {
                          const current = formData.relatedDepartmentIds || [];
                          const newIds = isSelected 
                            ? current.filter(id => id !== dept.id)
                            : [...current, dept.id];
                          setFormData({...formData, relatedDepartmentIds: newIds});
                        }}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                          isSelected 
                            ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
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
                  <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <Download className="w-6 h-6 rotate-180" />
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-emerald-600">Click để tải lên</span> hoặc kéo thả file vào đây
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, Word, Excel (Max 10MB)</p>
                  <input type="file" className="hidden" />
                </div>
              )}

              <div className="space-y-2">
                {formData.attachments?.map((file) => (
                   <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center mr-3">
                           <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{file.name}</p>
                          <p className="text-xs text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Xem">
                           <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Tải xuống">
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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Quản lý công văn đi</h1>
      {view === 'LIST' ? renderList() : renderForm()}
    </div>
  );
};

export default OutgoingDocs;
