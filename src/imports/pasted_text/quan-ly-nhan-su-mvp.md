Hãy thiết kế một MVP high-fidelity, có tương tác prototype, cho màn hình web admin “Quản lý nhân sự” của hệ thống quản lý trung tâm thể thao/học viện. Giao diện dùng tiếng Việt, theme đỏ giống ảnh tham chiếu: màu chính đỏ rượu #A32638 hoặc #B3263A, nền #F7F7F8, card trắng, border #E5E7EB, nền cảnh báo hồng nhạt #FCEAED, trạng thái hoạt động màu xanh #16A34A. Phong cách hiện đại, sạch, nhiều khoảng trắng, bo góc 12px, shadow nhẹ, icon line.

Bối cảnh dữ liệu:
- Nhân sự chủ yếu là huấn luyện viên/giảng viên.
- Entity Coach gồm: documentID, name, gender, birthday, contactInfo, email, phone, avatar, cover, introduce, status, verifyStatus, subjectIds, experienceYears, achievements, certificates.
- Certificate gồm: name, issuedBy, issuedYear, expiredYear nullable, fileUrl nullable.
- CoachInCenter gồm: centerId, coachId, role, startDate, endDate nullable, note, status, subjectIds, displayOrder.
- Subject gồm: documentID, name, logo, cover.
- Vai trò gồm: Owner, Admin, Coach Full, Coach, Staff.
- Trạng thái gồm: Đang hoạt động, Ngưng hoạt động.
- Bộ môn mẫu: Pickleball, Tennis, Bóng chuyền, Cầu lông.

Mục tiêu MVP:
Tạo đủ flow CRUD nhân sự:
1. Xem danh sách nhân sự.
2. Thêm nhân sự mới.
3. Xem chi tiết nhân sự bằng side panel bên phải.
4. Chỉnh sửa nhân sự ngay trong side panel.
5. Quản lý trình độ/chứng chỉ trong side panel: thêm, sửa, xóa chứng chỉ.
6. Phân quyền nhân sự.
7. Tạm ngưng/kích hoạt nhân sự.
8. Xóa nhân sự bằng confirmation modal.

Kích thước chính:
- Desktop frame: 1440 x 1024.
- Thiết kế responsive theo logic: trên desktop dùng layout 3 cột card hoặc table/card hybrid; side panel bên phải rộng 520px. Trên mobile, side panel biến thành full screen sheet.
- Header cao khoảng 72px, màu đỏ chính, chữ trắng.

Màn hình 1: Trang chính “Quản lý nhân sự”
Header:
- Thanh top màu đỏ, có icon back bên trái và title “Quản lý nhân sự”.
- Bên phải có icon thông báo/avatar admin nếu cần.

KPI cards phía trên:
- Tổng nhân sự: 120
- Đang hoạt động: 67
- Ngưng hoạt động: 10
- Thiếu hồ sơ: 8
Mỗi KPI là card trắng/đỏ nhạt, có icon, số lớn, label nhỏ. Card “Tổng nhân sự” dùng nền hồng nhạt và border đỏ để nổi bật.

Toolbar:
- Search input: placeholder “Tìm theo tên, SĐT, email, chứng chỉ…”
- Button “Bộ lọc” có icon filter.
- Sort dropdown “A → Z”.
- Dropdown “Tất cả vai trò”.
- Dropdown “Tất cả bộ môn”.
- Dropdown “Trạng thái”.
- Date picker “Ngày bắt đầu”.
- Nút chính màu đỏ: “+ Thêm nhân sự”.
- Toggle view: grid/list.
- Icon refresh.

Bộ lọc nâng cao khi nhấn “Bộ lọc”:
Mở popover hoặc drawer nhỏ gồm:
- Vai trò: Owner, Admin, Coach Full, Coach, Staff.
- Bộ môn: Pickleball, Tennis, Bóng chuyền, Cầu lông.
- Trạng thái: Đang hoạt động, Ngưng hoạt động.
- Hồ sơ: Có chứng chỉ, Chưa có chứng chỉ, Thiếu ảnh chứng chỉ, Chưa gắn bộ môn.
- Xác minh: Đã xác minh, Chưa xác minh.
- Nút “Áp dụng” và “Xóa bộ lọc”.
Sau khi lọc, hiển thị filter chips dưới toolbar: “Pickleball ×”, “Đang hoạt động ×”, “Có chứng chỉ ×”, “Xóa tất cả”.

