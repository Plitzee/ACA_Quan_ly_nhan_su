import { useState } from "react";
import { Staff, ALL_SYSTEM_ROLES, SystemRole } from "../types";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Shield } from "lucide-react";

interface Props {
  staff: Staff;
  onClose: () => void;
  onSave: (role: SystemRole) => void;
}

const MODULES = [
  { module: "Nhân sự", perms: ["Xem", "Thêm", "Sửa", "Xóa", "Phân quyền"] },
  { module: "Lớp học", perms: ["Xem", "Tạo", "Sửa", "Xóa", "Phân công HLV"] },
  { module: "Học viên", perms: ["Xem", "Thêm", "Sửa", "Xóa"] },
  { module: "Học phí", perms: ["Xem", "Tạo giao dịch", "Hoàn tiền"] },
  { module: "Báo cáo", perms: ["Xem", "Xuất file"] },
];

const ROLE_DESC: Record<SystemRole, string> = {
  Owner: "Toàn quyền quản trị trung tâm.",
  Admin: "Quản trị viên với hầu hết quyền truy cập.",
  "Coach Full": "Huấn luyện viên có quyền quản lý lớp và học viên.",
  Coach: "Huấn luyện viên dạy lớp.",
  Staff: "Nhân viên hỗ trợ với quyền hạn chế.",
};

export function PermissionDialog({ staff, onClose, onSave }: Props) {
  const [role, setRole] = useState<SystemRole>(staff.systemRole);
  const [custom, setCustom] = useState(false);
  const initials = staff.name.split(" ").slice(-2).map((n) => n[0]).join("");

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full md:w-[520px] bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#B3263A]" />
            <h3 style={{ fontWeight: 600 }}>Phân quyền nhân sự</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-[#FCEAED]/50 border border-[#B3263A]/20 rounded-xl p-3 flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-[#B3263A] text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 600 }}>{staff.name}</span>
                {custom && <Badge className="bg-yellow-50 text-yellow-700 border-0">Custom</Badge>}
              </div>
              <p className="text-xs text-gray-500">{staff.email}</p>
              <p className="text-xs text-gray-500">{staff.centerRole}</p>
            </div>
            <Badge className={staff.status === "active" ? "bg-green-50 text-[#16A34A] border-0" : "bg-gray-100"}>
              {staff.status === "active" ? "Hoạt động" : "Ngưng"}
            </Badge>
          </div>

          <div>
            <label className="text-sm text-gray-700" style={{ fontWeight: 600 }}>Vai trò hệ thống</label>
            <Select value={role} onValueChange={(v) => { setRole(v as SystemRole); setCustom(false); }}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_SYSTEM_ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-2">{ROLE_DESC[role]}</p>
          </div>

          <div className="space-y-3">
            <h4 style={{ fontWeight: 600 }} className="text-[#B3263A]">Quyền chi tiết theo module</h4>
            {MODULES.map((m) => (
              <div key={m.module} className="border border-[#E5E7EB] rounded-xl p-3">
                <h5 style={{ fontWeight: 600 }} className="mb-2">{m.module}</h5>
                <div className="grid grid-cols-2 gap-2">
                  {m.perms.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        defaultChecked={role !== "Staff"}
                        onCheckedChange={() => setCustom(true)}
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] p-4 flex justify-end gap-2 bg-white shrink-0">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button className="bg-[#B3263A] hover:bg-[#8a1f2f] text-white" onClick={() => onSave(role)}>
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
}
