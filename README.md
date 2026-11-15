# Vietnam Atlas — Vietnam Travel Directory & Practical Guides
> A curated 100% static travel directory of 1,000 places across Vietnam with practical guides for international visitors.

---

## 🚀 Live Deployment
- **Platform:** Vercel (Edge Network / SSG)
- **Live URL:** [Pending Vercel Import] *(Update this once deployed)*
- **Date Deployed:** November 15, 2026
- **Architecture:** Next.js (App Router) + TypeScript + Tailwind CSS (Full Static Site Generation)

---

## 🛠️ Lệnh Chạy Cục Bộ (Windows)

> ⚠️ **LƯU Ý QUAN TRỌNG:** Laptop chạy Windows nên luôn dùng cờ `--webpack` (không chạy Turbopack mặc định vì dễ phát sinh lỗi trên môi trường của bạn).

```bash
# 1. Di chuyển vào thư mục dự án
cd vietnam-travel-web

# 2. Cài đặt thư viện (nếu mới clone)
npm install

# 3. Chạy môi trường phát triển (Dev server)
npm run dev -- --webpack

# 4. Kiểm tra biên dịch tĩnh trước khi deploy (Build)
npm run build
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để xem trước.

---

## 📖 Hướng Dẫn Dành Cho Chủ Web (Owner Operations)

### 1. Cách Mở Thêm Địa Điểm Theo Đợt (Batch Publishing)
Hệ thống quản lý 1.000 địa điểm thông qua tệp dữ liệu `data/places.json`. Mọi trang web, sitemap và công cụ tìm kiếm chỉ hiển thị các địa điểm có `"published": true`.

**Quy trình mở thêm đợt mới (~50 đến 100 điểm):**
1. Mở file `data/places.json`.
2. Tìm địa điểm muốn mở (ví dụ: các địa điểm tại Đà Nẵng, Hà Nội, Hội An...).
3. Điền bản dịch tiếng Anh:
   - `name_en`: Tên tiếng Anh chuẩn xác (ví dụ: "Marble Mountains").
   - `desc_en`: Mô tả tiếng Anh từ 1–2 câu dễ hiểu.
4. Đổi cờ:
   ```json
   "published": true
   ```
5. Lưu tệp và chạy build lại:
   ```bash
   npm run build
   ```
   *Next.js sẽ tự động phát hiện các địa điểm mới, sinh trang `/places/[slug]`, cập nhật sitemap và thêm vào tìm kiếm.*
6. Đẩy code lên Git:
   ```bash
   git add .
   git commit -m "feat: publish batch 2 places"
   git push
   ```
   *Vercel sẽ tự động build và cập nhật phiên bản live trong vài phút.*

---

### 2. Cách Điền Link Tiếp Thị Liên Kết (Affiliate Configuration)
Mở tệp `config/affiliates.ts` và thay thế giá trị mẫu `"#"` bằng đường dẫn tiếp thị thực tế từ các nhà cung cấp:

```typescript
export const AFFILIATES = {
  twelveGo: "https://12go.asia/?z=YOUR_AFFILIATE_ID",    // Vé tàu, xe khách
  booking: "https://www.booking.com/index.html?aid=YOUR_ID", // Đặt phòng khách sạn
  klook: "https://www.klook.com/?aff_adid=YOUR_ID",        // Tour & vé tham quan
  airalo: "https://airalo.tp.st/YOUR_ID",                 // eSIM data du lịch
};
```

---

### 3. Đổi Tên Web & Bật Quảng Cáo (Site Config)
Mở tệp `config/site.ts`:
- **Đổi tên thương hiệu:** Sửa biến `SITE_NAME` (ví dụ từ `"Vietnam Atlas"` sang tên thương hiệu riêng khi bạn mua domain).
- **Cập nhật URL tên miền:** Điền `SITE_URL = "https://yourdomain.com"` để kích hoạt thẻ canonical SEO và sitemap đầy đủ.
- **Bật Google AdSense:** Khi trang web đạt trên 100 địa điểm xuất bản và đã được Google AdSense duyệt, đổi `ADS_ENABLED: true`.

---

### 4. Thiết Lập Nút "Share Your Photo" & Quy Trình Duyệt Ảnh Cộng Đồng (NV-12)

Trang web cho phép khách du lịch quốc tế gửi ảnh trải nghiệm thực tế thông qua **Google Form**. Hệ thống không mở cổng upload file trực tiếp lên server để đảm bảo an toàn 100% và không phát sinh chi phí backend. Chủ web duyệt tay ảnh trước khi đăng.

#### A. Tạo Google Form (Làm 1 lần, ~10 phút):
Tạo 1 Google Form bằng tiếng Anh gồm đúng 5 mục sau:
1. **Tiêu đề Form:** `Share your Vietnam travel photo`
2. **Ô 1 — `Your name (shown as photo credit)`:** Dạng Short answer (Trả lời ngắn), **Bắt buộc (Required)**.
3. **Ô 2 — `Email (optional)`:** Dạng Short answer, không bắt buộc.
4. **Ô 3 — `Which place is this photo of?`:** Dạng Short answer, **Bắt buộc (Required)**.
   > 💡 *Đây là ô sẽ được tự động điền sẵn tên địa điểm khi khách bấm từ trang chi tiết.*
5. **Ô 4 — `Upload your photo`:** Dạng File upload (Tải tệp lên), chỉ chọn loại Image, kích thước tối đa 10 MB, **Bắt buộc (Required)**. *(Khách cần đăng nhập Google để tải ảnh lên Drive của bạn).*
6. **Ô 5 — Ô tick cam kết bản quyền:** Dạng Checkboxes (Hộp kiểm) với 1 lựa chọn duy nhất, **Bắt buộc (Required)**, giữ nguyên văn tiếng Anh:
   `This photo is my own work, and I give this website permission to publish it with credit to my name.`
7. **Thông điệp cảm ơn sau khi gửi (Settings → Presentation → Confirmation message):**
   `Thank you! Every photo is reviewed by hand — if yours is selected, it will appear on the place page with your name credited.`

#### B. Kích hoạt nút trên website:
1. Trong Google Form, bấm menu 3 chấm góc trên bên phải → chọn **Get pre-filled link** (Nhận đường liên kết được điền sẵn) → gõ chữ `TEST` vào ô *Which place is this photo of?* → bấm **Get link** → **Copy link**.
2. Nhìn vào link vừa copy, bạn sẽ thấy đoạn dạng:
   `https://docs.google.com/forms/d/e/.../viewform?usp=pp_url&entry.123456789=TEST`
   Phần `entry.123456789` chính là mã field của ô địa điểm.
