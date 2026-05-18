import { Search, X, Calendar, Users as UsersIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Staff } from "../types";

interface Props {
  staffList: Staff[];
  filter: string;
  onFilterChange: (v: string) => void;
  staffId?: string;
  staffName?: string;
}

interface MockClass {
  id: string;
  name: string;
  subject: string;
  coachId: string;
  coachName: string;
  schedule: string;
  students: string;
  status: "active" | "upcoming";
  staffRole: "Giảng viên" | "Trợ giảng";
}

function buildClasses(staffList: Staff[]): MockClass[] {
  const out: MockClass[] = [];
  staffList.forEach((s) => {
    const baseRole: "Giảng viên" | "Trợ giảng" =
      s.centerRole === "Trợ giảng" ? "Trợ giảng" : "Giảng viên";
    for (let i = 0; i < s.classesCount; i++) {
      const subject = s.subjects[0] ?? "Lớp";
      out.push({
        id: `${s.id}-${i}`,
        name: `${subject} ${["Cơ bản", "Trung cấp", "Nâng cao"][i % 3]} K0${i + 1}`,
        subject,
        coachId: s.id,
        coachName: s.name,
        schedule: ["T2, T4, T6 · 18:00 - 19:30", "T3, T5 · 19:00 - 20:30", "T7, CN · 08:00 - 09:30"][i % 3],
        students: `${10 + i * 3}/20`,
        status: i % 4 === 3 ? "upcoming" : "active",
        staffRole: i % 2 === 1 && baseRole === "Giảng viên" ? "Trợ giảng" : baseRole,
      });
    }
  });
  return out;
}

export function ClassesPage({ staffList, filter, onFilterChange, staffId, staffName }: Props) {
  const all = buildClasses(staffList);
  const scoped = staffId ? all.filter((c) => c.coachId === staffId) : all;
  const q = filter.toLowerCase();
  const filtered = q
    ? scoped.filter((c) => c.coachName.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
    : scoped;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              placeholder="Tìm theo tên lớp hoặc tên giảng viên..."
              className="pl-9"
            />
          </div>
          {filter && (
            <button
              onClick={() => onFilterChange("")}
              className="inline-flex items-center gap-1 text-sm bg-[#FCEAED] text-[#B3263A] px-3 py-1.5 rounded-full"
            >
              Lọc theo: {filter} <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-2" />
          <p>{staffId ? `Nhân sự${staffName ? ` ${staffName}` : ""} chưa có lớp học phù hợp` : "Không có lớp học phù hợp"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 style={{ fontWeight: 600 }} className="truncate">{c.name}</h3>
                  <span className="inline-flex items-center gap-1 text-xs bg-[#FCEAED] text-[#B3263A] px-2 py-0.5 rounded-full mt-1">
                    ⚽ {c.subject}
                  </span>
                </div>
                <Badge
                  className={
                    c.status === "active"
                      ? "bg-green-50 text-[#16A34A] border-0"
                      : "bg-yellow-50 text-yellow-700 border-0"
                  }
                >
                  {c.status === "active" ? "Đang dạy" : "Sắp khai giảng"}
                </Badge>
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-400">Nhân sự:</span>
                  <span style={{ fontWeight: 500 }}>{c.coachName}</span>
                  <Badge
                    className={
                      c.staffRole === "Giảng viên"
                        ? "bg-[#FCEAED] text-[#B3263A] border-0"
                        : "bg-blue-50 text-blue-700 border-0"
                    }
                  >
                    {c.staffRole}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{c.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span>Học viên: {c.students}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
