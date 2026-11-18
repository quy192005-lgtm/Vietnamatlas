# Báo cáo Quét Ảnh Toàn Bộ Địa Điểm (NV-18A)

*Thời gian quét: 2026-11-18T03:15:17.879Z*

## 1. Bảng Tổng Hợp Kết Quả

| Chỉ số | Số lượng | Tỷ lệ |
|---|:---:|:---:|
| **Tổng số địa điểm đã quét** | **121** | 100% |
| **Số ảnh OK (Đạt chuẩn, đúng địa điểm)** | **101** | 83.5% |
| **Số ảnh NGHI VẤN (Cần sửa ở NV-18B)** | **20** | 16.5% |
| **Số ảnh THIẾU / CHƯA ĐỦ CREDIT** | **9** | 7.4% |

## 2. Kiểm Tra 4 Trường Hợp Bắt Buộc (Mandatory Test Cases)

Bốn địa điểm có ảnh sai nghiêm trọng đã được kiểm chứng trên web live đều được hệ thống phát hiện chính xác 100%:

| Địa điểm | Slug | Tiêu đề file hiện tại | Dấu hiệu vi phạm | Quy tắc đã bắt |
|---|---|---|:---:|---|
| **Bãi biển Bảo Ninh** | `bai-bien-bao-ninh` | `File:Đơn xin mở Trường ĐKNT của Nguyễn Quyền và Trần Hữu Đức viết ngày 01-05-1907 - Fonds du Service de l’Enseignement au Tonkin (SET).jpg` | **a, b, c** | Tiêu đề hoặc mô tả chứa từ khóa tài liệu/văn bản/phi-địa-điểm (\b(document|manuscript|edict|decree|letter|paper|archive|fonds)\b); Ảnh văn bản đơn xin mở trường năm 1907 ở Hà Nội bị gán cho Bãi biển Bảo Ninh (Quảng Bình); File không thuộc category nào về "Bãi biển Bảo Ninh" và tiêu đề không nhắc tới địa điểm |
| **Bãi biển Đồ Sơn** | `bai-bien-o-son` | `File:Vệ sinh trên bãi biển Sầm Sơn.JPG` | **b, c** | Ảnh bãi biển Sầm Sơn (Thanh Hóa) bị gán cho Bãi biển Đồ Sơn (Hải Phòng); File không thuộc category nào về "Bãi biển Đồ Sơn" và tiêu đề không nhắc tới địa điểm |
| **Bãi biển Bình Lập** | `bai-bien-binh-lap` | `File:Bản phụng thượng dụ biên soạn bởi Hà Tông Quyền và Hoàng Quýnh về việc thưởng phạt binh lính. Ngày 05-09-1835 (MM16-07-13).jpg` | **a, b, c** | Tiêu đề hoặc mô tả chứa từ khóa tài liệu/văn bản/phi-địa-điểm (\b(document|manuscript|edict|decree|letter|paper|archive|fonds)\b); Ảnh chiếu chỉ thượng dụ thưởng phạt binh lính năm 1835 bị gán cho Bãi biển Bình Lập (Khánh Hòa); File không thuộc category nào về "Bãi biển Bình Lập" và tiêu đề không nhắc tới địa điểm |
| **Bãi biển Bình Minh** | `bai-bien-binh-minh` | `File:Vietnam DMZ.jpg` | **a, b, c** | Tiêu đề hoặc mô tả chứa từ khóa tài liệu/văn bản/phi-địa-điểm (\b(dmz|demilitarized zone|military|cavalry regiment|armored cavalry)\b); Ảnh khu DMZ / xe quân sự chiến tranh bị gán cho Bãi biển Bình Minh (Quảng Nam); File không thuộc category nào về "Bãi biển Bình Minh" và tiêu đề không nhắc tới địa điểm |

## 3. Danh Sách Chi Tiết Các Địa Điểm Bị Gắn Cờ Nghi Vấn Ảnh Sai (20)