Danh sách nhân sự:
Tạo card nhân sự đẹp, ít rối hơn ảnh cũ. Mỗi card gồm:
- Avatar tròn 48px.
- Tên: “Hoàng An Nam”.
- Badge vai trò: “Giảng viên” hoặc “Coach Full”.
- Badge trạng thái: “Hoạt động” màu xanh hoặc “Ngưng hoạt động” màu xám/đỏ nhạt.
- Badge xác minh: “Đã xác minh” hoặc “Chưa xác minh”.
- Bộ môn dạng chip: Pickleball, Tennis.
- Phone, email.
- Ngày bắt đầu: 20/12/2020.
- Số năm kinh nghiệm: 5 năm.
- Chứng chỉ: “2 chứng chỉ”.
- Lớp đang dạy: “3 lớp đang dạy”.
- Dòng action nhỏ: “Xem chi tiết”.
- Nút dấu ba chấm ở góc phải trên card.

Menu khi nhấn dấu ba chấm của card nhân sự:
Hiển thị dropdown menu gồm:
1. “Xem chi tiết thông tin nhân sự” với icon user/info.
2. “Phân quyền” với icon shield/key.
3. “Chỉnh sửa nhanh” với icon edit.
4. “Thêm trình độ/chứng chỉ” với icon certificate/upload.
5. “Tạm ngưng nhân sự” hoặc “Kích hoạt lại” tùy trạng thái.
6. “Xóa nhân sự” màu đỏ, icon trash.
Menu phải giống style ảnh: card trắng, shadow, icon bên trái, text lớn dễ đọc.

Tương tác quan trọng:
- Khi click “Xem chi tiết thông tin nhân sự” hoặc click card, mở side panel bên phải.
- Khi click “Phân quyền”, mở modal/drawer phân quyền.
- Khi click “Thêm nhân sự”, mở side panel/form thêm mới.
- Khi click “Xóa nhân sự”, mở confirm modal.
- Khi click “Tạm ngưng”, mở confirmation modal rồi cập nhật badge thành “Ngưng hoạt động”.

Màn hình 2: Side panel “Chi tiết thông tin nhân sự”
Side panel bên phải rộng 520px, overlay nền mờ nhẹ bên trái. Có nút X đóng ở góc trái/top của panel hoặc góc phải/top.
Header panel:
- Cover nhỏ màu đỏ nhạt hoặc ảnh cover.
- Avatar lớn 72px.
- Tên: “Hoàng An Nam”.
- Vai trò: “Giảng viên”.
- Badge trạng thái: “Đang hoạt động”.
- Badge xác minh: “Đã xác minh”.
- Nút chính “Chỉnh sửa”.
- Nút phụ “Phân quyền”.
- Nút ba chấm trong panel cho thêm action.

Tabs trong side panel:
1. “Tổng quan”
2. “Lớp đang dạy”
3. “Trình độ”
4. “Quyền”
5. “Lịch sử”

Tab Tổng quan:
Hiển thị các section dạng card:
- Thông tin cá nhân:
  - Họ tên
  - Giới tính
  - Ngày sinh
  - SĐT
  - Email
- Thông tin làm việc:
  - Vai trò tại trung tâm
  - Bộ môn tại trung tâm: Pickleball, Tennis
  - Ngày bắt đầu
  - Ngày kết thúc nếu có
  - Thứ tự hiển thị: displayOrder
  - Trạng thái
- Giới thiệu:
  - introduce text 2-3 dòng
- Kinh nghiệm & thành tích:
  - Số năm kinh nghiệm
  - Achievements dạng bullet/chip

Tab Lớp đang dạy:
Hiển thị list class card:
- “Pickleball cơ bản K01”
- Vai trò: HLV chính / Trợ giảng
- Lịch: T2, T4, T6 · 18:00 - 19:30
- Trạng thái lớp: Đang dạy
- Số học viên: 12/20
Có empty state nếu chưa có lớp: icon calendar, text “Nhân sự chưa được phân công lớp”.

Tab Trình độ:
Hiển thị danh sách chứng chỉ dạng card:
- Thumbnail ảnh chứng chỉ bên trái.
- Tên chứng chỉ: “Chứng chỉ Huấn luyện Pickleball Level 1”.
- Tổ chức cấp: “VPA”.
- Năm cấp: 2023.
- Năm hết hạn: 2026 hoặc “Không thời hạn”.
- Bộ môn liên quan: Pickleball nếu có.
- File/ảnh: button “Xem ảnh”.
- Actions: “Chỉnh sửa”, “Xóa”.
Phía trên tab có nút đỏ “+ Thêm trình độ”.

