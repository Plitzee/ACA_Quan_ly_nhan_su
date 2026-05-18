export type StaffStatus = "active" | "inactive";
export type SystemRole = "Owner" | "Admin" | "Coach Full" | "Coach" | "Staff";
export type CenterRole = "Giảng viên" | "Trợ giảng" | "HLV chính" | "Nhân viên hỗ trợ" | "Quản lý";

export interface Expertise {
  id: string;
  subject: string;
  years: number;
  note?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuedBy: string;
  issuedYear: number;
  expiredYear?: number | null;
  subject?: string;
  imageUrl?: string;
  note?: string;
}

export interface Staff {
  id: string;
  name: string;
  gender: "Nam" | "Nữ" | "Khác";
  birthday: string;
  email: string;
  phone: string;
  avatar?: string;
  introduce: string;
  status: StaffStatus;
  systemRole: SystemRole;
  centerRole: CenterRole;
  subjects: string[];
  startDate: string;
  endDate?: string;
  experienceYears: number;
  achievements: string[];
  expertises: Expertise[];
  certificates: Certificate[];
  classesCount: number;
}

export const ALL_SUBJECTS = [
  "Pickleball",
  "Tennis",
  "Bóng chuyền",
  "Cầu lông",
  "Bóng rổ",
  "Bóng đá",
  "Bơi lội",
  "Yoga",
  "Boxing",
  "Võ thuật",
];
export const ALL_SYSTEM_ROLES: SystemRole[] = ["Owner", "Admin", "Coach Full", "Coach", "Staff"];
export const ALL_CENTER_ROLES: CenterRole[] = [
  "Giảng viên",
  "Trợ giảng",
  "HLV chính",
  "Nhân viên hỗ trợ",
  "Quản lý",
];
