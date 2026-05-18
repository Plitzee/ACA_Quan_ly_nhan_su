import { useEffect, useState } from "react";
import { Staff, ALL_SUBJECTS, ALL_CENTER_ROLES, CenterRole, Certificate, Expertise } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Camera, X, Plus, Trash2, Award, User, GraduationCap, ImageIcon } from "lucide-react";
import { MultiSelect } from "./MultiSelect";
import { CertificateForm } from "./CertificateForm";

interface Props {
  initial?: Staff;
  mode: "create" | "edit";
  onCancel: () => void;
  onSubmit: (data: Staff) => void;
}

const empty: Staff = {
  id: "",
  name: "",
  gender: "Nam",
  birthday: "",
  email: "",
  phone: "",
  introduce: "",
  status: "active",
  systemRole: "Coach",
  expertises: [],
  centerRole: "Giảng viên",
  subjects: [],
  startDate: new Date().toISOString().slice(0, 10),
  experienceYears: 0,
  achievements: [],
  certificates: [],
  classesCount: 0,
};

export function StaffForm({ initial, mode, onCancel, onSubmit }: Props) {
  const [data, setData] = useState<Staff>(initial ?? empty);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [achievement, setAchievement] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState("info");
  const [certDialog, setCertDialog] = useState<{ open: boolean; cert?: Certificate }>({ open: false });
  const [expDialog, setExpDialog] = useState<{ open: boolean; exp?: Expertise }>({ open: false });

  useEffect(() => {
    if (initial) setData(initial);
  }, [initial]);

  const set = <K extends keyof Staff>(k: K, v: Staff[K]) =>
    setData((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!data.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    if (!data.email.trim()) e.email = "Vui lòng nhập email";
    if (mode === "create") {
      if (!password) e.password = "Vui lòng nhập mật khẩu";
      if (password !== confirmPass) e.confirmPass = "Mật khẩu không khớp";
    }
    if (!data.centerRole) e.centerRole = "Vui lòng chọn vai trò";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setTab("info");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(data);
  };

  const addAchievement = () => {
    if (!achievement.trim()) return;
    set("achievements", [...data.achievements, achievement.trim()]);
    setAchievement("");
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="px-5 pt-4 shrink-0">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="info">
              <User className="w-4 h-4 mr-1" /> Thông tin
            </TabsTrigger>
            <TabsTrigger value="expertise">
              <GraduationCap className="w-4 h-4 mr-1" /> Chuyên môn
            </TabsTrigger>
            <TabsTrigger value="certs">
              <Award className="w-4 h-4 mr-1" /> Trình độ
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4 min-h-0">
          <TabsContent value="info" className="space-y-5 mt-0">
            <section>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#FCEAED] flex items-center justify-center text-[#A32638]">
                    {data.name ? data.name.split(" ").slice(-2).map((n) => n[0]).join("") : <Camera className="w-6 h-6" />}
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 bg-[#B3263A] text-white p-1.5 rounded-full">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">Ảnh đại diện</div>
              </div>
            </section>

            <section className="space-y-3">
              <div>
                <Label>Họ tên *</Label>
                <Input value={data.name} onChange={(e) => set("name", e.target.value)} />
                {errors.name && <p className="text-xs text-[#A32638] mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>SĐT *</Label>
                  <Input value={data.phone} onChange={(e) => set("phone", e.target.value)} />
                  {errors.phone && <p className="text-xs text-[#A32638] mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input value={data.email} onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <p className="text-xs text-[#A32638] mt-1">{errors.email}</p>}
                </div>
              </div>
              {mode === "create" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Mật khẩu *</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="text-xs text-[#A32638] mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <Label>Nhập lại mật khẩu *</Label>
                    <Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                    {errors.confirmPass && <p className="text-xs text-[#A32638] mt-1">{errors.confirmPass}</p>}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Giới tính</Label>
                  <Select value={data.gender} onValueChange={(v) => set("gender", v as Staff["gender"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ngày sinh</Label>
                  <Input type="date" value={data.birthday} onChange={(e) => set("birthday", e.target.value)} />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 style={{ fontWeight: 600 }} className="text-[#B3263A]">Thông tin làm việc</h4>
              <div>
                <Label>Vai trò *</Label>
                <Select value={data.centerRole} onValueChange={(v) => set("centerRole", v as CenterRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_CENTER_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.centerRole && <p className="text-xs text-[#A32638] mt-1">{errors.centerRole}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Vai trò hệ thống (quyền truy cập) được thiết lập sau khi tạo, trong phần Phân quyền.
                </p>
              </div>
              <div>
                <Label>Bộ môn giảng dạy</Label>
                <MultiSelect
                  options={ALL_SUBJECTS}
                  value={data.subjects}
                  onChange={(v) => set("subjects", v)}
                  placeholder="Chọn bộ môn..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <Input type="date" value={data.startDate} onChange={(e) => set("startDate", e.target.value)} />
                </div>
                <div>
                  <Label>Ngày kết thúc</Label>
                  <Input type="date" value={data.endDate ?? ""} onChange={(e) => set("endDate", e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.status === "active"}
                  onCheckedChange={(c) => set("status", c ? "active" : "inactive")}
                />
                <span className="text-sm">{data.status === "active" ? "Đang hoạt động" : "Ngưng hoạt động"}</span>
              </div>
            </section>

            <section className="space-y-2">
              <h4 style={{ fontWeight: 600 }} className="text-[#B3263A]">Giới thiệu</h4>
              <Textarea
                value={data.introduce}
                onChange={(e) => set("introduce", e.target.value)}
                rows={3}
                placeholder="Giới thiệu ngắn về nhân sự"
              />
            </section>

            {mode === "edit" && (
              <section className="space-y-3">
                <h4 style={{ fontWeight: 600 }} className="text-[#B3263A]">Bảo mật</h4>
                <Button type="button" variant="outline">Đặt lại mật khẩu</Button>
              </section>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setTab("expertise")}
                className="bg-[#B3263A] hover:bg-[#8a1f2f] text-white"
              >
                Tiếp tục →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="expertise" className="space-y-5 mt-0">
            <section className="space-y-3">
              <h4 style={{ fontWeight: 600 }} className="text-[#B3263A]">Hồ sơ chuyên môn</h4>
              <div>
                <Label>Số năm kinh nghiệm</Label>
                <Input
                  type="number"
                  value={data.experienceYears}
                  onChange={(e) => set("experienceYears", Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Thành tích</Label>
                <div className="flex gap-2">
                  <Input
                    value={achievement}
                    onChange={(e) => setAchievement(e.target.value)}
                    placeholder="Nhập thành tích..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                  />
                  <Button type="button" variant="outline" onClick={addAchievement}>Thêm</Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {data.achievements.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-[#FCEAED] text-[#B3263A] px-2 py-1 rounded-full text-xs">
                      {a}
                      <button
                        type="button"
                        onClick={() => set("achievements", data.achievements.filter((_, j) => j !== i))}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 style={{ fontWeight: 600 }} className="text-[#B3263A]">Chuyên môn ({data.expertises.length})</h4>
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#B3263A] hover:bg-[#8a1f2f] text-white"
                  onClick={() => setExpDialog({ open: true })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm chuyên môn
                </Button>
              </div>
              {data.expertises.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border border-dashed border-[#E5E7EB] rounded-xl">
                  <Award className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Chưa có chuyên môn</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.expertises.map((e) => (
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
                            onClick={() => set("expertises", data.expertises.filter((x) => x.id !== e.id))}
                          >
                            <Trash2 className="w-3 h-3 inline" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setTab("certs")}
                className="bg-[#B3263A] hover:bg-[#8a1f2f] text-white"
              >
                Tiếp tục →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="certs" className="space-y-5 mt-0">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 style={{ fontWeight: 600 }} className="text-[#B3263A]">Trình độ / Chứng chỉ</h4>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setCertDialog({ open: true })}
                  className="border-[#B3263A] text-[#B3263A] hover:bg-[#FCEAED]"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm trình độ
                </Button>
              </div>

              {data.certificates.length === 0 ? (
                <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center">
                  <Award className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="text-sm text-gray-400 mt-2">Chưa có trình độ/chứng chỉ</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.certificates.map((c) => (
                    <div key={c.id} className="border border-[#E5E7EB] rounded-xl p-3 flex gap-3">
                      <div className="w-16 h-16 bg-[#FCEAED] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[#A32638]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 style={{ fontWeight: 600 }} className="truncate">{c.name || "Chưa đặt tên"}</h5>
                        <p className="text-xs text-gray-500">
                          {c.issuedBy || "—"}{c.issuedYear ? ` · ${c.issuedYear}` : ""}
                        </p>
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
                            onClick={() => set("certificates", data.certificates.filter((x) => x.id !== c.id))}
                          >
                            <Trash2 className="w-3 h-3 inline" /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={certDialog.open} onOpenChange={(o) => !o && setCertDialog({ open: false })}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{certDialog.cert ? "Chỉnh sửa trình độ/chứng chỉ" : "Thêm trình độ/chứng chỉ"}</DialogTitle>
            <DialogDescription>
              Nhập thông tin chứng chỉ và tải ảnh chứng chỉ liên quan.
            </DialogDescription>
          </DialogHeader>
          <CertificateForm
            initial={certDialog.cert}
            onCancel={() => setCertDialog({ open: false })}
            onSave={(c) => {
              if (certDialog.cert) {
                set(
                  "certificates",
                  data.certificates.map((x) => (x.id === certDialog.cert!.id ? { ...c, id: x.id } : x))
                );
              } else {
                set("certificates", [...data.certificates, { ...c, id: `c_${Date.now()}` }]);
              }
              setCertDialog({ open: false });
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={expDialog.open} onOpenChange={(o) => !o && setExpDialog({ open: false })}>
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
                set(
                  "expertises",
                  data.expertises.map((x) => (x.id === expDialog.exp!.id ? { ...e, id: x.id } : x))
                );
              } else {
                set("expertises", [...data.expertises, { ...e, id: `e_${Date.now()}` }]);
              }
              setExpDialog({ open: false });
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="border-t border-[#E5E7EB] p-4 flex justify-end gap-2 bg-white shrink-0">
        <Button variant="outline" onClick={onCancel}>Hủy</Button>
        <Button onClick={handleSubmit} className="bg-[#B3263A] hover:bg-[#8a1f2f] text-white">
          {mode === "create" ? "Xác nhận" : "Lưu thay đổi"}
        </Button>
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