3. Mở tệp `config/site.ts`:
   - Dán link form gốc vào `PHOTO_FORM_URL = "https://forms.gle/..."` (hoặc link form đầy đủ).
   - Dán mã entry vào `PHOTO_FORM_PLACE_FIELD = "entry.123456789"`.
4. Chạy `npm run build` và deploy. Nút `Share your photo` sẽ tự động hiển thị trên mọi trang địa điểm và link `Contribute a photo` sẽ xuất hiện ở Footer!

#### C. Quy trình duyệt ảnh của chủ web:
1. Mở thư mục Google Drive tự động liên kết với Form để xem các ảnh khách vừa tải lên.
2. **Nếu ảnh đạt chuẩn (đẹp, rõ nét, đúng địa điểm):**
   - Tải ảnh về máy và lưu vào thư mục `public/photos/community/{slug}/` (ví dụ: `public/photos/community/hoan-kiem-lake/morning-walk.jpg`).
   - Mở `data/places.json` (hoặc qua trang Admin), thêm trường `extra_photos` vào địa điểm đó:
     ```json
     "extra_photos": [
       {
         "src": "/photos/community/hoan-kiem-lake/morning-walk.jpg",
         "credit_name": "Sarah Jenkins"
       }
     ]
     ```
     *(Điền đúng `credit_name` theo tên khách đã khai trong form).*
   - Chạy `npm run build` và `git push` để cập nhật lên live. Khối `Photos from travellers` sẽ tự động hiện dưới mô tả với dòng ghi công: `Photo: Sarah Jenkins — traveller contribution`.
3. **Nếu ảnh không đạt (mờ, lệch chủ đề, vi phạm thuần phong mỹ tục):**
   - Xóa tệp khỏi Google Drive, không cần phản hồi.

---

## ⚖️ Luật Cứng & Pháp Lý (Hard Rules)
1. **Giao diện & nội dung 100% tiếng Anh:** Tên tiếng Việt chỉ hiển thị ở dòng phụ `Local name:` tại trang chi tiết.
2. **Ghi công bản quyền ảnh Wikimedia Commons:** Mọi ảnh đều hiển thị dòng credit tác giả + loại giấy phép CC và đường dẫn nguồn.
3. **Xử lý thiếu ảnh (`photo_status = missing`):** Tuyệt đối không dùng ảnh stock giả mạo; hiển thị khung placeholder trang nhã gồm gradient và icon.
4. **Bảo mật link Affiliate:** Mọi liên kết chuyển tiếp đều gắn thuộc tính:
   `target="_blank" rel="nofollow sponsored noopener"`.