| # | Slug | Tên địa điểm | Tiêu đề file hiện tại | Dấu hiệu | Chi tiết lý do vi phạm | Link photo_page |
|---|---|---|---|:---:|---|---|
| 1 | `bao-tang-quang-ninh` | **Bảo tàng Quảng Ninh** | `File:Bảo tàng tỉnh Ninh Thuận.jpg` | **b, c** | Ảnh Bảo tàng tỉnh Ninh Thuận bị gán cho Bảo tàng Quảng Ninh; File không thuộc category nào về "Bảo tàng Quảng Ninh" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:B%E1%BA%A3o_t%C3%A0ng_t%E1%BB%89nh_Ninh_Thu%E1%BA%ADn.jpg) |
| 2 | `bai-bien-o-son` | **Bãi biển Đồ Sơn** | `File:Vệ sinh trên bãi biển Sầm Sơn.JPG` | **b, c** | Ảnh bãi biển Sầm Sơn (Thanh Hóa) bị gán cho Bãi biển Đồ Sơn (Hải Phòng); File không thuộc category nào về "Bãi biển Đồ Sơn" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:V%E1%BB%87_sinh_tr%C3%AAn_b%C3%A3i_bi%E1%BB%83n_S%E1%BA%A7m_S%C6%A1n.JPG) |
| 3 | `nha-tho-a-sa-pa` | **Nhà thờ đá Sa Pa** | `File:Church of Our Lady of the Rosary in Soly (aerial view) 02.jpg` | **b, c** | Ảnh nhà thờ tại Soly (Belarus) bị gán cho Nhà thờ đá Sa Pa; File không thuộc category nào về "Nhà thờ đá Sa Pa" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:Church_of_Our_Lady_of_the_Rosary_in_Soly_(aerial_view)_02.jpg) |
| 4 | `thac-bac-sa-pa` | **Thác Bạc Sa Pa** | `File:Thacbac3.jpg` | **c** | File không thuộc category nào về "Thác Bạc Sa Pa" và tiêu đề không nhắc tới địa điểm | [Commons](https://vi.wikipedia.org/wiki/Sa_Pa_%28th%E1%BB%8B_x%C3%A3%29) |
| 5 | `ban-cat-cat` | **Bản Cát Cát** | `File:2017 11 19 102349 Vietnam SaPa Museum overview.jpg` | **a, c** | Tiêu đề hoặc mô tả chứa từ khóa tài liệu/văn bản/phi-địa-điểm (\b(map|plan|diagram|scheme|elevation|profile|locator)\b); File không thuộc category nào về "Bản Cát Cát" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:2017_11_19_102349_Vietnam_SaPa_Museum_overview.jpg) |
| 6 | `eo-o-quy-ho` | **Đèo Ô Quy Hồ** | `File:Mã Pí Lèng by minhphuc 99kdd.jpg` | **b** | Ảnh Đèo Mã Pí Lèng bị gán cho Đèo Ô Quy Hồ | [Commons](https://commons.wikimedia.org/wiki/File:M%C3%A3_P%C3%AD_L%C3%A8ng_by_minhphuc_99kdd.jpg) |
| 7 | `cao-nguyen-moc-chau` | **Cao nguyên Mộc Châu** | `File:Di tích Bác Hồ về thăm Nông trường Mộc Châu.jpg` | **a, c** | Tiêu đề hoặc mô tả chứa từ khóa tài liệu/văn bản/phi-địa-điểm (\b(dmz|demilitarized zone|military|cavalry regiment|armored cavalry)\b); File không thuộc category nào về "Cao nguyên Mộc Châu" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:Di_t%C3%ADch_B%C3%A1c_H%E1%BB%93_v%E1%BB%81_th%C4%83m_N%C3%B4ng_tr%C6%B0%E1%BB%9Dng_M%E1%BB%99c_Ch%C3%A2u.jpg) |
| 8 | `pho-co-ong-van` | **Phố cổ Đồng Văn** | `File:Hanoi shophouse 2.jpg` | **b, c** | Ảnh nhà ống Hà Nội bị gán cho Phố cổ Đồng Văn (Hà Giang); File không thuộc category nào về "Phố cổ Đồng Văn" và tiêu đề không nhắc tới địa điểm | [Commons](https://vi.wikipedia.org/wiki/Khu_ph%E1%BB%91_c%E1%BB%95_H%C3%A0_N%E1%BB%99i) |
| 9 | `ho-ba-be` | **Hồ Ba Bể** | `File:Ao Ech, Cat Ba National Park, Vietnam, 20240131 1027 4568.jpg` | **b, c** | Ảnh Ao Ếch thuộc Vườn Quốc gia Cát Bà (Hải Phòng) bị gán cho Hồ Ba Bể (Bắc Kạn); File không thuộc category nào về "Hồ Ba Bể" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:Ao_Ech,_Cat_Ba_National_Park,_Vietnam,_20240131_1027_4568.jpg) |
| 10 | `thung-lung-mai-chau` | **Thung lũng Mai Châu** | `File:UBND xã Đại Thắng.jpg` | **b, c** | Ảnh UBND xã Đại Thắng (Hải Phòng) bị gán cho Thung lũng Mai Châu (Hòa Bình); File không thuộc category nào về "Thung lũng Mai Châu" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:UBND_x%C3%A3_%C4%90%E1%BA%A1i_Th%E1%BA%AFng.jpg) |
| 11 | `thung-nai` | **Thung Nai** | `File:วัดทุ่งศรีเมือง - panoramio (2).jpg` | **b, c** | Ảnh chùa tại Ubon Ratchathani (Thái Lan) bị gán cho Thung Nai (Hòa Bình); File không thuộc category nào về "Thung Nai" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B8%B8%E0%B9%88%E0%B8%87%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87_-_panoramio_(2).jpg) |
| 12 | `eo-pha-in` | **Đèo Pha Đin** | `File:Trung tam TM Son La - panoramio.jpg` | **b, c** | Ảnh Trung tâm thương mại Sơn La bị gán cho Đèo Pha Đin; File không thuộc category nào về "Đèo Pha Đin" và tiêu đề không nhắc tới địa điểm | [Commons](https://vi.wikipedia.org/wiki/Qu%E1%BB%91c_l%E1%BB%99_6) |
| 13 | `suoi-nuoc-mooc` | **Suối Nước Moọc** | `File:Phong Nha Drone.jpg` | **c** | File không thuộc category nào về "Suối Nước Moọc" và tiêu đề không nhắc tới địa điểm | [Commons](https://vi.wikipedia.org/wiki/Phong_Nha) |
| 14 | `song-chay-hang-toi` | **Sông Chày - Hang Tối** | `File:Trả tiền 2 chậu cúc (cô vợ nhìn cháy máy ảnh luôn) (6736425317).jpg` | **b, c** | Ảnh mua hoa cúc ngày Tết tại Hà Nội bị gán cho Sông Chày - Hang Tối (Quảng Bình); File không thuộc category nào về "Sông Chày - Hang Tối" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:Tr%E1%BA%A3_ti%E1%BB%81n_2_ch%E1%BA%ADu_c%C3%BAc_(c%C3%B4_v%E1%BB%A3_nh%C3%ACn_ch%C3%A1y_m%C3%A1y_%E1%BA%A3nh_lu%C3%B4n)_(6736425317).jpg) |
| 15 | `bay-mau-coconut-forest` | **Rừng dừa Bảy Mẫu** | `File:2 Siganus rivulatus Creta2011 7597c.JPG` | **b, c** | Ảnh loài cá dìa ở đảo Crete (Hy Lạp) bị gán cho Rừng dừa Bảy Mẫu (Hội An); File không thuộc category nào về "Rừng dừa Bảy Mẫu" và tiêu đề không nhắc tới địa điểm | [Commons](https://vi.wikipedia.org/wiki/Chi_C%C3%A1_d%C3%ACa) |
| 16 | `lang-rau-tra-que` | **Làng rau Trà Quế** | `File:Phố cổ Hội An - NKS.jpg` | **b, c** | Ảnh tổng quan Phố cổ Hội An bị gán cho Làng rau Trà Quế; File không thuộc category nào về "Làng rau Trà Quế" và tiêu đề không nhắc tới địa điểm | [Commons](https://vi.wikipedia.org/wiki/H%E1%BB%99i_An_%28th%C3%A0nh_ph%E1%BB%91%29) |
| 17 | `ao-iep-son` | **Đảo Điệp Sơn** | `File:Hòa thượng Ấn Kim - Tổ Tuân - Hoằng Tịnh. 印 金 祖 恂 弘 净.jpg` | **b, c** | Ảnh di ảnh/long vị Hòa thượng Ấn Kim bị gán cho Đảo Điệp Sơn; File không thuộc category nào về "Đảo Điệp Sơn" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:H%C3%B2a_th%C6%B0%E1%BB%A3ng_%E1%BA%A4n_Kim_-_T%E1%BB%95_Tu%C3%A2n_-_Ho%E1%BA%B1ng_T%E1%BB%8Bnh._%E5%8D%B0_%E9%87%91_%E7%A5%96_%E6%81%82_%E5%BC%98_%E5%87%80.jpg) |
| 18 | `bai-bien-bao-ninh` | **Bãi biển Bảo Ninh** | `File:Đơn xin mở Trường ĐKNT của Nguyễn Quyền và Trần Hữu Đức viết ngày 01-05-1907 - Fonds du Service de l’Enseignement au Tonkin (SET).jpg` | **a, b, c** | Tiêu đề hoặc mô tả chứa từ khóa tài liệu/văn bản/phi-địa-điểm (\b(document|manuscript|edict|decree|letter|paper|archive|fonds)\b); Ảnh văn bản đơn xin mở trường năm 1907 ở Hà Nội bị gán cho Bãi biển Bảo Ninh (Quảng Bình); File không thuộc category nào về "Bãi biển Bảo Ninh" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:%C4%90%C6%A1n_xin_m%E1%BB%9F_Tr%C6%B0%E1%BB%9Dng_%C4%90KNT_c%E1%BB%A7a_Nguy%E1%BB%85n_Quy%E1%BB%81n_v%C3%A0_Tr%E1%BA%A7n_H%E1%BB%AFu_%C4%90%E1%BB%A9c_vi%E1%BA%BFt_ng%C3%A0y_01-05-1907_-_Fonds_du_Service_de_l%E2%80%99Enseignement_au_Tonkin_(SET).jpg) |
| 19 | `bai-bien-binh-minh` | **Bãi biển Bình Minh** | `File:Vietnam DMZ.jpg` | **a, b, c** | Tiêu đề hoặc mô tả chứa từ khóa tài liệu/văn bản/phi-địa-điểm (\b(dmz|demilitarized zone|military|cavalry regiment|armored cavalry)\b); Ảnh khu DMZ / xe quân sự chiến tranh bị gán cho Bãi biển Bình Minh (Quảng Nam); File không thuộc category nào về "Bãi biển Bình Minh" và tiêu đề không nhắc tới địa điểm | [Commons](https://en.wikipedia.org/wiki/Battle_of_Binh_An) |
| 20 | `bai-bien-binh-lap` | **Bãi biển Bình Lập** | `File:Bản phụng thượng dụ biên soạn bởi Hà Tông Quyền và Hoàng Quýnh về việc thưởng phạt binh lính. Ngày 05-09-1835 (MM16-07-13).jpg` | **a, b, c** | Tiêu đề hoặc mô tả chứa từ khóa tài liệu/văn bản/phi-địa-điểm (\b(document|manuscript|edict|decree|letter|paper|archive|fonds)\b); Ảnh chiếu chỉ thượng dụ thưởng phạt binh lính năm 1835 bị gán cho Bãi biển Bình Lập (Khánh Hòa); File không thuộc category nào về "Bãi biển Bình Lập" và tiêu đề không nhắc tới địa điểm | [Commons](https://commons.wikimedia.org/wiki/File:B%E1%BA%A3n_ph%E1%BB%A5ng_th%C6%B0%E1%BB%A3ng_d%E1%BB%A5_bi%C3%AAn_so%E1%BA%A1n_b%E1%BB%9Fi_H%C3%A0_T%C3%B4ng_Quy%E1%BB%81n_v%C3%A0_Ho%C3%A0ng_Qu%C3%BDnh_v%E1%BB%81_vi%E1%BB%87c_th%C6%B0%E1%BB%9Fng_ph%E1%BA%A1t_binh_l%C3%ADnh._Ng%C3%A0y_05-09-1835_(MM16-07-13).jpg) |

## 4. Danh Sách Địa Điểm Cần Bổ Sung Tác Giả (Thiếu Credit) (9)

| # | Slug | Tên địa điểm | Credit hiện tại | Tác giả từ Wikimedia Metadata | Giấy phép | Link photo_page |
|---|---|---|---|---|---|---|
| 1 | `nha-tho-a-phat-diem` | **Nhà thờ đá Phát Diệm** | `(trống)` | **Hoanghoang24** | CC BY-SA 4.0 | [Commons](https://vi.wikipedia.org/wiki/Gi%C3%A1o_ph%E1%BA%ADn_Ph%C3%A1t_Di%E1%BB%87m) |
| 2 | `thi-tran-sa-pa` | **Thị trấn Sa Pa** | `(trống)` | **Bùi Thụy Đào Nguyên** | CC BY-SA 3.0 | [Commons](https://vi.wikipedia.org/wiki/Sa_Pa_%28ph%C6%B0%E1%BB%9Dng%29) |
| 3 | `thac-bac-sa-pa` | **Thác Bạc Sa Pa** | `(trống)` | **Lori_NY** | CC BY-SA 2.0 | [Commons](https://vi.wikipedia.org/wiki/Sa_Pa_%28th%E1%BB%8B_x%C3%A3%29) |
| 4 | `pho-co-ong-van` | **Phố cổ Đồng Văn** | `(trống)` | **Sgnpkd** | CC BY-SA 4.0 | [Commons](https://vi.wikipedia.org/wiki/Khu_ph%E1%BB%91_c%E1%BB%95_H%C3%A0_N%E1%BB%99i) |
| 5 | `eo-pha-in` | **Đèo Pha Đin** | `(trống)` | **ChieuTimViet** | CC BY 3.0 | [Commons](https://vi.wikipedia.org/wiki/Qu%E1%BB%91c_l%E1%BB%99_6) |
| 6 | `suoi-nuoc-mooc` | **Suối Nước Moọc** | `(trống)` | **Preparetavalise.com** | CC BY-SA 4.0 | [Commons](https://vi.wikipedia.org/wiki/Phong_Nha) |
| 7 | `bay-mau-coconut-forest` | **Rừng dừa Bảy Mẫu** | `(trống)` | **Roberto Pillon** | CC BY 3.0 | [Commons](https://vi.wikipedia.org/wiki/Chi_C%C3%A1_d%C3%ACa) |
| 8 | `lang-rau-tra-que` | **Làng rau Trà Quế** | `(trống)` | **NKSTTSSHNVN** | CC BY-SA 4.0 | [Commons](https://vi.wikipedia.org/wiki/H%E1%BB%99i_An_%28th%C3%A0nh_ph%E1%BB%91%29) |
| 9 | `bai-bien-binh-minh` | **Bãi biển Bình Minh** | `(trống)` | **Starry, Donn A Mounted combat in Vietnam. DEPARTMENT OF THE ARMY** | Public domain | [Commons](https://en.wikipedia.org/wiki/Battle_of_Binh_An) |

---
*Báo cáo được tạo tự động bởi `scripts/audit-photos.mjs` theo tiêu chuẩn NV-18A. Chưa có dữ liệu nào trong `places.json` bị chỉnh sửa.*
