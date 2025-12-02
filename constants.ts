import { User, UserRole, Department, Project, Category, IncomingDocument, OutgoingDocument } from './types';

// Departments
export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'DEP01', name: 'Ban Giám Đốc', code: 'BGD' },
  { id: 'DEP02', name: 'Phòng Hành chính - Nhân sự', code: 'HCNS' },
  { id: 'DEP03', name: 'Phòng Kế toán', code: 'KT' },
  { id: 'DEP04', name: 'Phòng Kỹ thuật', code: 'TECH' },
  { id: 'DEP05', name: 'Phòng Kinh doanh', code: 'KD' },
];

// Users
export const MOCK_USERS: User[] = [
  { id: 'U1', name: 'Nguyễn Văn Admin', email: 'admin@company.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/u1/40/40' },
  { id: 'U2', name: 'Trần Thị Văn Thư', email: 'vanthu@company.com', role: UserRole.CLERK, avatarUrl: 'https://picsum.photos/seed/u2/40/40' },
  { id: 'U3', name: 'Lê Văn Kỹ Thuật', email: 'nv.kythuat@company.com', role: UserRole.STAFF, departmentId: 'DEP04', departmentName: 'Phòng Kỹ thuật', avatarUrl: 'https://picsum.photos/seed/u3/40/40' },
  { id: 'U4', name: 'Phạm Thị Kế Toán', email: 'nv.ketoan@company.com', role: UserRole.STAFF, departmentId: 'DEP03', departmentName: 'Phòng Kế toán', avatarUrl: 'https://picsum.photos/seed/u4/40/40' },
];

// Projects
export const MOCK_PROJECTS: Project[] = [
  { id: 'PRJ01', name: 'Dự án Xây dựng Nhà máy A', code: 'P-A' },
  { id: 'PRJ02', name: 'Dự án Chuyển đổi số', code: 'P-DX' },
  { id: 'PRJ03', name: 'Dự án Marketing Mùa Hè', code: 'P-MKT' },
];

// Categories
export const MOCK_CATEGORIES: Category[] = [
  { id: 'CAT01', name: 'Công ty TNHH ABC', type: 'COMPANY' },
  { id: 'CAT02', name: 'Tổng Công ty XYZ', type: 'COMPANY' },
  { id: 'CAT03', name: 'Quyết định', type: 'DOC_TYPE' },
  { id: 'CAT04', name: 'Thông báo', type: 'DOC_TYPE' },
  { id: 'CAT05', name: 'Tờ trình', type: 'DOC_TYPE' },
  { id: 'CAT06', name: 'Nội bộ', type: 'DOC_STYLE' },
  { id: 'CAT07', name: 'Gửi ra ngoài', type: 'DOC_STYLE' },
];

// Incoming Docs
export const MOCK_INCOMING: IncomingDocument[] = [
  {
    id: 'IN01',
    number: '123/UBND',
    issueDate: '2023-10-15',
    issuer: 'UBND Thành Phố',
    originalNumber: 'CV-123',
    originalDate: '2023-10-10',
    content: 'Về việc quy hoạch khu đất dự án Nhà máy A',
    projectId: 'PRJ01',
    receivingDepartmentIds: ['DEP01', 'DEP04'],
    attachments: [{ id: 'f1', name: 'scan_123.pdf', size: '2.5MB', type: 'pdf', url: '#' }],
    year: 2023
  },
  {
    id: 'IN02',
    number: '45/TCT',
    issueDate: '2023-10-18',
    issuer: 'Tổng Công ty XYZ',
    originalNumber: 'TB-45',
    originalDate: '2023-10-17',
    content: 'Thông báo lịch nghỉ lễ Quốc Khánh',
    receivingDepartmentIds: ['DEP01', 'DEP02', 'DEP03', 'DEP04', 'DEP05'],
    attachments: [{ id: 'f2', name: 'thong_bao.docx', size: '1.1MB', type: 'docx', url: '#' }],
    year: 2023
  },
  {
    id: 'IN03',
    number: '88/PCCC',
    issueDate: '2023-10-20',
    issuer: 'Cục PCCC',
    originalNumber: 'HD-88',
    originalDate: '2023-10-19',
    content: 'Hướng dẫn an toàn PCCC cho văn phòng',
    receivingDepartmentIds: ['DEP02'],
    attachments: [],
    year: 2023
  }
];

// Outgoing Docs
export const MOCK_OUTGOING: OutgoingDocument[] = [
  {
    id: 'OUT01',
    code: 'CV-2023-001',
    issueDate: '2023-10-16',
    issuerCompanyId: 'CAT01',
    typeId: 'CAT05', // Tờ trình
    styleId: 'CAT06', // Nội bộ
    receiver: 'Ban Giám Đốc',
    projectId: 'PRJ01',
    relatedDepartmentIds: ['DEP04'],
    content: 'Tờ trình phê duyệt kinh phí dự án Nhà máy A giai đoạn 1',
    attachments: [{ id: 'f3', name: 'to_trinh_kp.xlsx', size: '500KB', type: 'xlsx', url: '#' }],
    year: 2023
  },
  {
    id: 'OUT02',
    code: 'CV-2023-002',
    issueDate: '2023-10-21',
    issuerCompanyId: 'CAT01',
    typeId: 'CAT04', // Thông báo
    styleId: 'CAT07', // Gửi ra ngoài
    receiver: 'Các đối tác',
    content: 'Thông báo thay đổi địa chỉ văn phòng',
    relatedDepartmentIds: ['DEP02', 'DEP05'],
    attachments: [],
    year: 2023
  }
];