Form thêm/sửa trình độ:
Mở modal hoặc sub-drawer trong side panel.
Fields:
- Tên chứng chỉ *.
- Ảnh/chứng chỉ *: upload area có drag & drop, preview ảnh, text “JPG, PNG, WEBP tối đa 5MB”.
- Bộ môn liên quan: dropdown optional.
- Tổ chức cấp.
- Năm cấp.
- Năm hết hạn optional.
- URL/fileUrl chứng thực optional.
- Ghi chú optional.
Buttons:
- “Hủy”
- “Lưu”
- “Lưu & thêm tiếp”
Validation:
- Nếu bỏ trống tên chứng chỉ: hiện lỗi “Vui lòng nhập tên chứng chỉ”.
- Nếu chưa upload ảnh: hiện lỗi “Vui lòng tải ảnh chứng chỉ”.
- Bộ môn không bắt buộc.

Tab Quyền:
Hiển thị role hiện tại và quyền module:
- Vai trò hệ thống: Admin / Coach Full / Coach / Staff.
- Module Class: Xem, Tạo, Sửa, Xóa, Phân công HLV.
- Module Coach: Xem, Thêm, Sửa, Tạm ngưng, Phân quyền.
- Module Student: Xem, Thêm, Sửa.
- Module Finance: Xem, Thu học phí, Hoàn tiền.
Hiển thị quyền dạng checkbox hoặc switch.
Nếu quyền khác preset, hiện badge “Custom”.

Tab Lịch sử:
Timeline:
- 01/01/2026: Được thêm vào trung tâm bởi Admin.
- 05/01/2026: Cập nhật bộ môn Pickleball.
- 10/01/2026: Thêm chứng chỉ mới.
- 15/01/2026: Cập nhật quyền Coach Full.

Màn hình 3: Form “Thêm nhân sự”
Khi nhấn “+ Thêm nhân sự”, mở side panel bên phải hoặc modal full height, title “Thêm mới nhân sự”.
Nội dung chia section rõ ràng:
1. Ảnh đại diện:
   - Avatar upload tròn, icon camera.
2. Thông tin cơ bản:
   - Họ tên *.
   - Số điện thoại *.
   - Email *.
   - Mật khẩu *.
   - Nhập lại mật khẩu *.
   - Giới tính dropdown.
   - Ngày sinh.
3. Thông tin làm việc:
   - Vai trò tại trung tâm *: Owner, Admin, Coach Full, Coach, Staff.
   - Bộ môn giảng dạy: multi-select Pickleball, Tennis, Bóng chuyền, Cầu lông.
   - Ngày bắt đầu.
   - Ngày kết thúc optional.
   - Thứ tự hiển thị.
   - Trạng thái switch: Đang hoạt động.
4. Hồ sơ chuyên môn:
   - Số năm kinh nghiệm.
   - Thành tích: input tag/chip.
   - Button “+ Thêm chứng chỉ”.
5. Giới thiệu:
   - Textarea “Giới thiệu ngắn về nhân sự”.
Footer sticky:
- Nút “Hủy”.
- Nút đỏ “Xác nhận”.
Prototype behavior:
- Khi nhấn “Xác nhận” với dữ liệu hợp lệ: đóng panel, hiển thị toast “Đã thêm nhân sự thành công”, thêm một card mới ở đầu danh sách.
- Nếu thiếu field bắt buộc, hiển thị error màu đỏ dưới field.
- Nút thêm nhân sự phải hoạt động trong prototype để tôi test.

Màn hình 4: Chỉnh sửa nhân sự
Trong side panel chi tiết có nút “Chỉnh sửa”. Khi nhấn:
- Chuyển side panel sang edit mode với title “Chỉnh sửa nhân sự”.
- Các field được điền sẵn dữ liệu.
- Có thể sửa: avatar, họ tên, SĐT, email, giới tính, ngày sinh, vai trò, bộ môn, ngày bắt đầu, ngày kết thúc, displayOrder, trạng thái, kinh nghiệm, thành tích, giới thiệu.
- Không hiển thị password trực tiếp; có section riêng “Bảo mật” với button “Đặt lại mật khẩu”.
Footer sticky:
- “Hủy”
- “Lưu thay đổi”
Prototype behavior:
- Lưu thành công: quay lại tab Tổng quan của detail side panel, toast “Đã cập nhật nhân sự”.
- Hủy: quay lại detail view không đổi dữ liệu.

Màn hình 5: Modal/Drawer “Phân quyền nhân sự”
Khi nhấn “Phân quyền” từ menu ba chấm hoặc trong side panel:
- Mở modal hoặc drawer center/right.
- Header: “Phân quyền nhân sự”.
- Card nhân sự nhỏ: avatar, tên, email, vai trò hiện tại, trạng thái.
- Dropdown “Vai trò hệ thống”: Owner, Admin, Coach Full, Coach, Staff.
- Hiển thị mô tả ngắn theo role đang chọn.
- Bảng quyền chi tiết theo module:
  - Nhân sự: Xem, Thêm, Sửa, Xóa, Phân quyền.
  - Lớp học: Xem, Tạo, Sửa, Xóa, Phân công HLV.
  - Học viên: Xem, Thêm, Sửa, Xóa.
  - Học phí: Xem, Tạo giao dịch, Hoàn tiền.
  - Báo cáo: Xem, Xuất file.
