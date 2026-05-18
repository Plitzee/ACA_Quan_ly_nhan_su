import { MoreVertical, Mail, Phone, Calendar, Award, GraduationCap, User, Shield, Pencil, Pause, Play, Trash2 } from "lucide-react";
import { Staff } from "../types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Props {
  staff: Staff;
  onView: () => void;
  onPermission: () => void;
  onQuickEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  onViewClasses: () => void;
}

function formatDate(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function StaffCard({
  staff,
  onView,
  onPermission,
  onQuickEdit,
  onToggleStatus,
  onDelete,
  onViewClasses,
}: Props) {
  const isActive = staff.status === "active";
  const initials = staff.name.split(" ").slice(-2).map((n) => n[0]).join("");

  return (
    <div
      className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-md hover:border-[#B3263A]/30 transition-all relative cursor-pointer"
      onClick={onView}
    >
      {/* Top-right badges + menu */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Badge
          className={
            isActive
              ? "bg-green-50 text-[#16A34A] border-0"
              : "bg-gray-100 text-gray-600 border-0"
          }
        >
          {isActive ? "Hoạt động" : "Ngưng"}
        </Badge>
        <Badge variant="secondary" className="bg-[#FCEAED] text-[#B3263A] border-0">
          {staff.centerRole}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem onClick={onView}>
              <User className="w-4 h-4 mr-2" /> Xem chi tiết thông tin nhân sự
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPermission}>
              <Shield className="w-4 h-4 mr-2" /> Phân quyền
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onQuickEdit}>
              <Pencil className="w-4 h-4 mr-2" /> Chỉnh sửa nhanh
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleStatus}>
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" /> Tạm ngưng nhân sự
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" /> Kích hoạt lại
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-[#B3263A] focus:text-[#B3263A]">
              <Trash2 className="w-4 h-4 mr-2" /> Xóa nhân sự
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-start gap-3 pr-2">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-[#FCEAED] text-[#B3263A]">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 mt-7">
          <h3 className="truncate" style={{ fontWeight: 600 }}>{staff.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-gray-500">{staff.systemRole}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {staff.subjects.length === 0 ? (
          <span className="text-xs text-gray-400">Chưa gắn bộ môn</span>
        ) : (
          staff.subjects.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 text-xs bg-[#FCEAED] text-[#B3263A] px-2 py-0.5 rounded-full"
            >
              ⚽ {s}
            </span>
          ))
        )}
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2 truncate">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{staff.phone}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{staff.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Bắt đầu: {formatDate(staff.startDate)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E7EB] text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> {staff.experienceYears} năm KN
        </span>
        <span className="inline-flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5" /> {staff.certificates.length} chứng chỉ
        </span>
        <span>{staff.classesCount} lớp đang dạy</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewClasses();
        }}
        className="mt-3 text-sm text-[#B3263A] hover:underline"
      >
        Xem các lớp đang giảng dạy →
      </button>
    </div>
  );
}
