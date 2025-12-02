export enum UserRole {
  ADMIN = 'ADMIN',
  CLERK = 'CLERK', // Văn thư
  STAFF = 'STAFF' // Nhân viên
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string; // Null if admin/clerk or irrelevant
  departmentName?: string;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
}

export interface Category {
  id: string;
  name: string;
  code?: string;
  type: 'COMPANY' | 'DOC_TYPE' | 'DOC_STYLE';
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'other';
  url: string;
}

export interface IncomingDocument {
  id: string;
  number: string; // Số công văn đến
  issueDate: string; // Ngày phát hành CV đến
  issuer: string; // Đơn vị phát hành
  originalNumber: string; // Mã công văn gốc
  originalDate: string; // Ngày phát hành CV gốc
  projectId?: string; // Dự án liên quan
  content: string; // Trích yếu
  receivingDepartmentIds: string[]; // Các đơn vị nhận
  attachments: Attachment[];
  year: number;
}

export interface OutgoingDocument {
  id: string;
  code: string; // Mã công văn
  issueDate: string; // Ngày phát hành
  issuerCompanyId: string; // Công ty phát hành (trong danh mục)
  typeId: string; // Loại công văn
  styleId: string; // Kiểu công văn
  receiver: string; // Đơn vị nhận
  projectId?: string;
  relatedDepartmentIds: string[]; // Phòng ban liên quan
  content: string; // Trích yếu
  attachments: Attachment[];
  year: number;
}