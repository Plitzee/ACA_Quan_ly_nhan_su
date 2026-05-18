import { useState } from "react";
import { Certificate, ALL_SUBJECTS } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload, X } from "lucide-react";

interface Props {
  initial?: Certificate;
  onCancel: () => void;
  onSave: (c: Certificate) => void;
}

export function CertificateForm({ initial, onCancel, onSave }: Props) {
  const [data, setData] = useState<Certificate>(
    initial ?? {
      id: "",
      name: "",
      issuedBy: "",
      issuedYear: new Date().getFullYear(),
      expiredYear: null,
      subject: "",
      imageUrl: "",
      note: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onFile = (file: File) => {
    const r = new FileReader();
    r.onload = () => setData({ ...data, imageUrl: r.result as string });
    r.readAsDataURL(file);
  };

  const handle = () => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Vui lòng nhập tên chứng chỉ";
    if (!data.imageUrl) e.image = "Vui lòng tải ảnh chứng chỉ";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Tên chứng chỉ *</Label>
        <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        {errors.name && <p className="text-xs text-[#B3263A] mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label>Ảnh chứng chỉ *</Label>
        <label className="block border-2 border-dashed border-[#E5E7EB] rounded-lg p-4 text-center cursor-pointer hover:border-[#B3263A] bg-[#FCEAED]/30">
          {data.imageUrl ? (
            <div className="relative inline-block">
              <img src={data.imageUrl} alt="" className="max-h-40 mx-auto rounded" />
              <p className="text-xs text-[#16A34A] mt-2">✓ Đã tải ảnh, click để đổi</p>
            </div>
          ) : (
            <>
              <Upload className="w-6 h-6 mx-auto text-[#B3263A]" />
              <p className="text-sm mt-2">Kéo thả hoặc click để chọn ảnh</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP tối đa 5MB</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>
        {errors.image && <p className="text-xs text-[#B3263A] mt-1">{errors.image}</p>}
      </div>

      <div>
        <Label>Bộ môn liên quan</Label>
        {data.subject ? (
          <div className="rounded-xl border-2 border-[#B3263A]/30 bg-gradient-to-r from-[#FCEAED] to-[#fde4e8] p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#B3263A] text-white flex items-center justify-center text-lg">
              ⚽
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#B3263A]/70">Bộ môn liên kết</p>
              <p style={{ fontWeight: 700 }} className="text-[#B3263A]">{data.subject}</p>
            </div>
            <button
              type="button"
              onClick={() => setData({ ...data, subject: "" })}
              className="text-[#B3263A] hover:bg-white/50 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Select value="none" onValueChange={(v) => setData({ ...data, subject: v })}>
            <SelectTrigger><SelectValue placeholder="Chọn bộ môn liên quan" /></SelectTrigger>
            <SelectContent>
              {ALL_SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Năm cấp</Label>
          <Input
            type="number"
            value={data.issuedYear}
            onChange={(e) => setData({ ...data, issuedYear: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Năm hết hạn</Label>
          <Input
            type="number"
            value={data.expiredYear ?? ""}
            placeholder="Không thời hạn"
            onChange={(e) => setData({ ...data, expiredYear: e.target.value ? Number(e.target.value) : null })}
          />
        </div>
      </div>
      <div>
        <Label>Ghi chú</Label>
        <Textarea
          value={data.note ?? ""}
          onChange={(e) => setData({ ...data, note: e.target.value })}
          rows={2}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Hủy</Button>
        <Button onClick={handle} className="bg-[#B3263A] hover:bg-[#8a1f2f] text-white">Lưu</Button>
      </div>
    </div>
  );
}
