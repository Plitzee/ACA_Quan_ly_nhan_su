import { useState } from "react";
import { Staff, Certificate, Expertise, ALL_SUBJECTS } from "../types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import {
  Pencil,
  Shield,
  Plus,
  X,
  Award,
  Trash2,
  ImageIcon,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { CertificateForm } from "./CertificateForm";
import { StaffForm } from "./StaffForm";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Props {
  staff: Staff;
  editMode: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (s: Staff) => void;
  onPermission: () => void;
  onUpdateCertificates: (certs: Certificate[]) => void;
  onUpdateExpertises: (e: Expertise[]) => void;
  onViewClasses: () => void;
}

function fmt(d?: string | null) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function StaffDetailPanel({
  staff,
  editMode,
  onClose,
  onEdit,
  onCancelEdit,
  onSave,
  onPermission,
  onUpdateCertificates,
  onUpdateExpertises,
  onViewClasses,
}: Props) {
  const [certDialog, setCertDialog] = useState<{ open: boolean; cert?: Certificate }>({
    open: false,
  });
  const [expDialog, setExpDialog] = useState<{ open: boolean; exp?: Expertise }>({
    open: false,
  });

  const initials = staff.name.split(" ").slice(-2).map((n) => n[0]).join("");

  if (editMode) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="flex-1 bg-black/30" onClick={onCancelEdit} />
        <div className="w-full md:w-[520px] bg-white h-full flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] shrink-0">
            <h3 style={{ fontWeight: 600 }}>Chỉnh sửa nhân sự</h3>
            <Button variant="ghost" size="icon" onClick={onCancelEdit}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            <StaffForm
              initial={staff}
              mode="edit"
              onCancel={onCancelEdit}
              onSubmit={onSave}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full md:w-[520px] bg-white h-full flex flex-col shadow-2xl">
        <div className="relative">
          <div className="h-20 bg-gradient-to-r from-[#FCEAED] to-[#fde4e8]" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="px-5 -mt-10 pb-4">
            <Avatar className="w-[72px] h-[72px] border-4 border-white">
              <AvatarFallback className="bg-[#A32638] text-white text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex items-start justify-between mt-3 gap-2">
              <div>
                <h2 style={{ fontWeight: 600 }}>{staff.name}</h2>
                <p className="text-sm text-gray-500">{staff.centerRole} · {staff.systemRole}</p>
                <div className="flex gap-1.5 mt-2">
                  <Badge className={staff.status === "active" ? "bg-green-50 text-[#16A34A] border-0" : "bg-gray-100 text-gray-600 border-0"}>
                    {staff.status === "active" ? "Đang hoạt động" : "Ngưng hoạt động"}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={onEdit} className="bg-[#A32638] hover:bg-[#8a1f2f] text-white">
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Chỉnh sửa
                </Button>
                <Button variant="outline" onClick={onPermission}>
                  <Shield className="w-3.5 h-3.5 mr-1" /> Phân quyền
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-5 grid grid-cols-3">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="expertise">Chuyên môn</TabsTrigger>
            <TabsTrigger value="certs">Trình độ</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-5">
            <TabsContent value="info" className="space-y-4 mt-0">
              <button
                onClick={onViewClasses}
                className="w-full bg-gradient-to-r from-[#FCEAED] to-[#fde4e8] border border-[#B3263A]/20 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#B3263A] text-white flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#B3263A]/70">Số lớp đang giảng dạy</p>
                    <p style={{ fontWeight: 700 }} className="text-[#B3263A]">
                      {staff.classesCount} lớp · Xem chi tiết
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#B3263A]" />
              </button>

              <div className="bg-[#F7F7F8] rounded-xl p-4 space-y-2">
                <h4 style={{ fontWeight: 600 }}>Thông tin cá nhân</h4>
                <Row label="Họ tên" value={staff.name} />
                <Row label="Giới tính" value={staff.gender} />
                <Row label="Ngày sinh" value={fmt(staff.birthday)} />
                <Row label="SĐT" value={staff.phone} />
                <Row label="Email" value={staff.email} />
              </div>
              <div className="bg-[#F7F7F8] rounded-xl p-4 space-y-2">
                <h4 style={{ fontWeight: 600 }}>Thông tin làm việc</h4>
                <Row label="Vai trò" value={staff.centerRole} />
                <Row label="Vai trò hệ thống" value={staff.systemRole} />
                <Row label="Bộ môn" value={staff.subjects.join(", ") || "—"} />
                <Row label="Ngày bắt đầu" value={fmt(staff.startDate)} />
                <Row label="Ngày kết thúc" value={fmt(staff.endDate)} />
                <Row label="Trạng thái" value={staff.status === "active" ? "Đang hoạt động" : "Ngưng hoạt động"} />
              </div>
              <div className="bg-[#F7F7F8] rounded-xl p-4">
                <h4 style={{ fontWeight: 600 }}>Giới thiệu</h4>
                <p className="text-sm text-gray-600 mt-2">{staff.introduce || "Chưa có giới thiệu"}</p>
              </div>
            </TabsContent>

            <TabsContent value="expertise" className="space-y-4 mt-0">
              <div className="bg-[#F7F7F8] rounded-xl p-4">
                <h4 style={{ fontWeight: 600 }}>Kinh nghiệm & thành tích</h4>
                <p className="text-sm text-gray-600 mt-2">{staff.experienceYears} năm kinh nghiệm</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {staff.achievements.length === 0 ? (
                    <span className="text-xs text-gray-400">Chưa có thành tích</span>
                  ) : (
                    staff.achievements.map((a, i) => (
                      <span key={i} className="text-xs bg-white border border-[#E5E7EB] px-2 py-1 rounded-full">{a}</span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h4 style={{ fontWeight: 600 }}>Chuyên môn ({staff.expertises.length})</h4>
                <Button
                  size="sm"
                  className="bg-[#A32638] hover:bg-[#8a1f2f] text-white"
                  onClick={() => setExpDialog({ open: true })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm chuyên môn
                </Button>
              </div>
              {staff.expertises.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border border-dashed border-[#E5E7EB] rounded-xl">
                  <Award className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Chưa có chuyên môn</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {staff.expertises.map((e) => (
                    <div key={e.id} className="border border-[#E5E7EB] rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h5 style={{ fontWeight: 600 }} className="truncate">{e.subject}</h5>
                          <p className="text-xs text-gray-500 mt-0.5">{e.years} năm kinh nghiệm</p>
                          {e.note && <p className="text-sm text-gray-600 mt-1.5">{e.note}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            className="text-xs text-[#A32638] hover:underline px-1"
                            onClick={() => setExpDialog({ open: true, exp: e })}
                          >
                            Sửa
                          </button>
                          <button
                            className="text-xs text-gray-500 hover:underline px-1"
                            onClick={() =>
                              onUpdateExpertises(staff.expertises.filter((x) => x.id !== e.id))
                            }
                          >
                            <Trash2 className="w-3 h-3 inline" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="certs" className="mt-0">
              <div className="flex justify-between items-center mb-3">
                <h4 style={{ fontWeight: 600 }}>Chứng chỉ ({staff.certificates.length})</h4>
                <Button
                  size="sm"
                  className="bg-[#A32638] hover:bg-[#8a1f2f] text-white"
                  onClick={() => setCertDialog({ open: true })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm trình độ
                </Button>
              </div>
              {staff.certificates.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Award className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Chưa có chứng chỉ</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {staff.certificates.map((c) => (
                    <div key={c.id} className="border border-[#E5E7EB] rounded-xl p-3 flex gap-3">
                      <div className="w-16 h-16 bg-[#FCEAED] rounded-lg flex items-center justify-center shrink-0">
                        <ImageIcon className="w-6 h-6 text-[#A32638]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 style={{ fontWeight: 600 }} className="truncate">{c.name}</h5>
                        <p className="text-xs text-gray-500">{c.issuedBy} · {c.issuedYear}</p>
                        <p className="text-xs text-gray-500">
                          {c.expiredYear ? `Hết hạn: ${c.expiredYear}` : "Không thời hạn"}
                          {c.subject && ` · ${c.subject}`}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            className="text-xs text-[#A32638] hover:underline"
                            onClick={() => setCertDialog({ open: true, cert: c })}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            className="text-xs text-gray-500 hover:underline"
                            onClick={() =>
                              onUpdateCertificates(staff.certificates.filter((x) => x.id !== c.id))
                            }
                          >
                            <Trash2 className="w-3 h-3 inline" /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

          </div>
        </Tabs>

        <Dialog
          open={certDialog.open}
          onOpenChange={(o) => !o && setCertDialog({ open: false })}
        >
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{certDialog.cert ? "Chỉnh sửa chứng chỉ" : "Thêm trình độ/chứng chỉ"}</DialogTitle>
              <DialogDescription>
                Nhập thông tin chứng chỉ và tải ảnh chứng chỉ liên quan.
              </DialogDescription>
            </DialogHeader>
            <CertificateForm
              initial={certDialog.cert}
              onCancel={() => setCertDialog({ open: false })}
              onSave={(c) => {
                if (certDialog.cert) {
                  onUpdateCertificates(
                    staff.certificates.map((x) => (x.id === certDialog.cert!.id ? { ...c, id: x.id } : x))
                  );
                } else {
                  onUpdateCertificates([
                    ...staff.certificates,
                    { ...c, id: `c_${Date.now()}` },
                  ]);
                }
                setCertDialog({ open: false });
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={expDialog.open}
          onOpenChange={(o) => !o && setExpDialog({ open: false })}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{expDialog.exp ? "Chỉnh sửa chuyên môn" : "Thêm chuyên môn"}</DialogTitle>
              <DialogDescription>
                Nhập bộ môn chuyên môn, số năm kinh nghiệm và ghi chú.
              </DialogDescription>
            </DialogHeader>
            <ExpertiseForm
              initial={expDialog.exp}
              onCancel={() => setExpDialog({ open: false })}
              onSave={(e) => {
                if (expDialog.exp) {
                  onUpdateExpertises(
                    staff.expertises.map((x) => (x.id === expDialog.exp!.id ? { ...e, id: x.id } : x))
                  );
                } else {
                  onUpdateExpertises([
                    ...staff.expertises,
                    { ...e, id: `e_${Date.now()}` },
                  ]);
                }
                setExpDialog({ open: false });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ExpertiseForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Expertise;
  onCancel: () => void;
  onSave: (e: Expertise) => void;
}) {
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [years, setYears] = useState<number>(initial?.years ?? 0);
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState("");

  return (
    <div className="space-y-3">
      <div>
        <Label>Bộ môn *</Label>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger><SelectValue placeholder="Chọn bộ môn" /></SelectTrigger>
          <SelectContent>
            {ALL_SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Số năm kinh nghiệm *</Label>
        <Input
          type="number"
          min={0}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />
      </div>
      <div>
        <Label>Ghi chú</Label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Mô tả ngắn về chuyên môn..."
          rows={3}
        />
      </div>
      {error && <p className="text-sm text-[#B3263A]">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Hủy</Button>
        <Button
          className="bg-[#A32638] hover:bg-[#8a1f2f] text-white"
          onClick={() => {
            if (!subject) { setError("Vui lòng chọn bộ môn"); return; }
            if (years < 0) { setError("Số năm không hợp lệ"); return; }
            onSave({ id: initial?.id ?? "", subject, years, note: note || undefined });
          }}
        >
          Lưu
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span style={{ fontWeight: 500 }} className="text-right">{value}</span>
    </div>
  );
}
