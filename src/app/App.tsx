import { useMemo, useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Plus,
  Bell,
  ChevronLeft,
  LayoutGrid,
  List,
  Users,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { initialStaff } from "./data";
import { Staff, StaffStatus, Certificate, Expertise, ALL_SUBJECTS, SystemRole } from "./types";
import { StaffCard } from "./components/StaffCard";
import { StaffDetailPanel } from "./components/StaffDetailPanel";
import { StaffForm } from "./components/StaffForm";
import { PermissionDialog } from "./components/PermissionDialog";
import { ClassesPage } from "./components/ClassesPage";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Checkbox } from "./components/ui/checkbox";
import { Avatar, AvatarFallback } from "./components/ui/avatar";

type ConfirmKind = "suspend" | "activate" | "delete";

const ROLE_FILTER_OPTIONS = ["Chủ sở hữu", "Trợ giảng", "Giảng viên", "Nhân viên"];

export default function App() {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [sortAZ, setSortAZ] = useState<"asc" | "desc">("asc");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [advFilters, setAdvFilters] = useState<string[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [permTarget, setPermTarget] = useState<Staff | null>(null);
  const [confirm, setConfirm] = useState<{ kind: ConfirmKind; staff: Staff } | null>(null);
  const [page, setPage] = useState<"staff" | "classes">("staff");
  const [isMobile, setIsMobile] = useState(false);
  const [classesFilter, setClassesFilter] = useState("");
  const [classesDialogFilter, setClassesDialogFilter] = useState("");
  const [classesTarget, setClassesTarget] = useState<Staff | null>(null);

  const selected = staffList.find((s) => s.id === selectedId) ?? null;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile((e as any).matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange as any);
    else mq.addListener(onChange as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange as any);
      else mq.removeListener(onChange as any);
    };
  }, []);

  const stats = useMemo(() => ({
    total: staffList.length,
    active: staffList.filter((s) => s.status === "active").length,
    inactive: staffList.filter((s) => s.status === "inactive").length,
  }), [staffList]);

  const filtered = useMemo(() => {
    let list = [...staffList];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          s.certificates.some((c) => c.name.toLowerCase().includes(q))
      );
    }
    if (roleFilter !== "all") {
      if (roleFilter === "Chủ sở hữu") list = list.filter((s) => s.systemRole === "Owner");
      else if (roleFilter === "Nhân viên") list = list.filter((s) => s.centerRole === "Nhân viên hỗ trợ");
      else list = list.filter((s) => s.centerRole === roleFilter);
    }
    if (subjectFilter !== "all") list = list.filter((s) => s.subjects.includes(subjectFilter));
    if (statusFilter !== "all") list = list.filter((s) => s.status === statusFilter);
    if (classFilter === "has") list = list.filter((s) => s.classesCount > 0);
    if (classFilter === "none") list = list.filter((s) => s.classesCount === 0);
    list.sort((a, b) =>
      sortAZ === "asc" ? a.name.localeCompare(b.name, "vi") : b.name.localeCompare(a.name, "vi")
    );
    return list;
  }, [staffList, search, roleFilter, subjectFilter, statusFilter, classFilter, sortAZ]);

  const handleAdd = (data: Staff) => {
    const newStaff = { ...data, id: `s_${Date.now()}` };
    setStaffList((p) => [newStaff, ...p]);
    setAddOpen(false);
    toast.success("Đã thêm nhân sự thành công");
  };

  const handleUpdate = (data: Staff) => {
    setStaffList((p) => p.map((s) => (s.id === data.id ? data : s)));
    setEditMode(false);
    toast.success("Đã cập nhật nhân sự");
  };

  const handleUpdateExpertises = (expertises: Expertise[]) => {
    if (!selected) return;
    setStaffList((p) =>
      p.map((s) => (s.id === selected.id ? { ...s, expertises } : s))
    );
    toast.success("Đã cập nhật chuyên môn");
  };

  const handleUpdateCerts = (certs: Certificate[]) => {
    if (!selected) return;
    setStaffList((p) =>
      p.map((s) => (s.id === selected.id ? { ...s, certificates: certs } : s))
    );
    toast.success("Đã cập nhật chứng chỉ");
  };

  const handleConfirm = () => {
    if (!confirm) return;
    const { kind, staff } = confirm;
    if (kind === "delete") {
      setStaffList((p) => p.filter((s) => s.id !== staff.id));
      if (selectedId === staff.id) setSelectedId(null);
      toast.success("Đã xóa nhân sự");
    } else {
      const newStatus: StaffStatus = kind === "suspend" ? "inactive" : "active";
      setStaffList((p) => p.map((s) => (s.id === staff.id ? { ...s, status: newStatus } : s)));
      toast.success(kind === "suspend" ? "Đã tạm ngưng nhân sự" : "Đã kích hoạt nhân sự");
    }
    setConfirm(null);
  };

  const toggleAdv = (v: string) => {
    setAdvFilters((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <Toaster position="bottom-right" richColors />

      {isMobile ? (
        <header className="h-14 bg-[#A32638] text-white flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="p-1 hover:bg-white/10 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg" style={{ fontWeight: 600 }}>{page === "staff" ? "Nhân sự" : "Lớp học"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full" />
            </button>
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarFallback className="bg-white text-[#A32638]">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
      ) : (
        <header className="h-[72px] bg-[#A32638] text-white flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="p-1 hover:bg-white/10 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 style={{ fontWeight: 600 }}>{page === "staff" ? "Quản lý nhân sự" : "Quản lý lớp học"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full" />
            </button>
            <Avatar className="w-9 h-9 border-2 border-white">
              <AvatarFallback className="bg-white text-[#A32638]">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
      )}

      <main className={`${isMobile ? "px-4 pb-24" : "max-w-[1440px] mx-auto p-6"}`}>
        <div className="flex items-center gap-1 border-b border-[#E5E7EB] mb-5">
          <button
            onClick={() => setPage("staff")}
            className={`px-4 py-2 text-sm transition-colors border-b-2 ${
              page === "staff" ? "border-[#B3263A] text-[#B3263A]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: 600 }}
          >
            Nhân sự
          </button>
          <button
            onClick={() => setPage("classes")}
            className={`px-4 py-2 text-sm transition-colors border-b-2 ${
              page === "classes" ? "border-[#B3263A] text-[#B3263A]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: 600 }}
          >
            Lớp học
          </button>
        </div>

        {page === "classes" ? (
          <ClassesPage staffList={staffList} filter={classesFilter} onFilterChange={setClassesFilter} />
        ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <KPI
            label="Tổng nhân sự"
            value={stats.total}
            icon={<Users className="w-5 h-5" />}
            accent
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <KPI
            label="Đang hoạt động"
            value={stats.active}
            icon={<UserCheck className="w-5 h-5 text-[#16A34A]" />}
            active={statusFilter === "active"}
            onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
          />
          <KPI
            label="Ngưng hoạt động"
            value={stats.inactive}
            icon={<UserX className="w-5 h-5 text-gray-500" />}
            active={statusFilter === "inactive"}
            onClick={() => setStatusFilter(statusFilter === "inactive" ? "all" : "inactive")}
          />
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
              <div className={`relative flex-1 ${isMobile ? "min-w-0 w-full" : "min-w-[240px]"}`}>
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, SĐT, email, chứng chỉ…"
                className="pl-9"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-1" /> Bộ lọc
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm mb-2" style={{ fontWeight: 600 }}>Hồ sơ</p>
                    {["Có chứng chỉ", "Chưa có chứng chỉ", "Chưa gắn bộ môn"].map((v) => (
                      <label key={v} className="flex items-center gap-2 text-sm py-1">
                        <Checkbox checked={advFilters.includes(v)} onCheckedChange={() => toggleAdv(v)} />
                        {v}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setAdvFilters([])}>Xóa</Button>
                    <Button size="sm" className="flex-1 bg-[#A32638] hover:bg-[#8a1f2f] text-white">Áp dụng</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={() => setSortAZ((p) => (p === "asc" ? "desc" : "asc"))}>
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortAZ === "asc" ? "A → Z" : "Z → A"}
            </Button>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className={`${isMobile ? "w-[110px] text-sm" : "w-[150px]"}`}><SelectValue placeholder="Vai trò" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                {ROLE_FILTER_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className={`${isMobile ? "w-[110px] text-sm" : "w-[150px]"}`}><SelectValue placeholder="Bộ môn" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bộ môn</SelectItem>
                {ALL_SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className={`${isMobile ? "w-[120px] text-sm" : "w-[160px]"}`}><SelectValue placeholder="Lớp học" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp học</SelectItem>
                <SelectItem value="has">Đang có lớp học</SelectItem>
                <SelectItem value="none">Không có lớp học</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border border-[#E5E7EB] rounded-md">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-[#FCEAED] text-[#A32638]" : "text-gray-500"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-[#FCEAED] text-[#A32638]" : "text-gray-500"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button variant="outline" size="icon" onClick={() => toast.info("Đã làm mới danh sách")}>
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => setAddOpen(true)}
              className="bg-[#A32638] hover:bg-[#8a1f2f] text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm nhân sự
            </Button>
          </div>

          {(advFilters.length > 0 || roleFilter !== "all" || subjectFilter !== "all" || statusFilter !== "all" || classFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
              {advFilters.map((f) => (
                <Chip key={f} label={f} onRemove={() => toggleAdv(f)} />
              ))}
              {roleFilter !== "all" && <Chip label={roleFilter} onRemove={() => setRoleFilter("all")} />}
              {subjectFilter !== "all" && <Chip label={subjectFilter} onRemove={() => setSubjectFilter("all")} />}
              {statusFilter !== "all" && (
                <Chip
                  label={statusFilter === "active" ? "Đang hoạt động" : "Ngưng hoạt động"}
                  onRemove={() => setStatusFilter("all")}
                />
              )}
              {classFilter !== "all" && (
                <Chip
                  label={classFilter === "has" ? "Đang có lớp học" : "Không có lớp học"}
                  onRemove={() => setClassFilter("all")}
                />
              )}
              <button
                className="text-sm text-[#A32638] hover:underline"
                onClick={() => {
                  setAdvFilters([]);
                  setRoleFilter("all");
                  setSubjectFilter("all");
                  setStatusFilter("all");
                  setClassFilter("all");
                }}
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-2" />
            <p>Không tìm thấy nhân sự phù hợp</p>
          </div>
        ) : (
          <div className={
              isMobile ? "space-y-3" : view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                : "grid grid-cols-1 gap-3"
            }>
            {filtered.map((s) => (
              <StaffCard
                key={s.id}
                staff={s}
                onView={() => {
                  setSelectedId(s.id);
                  setEditMode(false);
                }}
                onPermission={() => setPermTarget(s)}
                onQuickEdit={() => {
                  setSelectedId(s.id);
                  setEditMode(true);
                }}
                onToggleStatus={() =>
                  setConfirm({
                    kind: s.status === "active" ? "suspend" : "activate",
                    staff: s,
                  })
                }
                onDelete={() => setConfirm({ kind: "delete", staff: s })}
                onViewClasses={() => {
                  setClassesTarget(s);
                  setClassesDialogFilter("");
                }}
              />
            ))}
          </div>
        )}
        </>
        )}
      </main>

      {isMobile && (
        <>
          <button
            onClick={() => setAddOpen(true)}
            className="fixed bottom-20 right-4 bg-[#A32638] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40"
            aria-label="Thêm nhân sự"
          >
            <Plus className="w-5 h-5" />
          </button>

          <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t flex items-center justify-around z-40">
            <button onClick={() => setPage("staff")}
              className={`flex flex-col items-center text-sm ${page === "staff" ? "text-[#A32638]" : "text-gray-500"}`}>
              <Users className="w-5 h-5" />
              <span className="text-xs">Nhân sự</span>
            </button>
            <button onClick={() => setPage("classes")}
              className={`flex flex-col items-center text-sm ${page === "classes" ? "text-[#A32638]" : "text-gray-500"}`}>
              <List className="w-5 h-5" />
              <span className="text-xs">Lớp</span>
            </button>
            <button
              onClick={() => setView((v) => (v === "list" ? "grid" : "list"))}
              className="flex flex-col items-center text-sm text-gray-500"
            >
              {view === "list" ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
              <span className="text-xs">Hiển thị</span>
            </button>
          </nav>
        </>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setAddOpen(false)} />
          <div className="w-full md:w-[520px] bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] shrink-0">
              <h3 style={{ fontWeight: 600 }}>Thêm mới nhân sự</h3>
              <Button variant="ghost" size="icon" onClick={() => setAddOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <StaffForm mode="create" onCancel={() => setAddOpen(false)} onSubmit={handleAdd} />
            </div>
          </div>
        </div>
      )}

      {selected && (
        <StaffDetailPanel
          staff={selected}
          editMode={editMode}
          onClose={() => setSelectedId(null)}
          onEdit={() => setEditMode(true)}
          onCancelEdit={() => setEditMode(false)}
          onSave={handleUpdate}
          onPermission={() => setPermTarget(selected)}
          onUpdateCertificates={handleUpdateCerts}
          onUpdateExpertises={handleUpdateExpertises}
          onViewClasses={() => {
            setClassesTarget(selected);
            setClassesDialogFilter("");
          }}
        />
      )}

      {classesTarget && (
        <Dialog
          open={!!classesTarget}
          onOpenChange={(o) => {
            if (!o) {
              setClassesTarget(null);
              setClassesDialogFilter("");
            }
          }}
        >
          <DialogContent className="max-w-5xl w-[92vw] p-0 overflow-hidden">
            <div className="border-b border-[#E5E7EB] p-5">
              <DialogHeader>
                <DialogTitle>Lớp đang giảng dạy</DialogTitle>
                <DialogDescription>
                  {classesTarget.name} · {classesTarget.centerRole} · {classesTarget.systemRole}
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-5 pt-4 max-h-[70vh] overflow-y-auto">
              <ClassesPage
                staffList={staffList}
                filter={classesDialogFilter}
                onFilterChange={setClassesDialogFilter}
                staffId={classesTarget.id}
                staffName={classesTarget.name}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {permTarget && (
        <PermissionDialog
          staff={permTarget}
          onClose={() => setPermTarget(null)}
          onSave={(role: SystemRole) => {
            setStaffList((p) =>
              p.map((s) => (s.id === permTarget.id ? { ...s, systemRole: role } : s))
            );
            setPermTarget(null);
            toast.success("Đã cập nhật phân quyền");
          }}
        />
      )}

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "delete" && "Xóa nhân sự?"}
              {confirm?.kind === "suspend" && "Tạm ngưng nhân sự?"}
              {confirm?.kind === "activate" && "Kích hoạt lại nhân sự?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "delete" &&
                "Thao tác này sẽ xóa nhân sự khỏi danh sách quản lý của trung tâm. Dữ liệu lịch sử vẫn được giữ nếu hệ thống dùng soft delete."}
              {confirm?.kind === "suspend" &&
                "Nhân sự này sẽ không thể được phân công vào lớp mới, nhưng dữ liệu cũ vẫn được giữ."}
              {confirm?.kind === "activate" && "Nhân sự sẽ trở lại trạng thái hoạt động."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-[#A32638] hover:bg-[#8a1f2f]"
            >
              {confirm?.kind === "delete" && "Xóa"}
              {confirm?.kind === "suspend" && "Tạm ngưng"}
              {confirm?.kind === "activate" && "Kích hoạt"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function KPI({
  label,
  value,
  icon,
  accent,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 border transition-all ${
        accent ? "bg-[#FCEAED] border-[#B3263A]/30" : "bg-white border-[#E5E7EB]"
      } ${onClick ? "cursor-pointer hover:shadow-md" : ""} ${
        active && !accent ? "ring-2 ring-[#B3263A] border-[#B3263A]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <div className={accent ? "text-[#A32638]" : "text-gray-400"}>{icon}</div>
      </div>
      <div className="mt-2 text-3xl" style={{ fontWeight: 700, color: accent ? "#B3263A" : undefined }}>
        {value}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#FCEAED] text-[#A32638] px-2 py-1 rounded-full text-xs">
      {label}
      <button onClick={onRemove}>
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