- Checkbox/switch từng quyền.
- Nếu chỉnh quyền thủ công, role hiển thị “Custom”.
Footer:
- “Hủy”
- “Cập nhật”
Prototype behavior:
- Cập nhật xong: đóng modal, toast “Đã cập nhật phân quyền”.

Màn hình 6: Xóa/Tạm ngưng/Kích hoạt
Confirmation modal:
- Tạm ngưng:
  Title: “Tạm ngưng nhân sự?”
  Text: “Nhân sự này sẽ không thể được phân công vào lớp mới, nhưng dữ liệu cũ vẫn được giữ.”
  Buttons: “Hủy”, “Tạm ngưng”.
- Kích hoạt:
  Title: “Kích hoạt lại nhân sự?”
  Buttons: “Hủy”, “Kích hoạt”.
- Xóa:
  Title: “Xóa nhân sự?”
  Text: “Thao tác này sẽ xóa nhân sự khỏi danh sách quản lý của trung tâm. Dữ liệu lịch sử vẫn được giữ nếu hệ thống dùng soft delete.”
  Buttons: “Hủy”, “Xóa” màu đỏ nguy hiểm.
Prototype behavior:
- Sau khi tạm ngưng: badge trên card đổi sang “Ngưng hoạt động”.
- Sau khi kích hoạt: badge đổi lại “Đang hoạt động”.
- Sau khi xóa: card biến mất khỏi danh sách, toast “Đã xóa nhân sự”.

Yêu cầu dữ liệu mẫu:
Tạo ít nhất 9 card nhân sự:
1. Hoàng An Nam — Coach Full — Pickleball, Tennis — Hoạt động — 2 chứng chỉ — 3 lớp.
2. Thầy Trung — Giảng viên — Bóng chuyền — Hoạt động — 1 chứng chỉ — 2 lớp.
3. Nguyễn Minh Anh — Staff — Không gắn bộ môn — Hoạt động — 0 chứng chỉ — 0 lớp.
4. Lê Thanh Tú — Coach — Pickleball — Ngưng hoạt động — 3 chứng chỉ — 1 lớp.
5. Trần Gia Hân — Admin — Tennis — Hoạt động — 2 chứng chỉ — 0 lớp.
Các card còn lại có dữ liệu tương tự để test grid.

Yêu cầu UI chi tiết:
- Dùng tiếng Việt toàn bộ.
- Không dùng quá nhiều text nhỏ; ưu tiên hierarchy rõ.
- Button chính màu đỏ, button phụ màu trắng viền xám.
- Status chip “Đang hoạt động” màu xanh nhạt; “Ngưng hoạt động” màu xám/đỏ nhạt.
- Role chip màu xanh dương nhạt hoặc đỏ nhạt tùy hierarchy.
- Certificate chip có icon bằng cấp.
- Bộ môn dùng chip có icon quả bóng nhỏ.
- Empty state đẹp cho danh sách trống, chưa có chứng chỉ, chưa có lớp.
- Toast notification góc phải dưới.
- Loading skeleton nhẹ khi mở side panel.
- Form có sticky footer để nút luôn nhìn thấy.

Yêu cầu prototype/clickable:
- Nút “+ Thêm nhân sự” phải mở form thêm.
- Nút “Xác nhận” trong form thêm phải tạo cảm giác thêm thành công bằng toast và quay về danh sách.
- Dấu ba chấm trên ít nhất card đầu tiên phải mở dropdown menu.
- Item “Xem chi tiết thông tin nhân sự” phải mở side panel chi tiết.
- Nút “Chỉnh sửa” trong side panel phải chuyển sang edit mode.
- Nút “Lưu thay đổi” phải quay lại detail mode và hiện toast.
- Tab “Trình độ” phải mở được.
- Nút “+ Thêm trình độ” phải mở form thêm chứng chỉ.
- Nút “Lưu” chứng chỉ phải thêm một certificate card vào tab Trình độ hoặc hiện toast.
- Item “Phân quyền” phải mở modal phân quyền.
- Nút “Cập nhật” trong phân quyền phải hiện toast.
- Item “Xóa nhân sự” phải mở confirm modal.
- Các tab trong side panel phải clickable.

Kết quả mong muốn:
Tạo một prototype MVP hoàn chỉnh cho tab “Quản lý nhân sự” với theme đỏ, đủ main screen, add staff flow, menu dấu ba chấm, side panel chi tiết, edit mode, certificate CRUD, permission modal, status actions và delete confirmation.