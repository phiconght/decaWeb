# KẾ HOẠCH CHI TIẾT: Web Portal (phiên bản "Mobile" chạy trên trình duyệt)

> **Trạng thái: CHƯA CODE — chỉ lên kế hoạch.** Bản này mở rộng rất nhiều so với bản trước: có đầy đủ kiểu dữ liệu TypeScript khớp 100% DTO thật của BE (đọc trực tiếp source Java, không đoán), wireframe từng màn, checklist a11y/bảo mật/test, và lộ trình chia nhỏ tới từng trang thay vì từng "đợt lớn".
>
> Đọc kèm: `docs/BE_AI_GUIDE.md`, `docs/ADMIN_AI_GUIDE.md`, `docs/MOBILE_AI_GUIDE.md`. `WEB/` là codebase thứ 4, dùng chung BE, dùng chung *tech stack + template gốc* với ADMIN, phục vụ đối tượng dùng của MOBILE.
>
> **Đã bỏ hoàn toàn điểm danh học viên khỏi phạm vi Web** (yêu cầu người dùng 14/08/2026) — xem §5.2. Chấm công GV (khác điểm danh HV) vẫn giữ.
>
> **UI/UX thiết kế lại theo hướng Web thật (yêu cầu người dùng 14/08/2026)** — KHÔNG bê nguyên layout app di động (bottom-tab, khung điện thoại 480px) sang. Thay vào đó **tận dụng tối đa đồ có sẵn của template**: dùng `ProLayout` (như ADMIN, chỉ đổi kiểu menu sang `top` cho gọn — tự responsive/tự có hamburger trên màn hẹp, không cần tự viết `BottomTabBar`), `ProTable`/`ProList` cho danh sách (không tự viết `AsyncList`), layout co giãn tự nhiên theo `antd` Grid thay vì ép khung điện thoại cố định. Xem §1 (quyết định #3/#4/#8/#12 đã sửa lại), §3, §6, §7.

---

## Mục lục

0. Mục tiêu & phạm vi
1. Quyết định kiến trúc (18 mục)
2. Clone template gốc + đồng bộ dependency (đầy đủ `package.json` đề xuất)
3. Cấu trúc dự án — cây file đầy đủ tới từng file
4. **Phụ lục kiểu dữ liệu TypeScript** — khớp 100% DTO thật của BE (phần dài nhất, dùng để code trực tiếp)
5. Ánh xạ tính năng: Mobile → Web (wireframe + state + API cho từng trang)
6. Auth & phân quyền
7. Component dùng chung cần dựng mới
8. Kế hoạch kiểm thử (test plan)
9. Checklist khả năng tiếp cận (a11y)
10. Checklist bảo mật
11. Quy ước Git / CI
12. Rủi ro & câu hỏi mở
13. Lộ trình triển khai — chia nhỏ tới từng trang
14. Checklist trước khi bắt đầu code

---

## 0. Mục tiêu & phạm vi

**Mục tiêu**: dựng web app mới **`WEB/`** tái hiện toàn bộ tính năng app Mobile (Flutter, `MOBILE/`) chạy trên trình duyệt, dùng **đúng công nghệ + template gốc ADMIN đang dùng** — clone lại template Ant Design Pro gốc (không copy nguyên `ADMIN/`), rồi dựng lại giao diện kiểu mobile trên nền công nghệ đó.

**Vì sao tách dự án riêng, không mở rộng ADMIN?**

| Khía cạnh | ADMIN | WEB (mới) |
|---|---|---|
| Đối tượng | ADMIN/TEACHER/EMPLOYEE (nhân viên vận hành) | STUDENT/PARENT/TEACHER (người học/phụ huynh, GV ở vai trò khác) |
| Layout | `ProLayout` kiểu `side` (sider), desktop rộng, menu nhiều cấp | `ProLayout` kiểu `top` (menu ngang, tự thu gọn thành hamburger trên màn hẹp — tính năng có sẵn của `ProLayout`, không tự viết) |
| Component danh sách | `ProTable` (bảng dữ liệu nhiều cột) | `ProList`/`ProTable` tuỳ ngữ cảnh — vẫn dùng ProComponents có sẵn, chỉ chọn loại phù hợp dữ liệu (danh sách đơn giản dùng `ProList`, bảng nhiều cột như báo cáo cả lớp dùng `ProTable`) |
| Quyền | Permission-based (`RESOURCE:ACTION`) chi tiết | Role-based đơn giản (STUDENT/PARENT/TEACHER) |
| Rủi ro khi đổi | Đang chạy sản xuất, nhiều nghiệp vụ quản trị | Dự án mới, không đụng ADMIN |

> **Lưu ý quan trọng (14/08/2026)**: bản kế hoạch trước đây định tự viết layout kiểu app di động (bottom-tab, khung điện thoại 480px cố định) — đã **bỏ hướng đó**. WEB vẫn là ứng dụng web đúng nghĩa, dùng lại tối đa `ProLayout`/`ProTable`/`ProList`/`ProForm` có sẵn trong template thay vì tự dựng lại từ đầu. Nội dung co giãn tự nhiên theo màn hình (điện thoại lẫn desktop) qua responsive breakpoint chuẩn của antd, không ép khung cố định.

**Phạm vi kế hoạch này**: liệt kê **toàn bộ module** của `MOBILE/lib/` (trừ `core/`, `counter/`, `app/`, `l10n/` là hạ tầng/demo) và ánh xạ 1-1 sang trang Web, kèm kiểu dữ liệu TypeScript khớp DTO thật của BE cho từng endpoint sẽ gọi. **Cập nhật 16/08/2026**: review lại phát hiện thiếu module `messages/` (Tin nhắn) — đã bổ sung §4.12/§5.7b, danh sách module nay đầy đủ: auth, home, schedule (timetable+leave+teacherWork+attendance), catalog, courses, exams, reports, fee (gộp payment — xem §12 #4), coin, posts, notifications, messages, account = 13 module nghiệp vụ.

**Ngoài phạm vi** (không làm, ít nhất đợt đầu — xem lý do ở §12):
- Push notification thật (Web Push + Service Worker).
- Điểm danh học viên (xem §5.2 — quyết định 14/08/2026, học viên vẫn điểm danh qua Mobile/Admin như hiện tại).
- App-store/Play-store, offline-first.

---

## 1. Quyết định kiến trúc

| # | Quyết định | Lý do |
|---|---|---|
| 1 | **Clone template gốc Ant Design Pro** bằng `create-umi` (bản khớp `ADMIN/package.json`: `"version": "6.0.2"`, repo `ant-design/ant-design-pro`), **không** copy thư mục `ADMIN/` | Lấy template sạch, không dính code nghiệp vụ Admin (`pages/user`, `pages/class`...) |
| 2 | **Dự án UmiJS Max độc lập**, không phải route con trong ADMIN | Auth/theme/layout khác hẳn; deploy độc lập; không rủi ro cho ADMIN đang chạy |
| 3 | **antd v6 + `@ant-design/pro-components` như ADMIN**, KHÔNG antd-mobile, KHÔNG tự dựng lại UI mobile | Đúng yêu cầu "công nghệ giống Admin, tận dụng đồ có sẵn của template" (14/08/2026) — thiết kế UI/UX phù hợp WEB, không bê nguyên thiết kế app di động sang |
| 4 | **Dùng `ProLayout` có sẵn** (runtime `layout` config trong `app.tsx`, gần như copy nguyên từ ADMIN) — **SỬA 17/08/2026 (yêu cầu người dùng, bản `'top'` bị chê xấu)**: đổi lại `layout: 'mix'` (menu bên trái + thanh ngang trên cùng, đúng layout gốc Ant Design Pro/ADMIN) thay vì `'top'` như quyết định ban đầu — **KHÔNG** tự viết `AppShell`/`BottomTabBar` | `ProLayout` đã tự responsive dù dùng `'mix'` hay `'top'`: sider trên desktop tự sập thành Drawer trên màn hẹp — vẫn đúng nhu cầu "vừa dùng được desktop vừa dùng được điện thoại" mà không phải tự xây gì thêm; `'mix'` chỉ khác về mặt thẩm mỹ (menu dọc quen thuộc hơn) |
| 5 | **BE dùng chung 100%, không sửa BE** (trừ khả năng thêm CORS origin nếu khác domain — xem §12 #5) | Toàn bộ API đã phục vụ ADMIN + MOBILE cùng lúc, WEB là client thứ 3 |
| 6 | **Auth**: copy nguyên `services/auth.ts` của ADMIN | Đã xác minh khớp 100% với `MOBILE/lib/auth/data/auth_repository.dart` — cùng `/api/v1/auth/login\|me\|logout`, cùng field `roles[]`/`permissions[]` |
| 7 | **Đối tượng dùng WEB** = STUDENT, PARENT, TEACHER | ADMIN/EMPLOYEE tiếp tục dùng ADMIN desktop |
| 8 | **Responsive chuẩn web** — dùng breakpoint/Grid có sẵn của antd (`Row`/`Col`, `Descriptions`/`Card` tự xuống dòng), **KHÔNG ép khung điện thoại cố định** (bỏ hẳn ý tưởng "khung 480px nổi giữa" của bản kế hoạch trước) | Trên desktop nội dung được tận dụng không gian rộng hơn (vd báo cáo có thể xếp 2 cột biểu đồ cạnh nhau); trên điện thoại tự co lại 1 cột — đúng tinh thần "thiết kế phù hợp Web", không phải giả lập app di động trong trình duyệt |
| 9 | **Tái dùng chart component từ `ADMIN/src/pages/report/components/`** thay vì viết lại bằng `@ant-design/plots` từ đầu | ADMIN đã có sẵn, tiêu thụ đúng endpoint báo cáo mà Mobile cũng gọi — copy file là tái dùng thật |
| 10 | **State/data**: `request` của `@umijs/max`, state cục bộ (`useState`/`useModel`) — không Redux/Zustand | Đúng độ phức tạp hiện tại, tránh over-engineer |
| 11 | **QR chỉ còn 1 chỗ dùng: chấm công GV** (quét QR phòng) — `qr-scanner` hoặc `html5-qrcode` (npm) | Điểm danh HV đã bỏ khỏi Web (§5.2) — không còn 2 luồng QR như bản kế hoạch trước |
| 12 | **DÙNG `ProTable`/`ProList` có sẵn của template** thay vì tự viết component danh sách — `ProList` cho danh sách dạng thẻ (TKB, đơn nghỉ, khóa học, bài viết), `ProTable` cho dữ liệu nhiều cột (báo cáo cả lớp của GV, lịch sử giao dịch xu) | Cả 2 đều tự có loading/empty/error/phân trang sẵn (đúng vai trò `AsyncListView<T>` của Mobile nhưng KHÔNG cần tự viết lại) — đảo ngược hoàn toàn quyết định #12 của bản kế hoạch trước |
| 13 | **1 locale duy nhất (`vi-VN`)**, bỏ scaffold 8 locale của ADMIN | MOBILE không đổi ngôn ngữ; ADMIN thực tế cũng hard-code tiếng Việt ở mọi locale |
| 14 | **Tên gói**: thư mục `WEB/`, `package.json.name = "deca-web"` | Nhất quán `deca_mobile` |
| 15 | **Quy ước gọi API tập trung**: 1 file `src/services/<module>.ts` = 1-1 với 1 nhóm controller BE, mọi hàm trả về đúng kiểu TS định nghĩa ở §4 | Tránh gọi `request()` rải rác trong component — dễ audit khi BE đổi field |
| 16 | **Xử lý lỗi tập trung qua `requestErrorConfig.ts`** (copy khung từ ADMIN, chỉnh style thông báo lỗi thành `message.error()` toast thay vì `notification` — phù hợp màn hẹp) | Nhất quán cách hiện lỗi trên toàn app, không tự bắt try/catch lặp lại mỗi trang |
| 17 | **Test**: giữ `vitest` (ADMIN đã cấu hình sẵn `test`/`test:coverage`/`test:watch`) — viết test cho `access.ts`, `services/*.ts` (mock `request`), và 1 số component logic phức tạp (đếm giờ làm bài, QR parser) | ADMIN đã có bộ khung test chạy được ngay — tận dụng, không cần chọn framework mới |
| 18 | **CI tối thiểu**: `biome check` + `tsc --noEmit` + `vitest run` chạy trên mỗi PR (copy pattern Husky/lint-staged của ADMIN cho pre-commit local) | Giữ chất lượng code nhất quán với 2 dự án FE hiện có |

---

## 2. Clone template gốc + đồng bộ dependency

### 2.1 Lệnh scaffold

```bash
cd "D:/duantrungtam/Code Version 2"
npx create-umi@latest WEB
# Chọn khi được hỏi:
#   Type: "Ant Design Pro"
#   Package manager: npm (khớp ADMIN — có package-lock.json)
#   Không chọn thêm plugin ngoài mặc định của template
```

### 2.2 `package.json` đề xuất sau khi đồng bộ version với ADMIN

```jsonc
{
  "name": "deca-web",
  "version": "0.1.0",
  "private": true,
  "engines": { "node": ">=22.0.0" },
  "scripts": {
    "dev": "cross-env UMI_ENV=dev MOCK=none max dev",
    "build": "max build",
    "lint": "npm run biome:lint && npm run tsc",
    "biome:lint": "biome lint",
    "biome": "biome check --write",
    "tsc": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "prepare": "npx husky && max setup",
    "preview": "max preview --port 8001"
  },
  "dependencies": {
    "@ant-design/icons": "^6.2.3",
    "@ant-design/plots": "^2.6.8",
    "antd": "^6.4.3",
    "dayjs": "^1.11.20",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "qr-scanner": "^1.4.2"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.5.0",
    "@commitlint/cli": "^21.0.0",
    "@commitlint/config-conventional": "^21.0.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^25.9.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@umijs/lint": "^4.6.51",
    "@umijs/max": "^4.6.57",
    "cross-env": "^10.1.0",
    "husky": "^9.1.7",
    "jsdom": "^29.1.1",
    "lint-staged": "^17.0.2",
    "typescript": "^6.0.3",
    "vitest": "4.1.8"
  }
}
```

> `qr-scanner` (đọc QR qua `getUserMedia`, nhẹ, không phụ thuộc WASM ngoài) — dùng cho `QrScanner` (chấm công GV). Vẽ QR thanh toán ở `/fee` thì **dùng thẳng antd `QRCode` built-in** (không thêm gói mới) — chỉ cân nhắc thêm `qrcode.react` sau này nếu antd `QRCode` không đủ tuỳ biến (vd cần logo giữa mã).

### 2.3 Bảng đối chiếu quyết định giữ/bỏ so với `ADMIN/package.json`

| Gói ở ADMIN | Giữ ở WEB? | Lý do |
|---|---|---|
| `@ant-design/pro-components` | **Giữ, chỉ dùng `ProForm`/`DrawerForm`** | Form tạo đơn nghỉ phức tạp (validate ngày, chọn buổi) — `ProForm` tiết kiệm code hơn tự viết. KHÔNG dùng `ProTable`/`ProLayout` |
| `@ant-design/x*`, `@ant-design/x-markdown`, `@ant-design/x-sdk` | Bỏ | Chatbot AI — không có tính năng tương ứng ở Mobile |
| `@tanstack/react-query` | Bỏ (đợt đầu) | `request()` + state cục bộ đủ dùng; cân nhắc thêm lại nếu sau này cần cache phức tạp (xem §12 mở) |
| `d3`, `topojson-client`, `geojson` | Bỏ | Dùng cho bản đồ — không có ở Mobile |
| `highlight.js` | Bỏ | Hiển thị code — không cần |
| `tailwindcss`, `@tailwindcss/postcss` | Bỏ | Chỉ dùng CSS module/`antd-style` như ADMIN, không cần thêm Tailwind cho scope nhỏ này |
| `antd-style` | Giữ | Tiện viết style theo theme token antd v6, ADMIN đã dùng quen |
| `express`, `gh-pages`, `swagger-ui-dist` | Bỏ | Công cụ dev-server/deploy riêng của ADMIN, không cần |

---

## 3. Cấu trúc dự án — cây file đầy đủ

```
WEB/
├── config/
│   ├── config.ts
│   ├── routes.ts
│   ├── proxy.ts
│   └── defaultSettings.ts
├── src/
│   ├── app.tsx
│   ├── access.ts
│   ├── access.test.ts
│   ├── global.less
│   ├── typings.d.ts
│   ├── requestErrorConfig.ts
│   ├── components/                    # CHỈ những gì template CHƯA có sẵn — xem §7
│   │   ├── StatusChip/
│   │   │   └── index.tsx           # màu theo trạng thái, dùng chung 1 bảng màu (xem §7)
│   │   ├── QrScanner/
│   │   │   ├── index.tsx           # bọc qr-scanner, có fallback "Nhập mã thủ công"
│   │   │   └── index.test.tsx
│   │   ├── ScoreCard/
│   │   │   └── index.tsx           # thẻ điểm dùng lại nhiều nơi (báo cáo, khóa học) — dựng trên ProCard/Statistic có sẵn
│   │   └── CountdownTimer/
│   │       └── index.tsx           # đếm ngược làm bài thi (xem §7, §12 #2)
│   ├── services/
│   │   ├── auth.ts                  # copy nguyên từ ADMIN
│   │   ├── timetable.ts
│   │   ├── session.ts
│   │   ├── leave.ts
│   │   ├── classOutline.ts
│   │   ├── report.ts
│   │   ├── exam.ts
│   │   ├── invoice.ts
│   │   ├── coin.ts
│   │   ├── post.ts
│   │   ├── notification.ts
│   │   └── message.ts               # MỚI (16/08/2026) — module Tin nhắn, xem §4.12/§5.9
│   ├── typings/                     # export toàn bộ interface TS ở §4, 1 file/module
│   │   ├── auth.d.ts
│   │   ├── timetable.d.ts
│   │   ├── session.d.ts
│   │   ├── leave.d.ts
│   │   ├── classOutline.d.ts
│   │   ├── report.d.ts
│   │   ├── exam.d.ts
│   │   ├── invoice.d.ts
│   │   ├── coin.d.ts
│   │   ├── post.d.ts
│   │   ├── notification.d.ts
│   │   └── message.d.ts             # MỚI (16/08/2026)
│   └── pages/
│       ├── login/
│       │   └── index.tsx
│       ├── home/
│       │   └── index.tsx
│       ├── timetable/
│       │   ├── index.tsx                    # /timetable — danh sách theo ngày
│       │   └── session/
│       │       └── index.tsx                # /timetable/session/:id
│       ├── leave/
│       │   ├── index.tsx                    # /leave — danh sách
│       │   ├── new.tsx                       # /leave/new — form tạo đơn (ProForm)
│       │   └── components/
│       │       └── LeaveCard.tsx
│       ├── teacherWork/
│       │   └── index.tsx                    # /teacher-work
│       ├── catalog/
│       │   └── index.tsx                    # /catalog
│       ├── courses/
│       │   ├── index.tsx                    # /courses
│       │   └── [classId]/
│       │       └── index.tsx                # /courses/:classId
│       ├── exams/
│       │   └── [examId]/
│       │       └── index.tsx                # /exams/:examId — làm bài
│       ├── reports/
│       │   ├── index.tsx                    # /reports — chọn con (PARENT) / thẳng vào (STUDENT)
│       │   ├── [studentId]/
│       │   │   └── classes/
│       │   │       └── [classId]/
│       │   │           ├── index.tsx         # cấp khóa
│       │   │           ├── topics/[topicId]/index.tsx
│       │   │           ├── sessions/[sessionId]/index.tsx
│       │   │           └── exams/[examId]/index.tsx
│       │   └── classes/[classId]/index.tsx   # GV xem cả lớp
│       ├── fee/
│       │   └── index.tsx                    # /fee
│       ├── coin/
│       │   └── index.tsx                    # /coin
│       ├── posts/
│       │   ├── index.tsx                    # /posts
│       │   └── [id]/index.tsx                # /posts/:id
│       ├── notifications/
│       │   └── index.tsx                    # /notifications — không có `name` ở route, vào qua icon header
│       ├── messages/                        # MỚI (16/08/2026)
│       │   ├── index.tsx                    # /messages — không có `name` ở route, vào qua icon header
│       │   └── [id]/index.tsx                # /messages/:id
│       └── account/
│           └── index.tsx                    # /account
├── biome.json                          # copy từ ADMIN
├── commitlint.config.ts                # copy từ ADMIN
├── .husky/                             # copy từ ADMIN
├── .lintstagedrc                       # copy từ ADMIN
├── tsconfig.json
└── package.json
```

**Quy ước `services/<module>.ts`**: mỗi hàm export 1-1 với 1 endpoint BE, tên hàm = `verbNoun` (`fetchTimetable`, `createLeave`, `approveLeave`, `confirmLeaveByParent`...), luôn khai báo kiểu trả về từ `typings/<module>.d.ts`, không dùng `any`.

---

## 4. Phụ lục kiểu dữ liệu TypeScript — khớp 100% DTO thật của BE

> Toàn bộ interface dưới đây được đọc trực tiếp từ source Java (`record`/`class`) của BE, KHÔNG suy đoán. Field optional (nullable ở Java) đánh dấu `?`. Enum Java → union string literal.

### 4.0 Bao bọc response chung

```ts
// src/typings/common.d.ts
export interface ApiError {
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
  timestamp?: string; // Instant ISO
}

// Dùng cho GET /posts, /notifications/me, /leaves, /coins/.../transactions
// (response PHẲNG, KHÔNG bọc trong ApiResponse — chú ý khác biệt này khi viết service.ts)
export interface FlatPageResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  error?: ApiError;
  timestamp?: string;
}
```

### 4.1 Auth (copy nguyên từ ADMIN `services/auth.ts`, không đổi)

```ts
export interface BackendUser {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  fullName?: string;
  status: string;
  roles: string[];
  permissions: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: BackendUser;
}
```

### 4.2 Timetable (`GET /api/v1/timetable`)

```ts
// src/typings/timetable.d.ts
export interface TimetableQuery {
  view: 'STUDENT' | 'TEACHER' | 'ROOM' | 'PARENT';
  refId?: number;
  from: string;  // YYYY-MM-DD
  to: string;
  branchId?: number;
}

export type SessionStatus = 'PLANNED' | 'DONE' | 'CANCELLED';

export interface TimetableItem {
  sessionId: number;
  classId: number;
  className: string;
  subjectName: string;
  gradeLevel?: string;
  date: string;          // YYYY-MM-DD
  startTime: string;      // HH:mm:ss
  endTime: string;
  roomId?: number;
  roomName?: string;
  branchName?: string;
  teacherId?: number;
  teacherName?: string;
  status: SessionStatus;
  studentId?: number;       // chỉ có ở view STUDENT/PARENT
  studentName?: string;
  attendanceStatus?: string;
  onLeave: boolean;
  teacherAttendanceStatus?: 'DUNG_GIO' | 'VAO_TRE' | 'VANG'; // chỉ view TEACHER
}
```

### 4.3 Session detail — SỬA 16/08/2026: KHÔNG có `GET /sessions/{id}` riêng lẻ

> Xác minh trực tiếp `ScheduleController`/`ExamController` (BE) lúc code Đợt 1: không tồn tại endpoint chi tiết 1 buổi. Trang `/timetable/session/:id` lấy thông tin cơ bản (ngày/giờ/phòng/GV/lớp) từ chính `TimetableItem` đã có sẵn ở danh sách `/timetable` — truyền qua router state khi điều hướng (`history.push(path, item)`), fallback gọi lại `/timetable` lọc theo `sessionId` nếu vào thẳng URL (không qua danh sách). Chỉ 3 endpoint sau là gọi riêng cho trang này:
> - `GET /api/v1/sessions/{id}/videos` → `SessionVideoItem[]`
> - `GET /api/v1/sessions/{id}/zoom-links` → `ZoomLinkItem[]`
> - `GET /api/v1/exams/by-session/{sessionId}` → `SessionExamItem[]` (không phải `RecentExamItem[]` như suy đoán trước — có thêm `type`, `studentStatus`, `score`)

```ts
// src/typings/session.d.ts
export interface SessionExamItem {
  examId: number;
  code: string;
  name: string;
  type: string;
  status: string;
  publishAt?: string;
  endAt?: string;
  durationMinutes?: number;
  studentStatus?: string;
  score?: number;
}
```

```ts
// src/typings/session.d.ts
export interface SessionDetail {
  id: number;
  classId: number;
  className: string;
  sessionDate: string;  // YYYY-MM-DD
  startTime: string;
  endTime: string;
  roomId?: number;
  roomName?: string;
  teacherId?: number;
  teacherName?: string;
  status: 'PLANNED' | 'DONE' | 'CANCELLED';
  cancelReason?: string;
  isManual: boolean;
  topicId?: number;
  topicName?: string;
  title?: string;
}

export interface SessionVideoItem {
  videoId: number;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  sortOrder: number;
}

export interface ZoomLinkItem {
  id: number;
  label?: string;
  zoomUrl: string;
  meetingId?: string;
  passcode?: string;
  sortOrder: number;
}
```
> **Không có** trường/endpoint check-in/checkout trong danh sách này ở Web — đã bỏ theo §5.2.

### 4.4 Leave (`/api/v1/leaves`)

```ts
// src/typings/leave.d.ts
export type LeaveScope = 'SESSION' | 'RANGE';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveItem {
  id: number;
  studentId: number;
  studentName: string;
  scope: LeaveScope;
  sessionId?: number;
  sessionDate?: string;
  classId?: number;
  className?: string;
  dateFrom?: string;
  dateTo?: string;
  reason?: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  parentConfirmedBy?: string;   // xem docs/SPEC_LichHoc_FE_Leave.md As-built 14/08/2026
  parentConfirmedAt?: string;
  createdAt: string;
}

export interface CreateLeaveRequest {
  studentId: number;
  scope: LeaveScope;
  sessionId?: number;   // bắt buộc nếu scope=SESSION
  classId?: number;      // null = tất cả lớp, chỉ áp dụng scope=RANGE
  dateFrom?: string;      // bắt buộc nếu scope=RANGE
  dateTo?: string;
  reason?: string;
}

// GET /api/v1/leaves → LeavePageResponse (PHẲNG, không bọc ApiResponse)
export type LeavePageResponse = FlatPageResponse<LeaveItem>;
```

### 4.5 Class outline / Khóa học (`GET /api/v1/classes/{id}/outline`)

```ts
// src/typings/classOutline.d.ts
export interface OutlineProgress {
  totalSessions: number;
  doneSessions: number;
  attendanceRate?: number;
  attendanceScope?: 'STUDENT' | 'CLASS';
}

export interface OutlineExam {
  examId: number;
  code?: string;
  name: string;
  type?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  publishAt?: string;
  endAt?: string;
  durationMinutes?: number;
  studentStatus?: string;
  score?: number;
  maxScore?: number;
}

export interface OutlineSession {
  sessionId: number;
  ordinal?: number;
  title?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  roomName?: string;
  teacherName?: string;
  status: string;
  cancelReason?: string;
  attendanceStatus?: string;   // CHỈ HIỂN THỊ (đọc), Web không có hành động điểm danh
  onLeave: boolean;
  materialCount: number;
  exams: OutlineExam[];
}

export interface OutlineTopicGroup {
  topicId?: number;    // null = "Chưa phân chuyên đề", luôn xếp cuối
  topicName?: string;
  sortOrder?: number;
  sessions: OutlineSession[];
  exams: OutlineExam[];
}

export interface ClassOutlineResponse {
  classId: number;
  code?: string;
  name: string;
  subjectName?: string;
  gradeLevel?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  progress: OutlineProgress;
  groups: OutlineTopicGroup[];
}

export interface ClassOutlineQuery {
  studentId?: number;   // bắt buộc nếu PARENT
  onlyDone?: boolean;    // true = chỉ đợt Báo cáo dùng (xem docs/SPEC_KhoaHoc_NoiDung_Mobile.md As-built #9)
}
```

### 4.6 Reports (`/api/v1/reports/**`) — phần dài nhất, 15+ kiểu

```ts
// src/typings/report.d.ts
export interface AttendanceMonthPoint {
  month: string;   // YYYY-MM
  coMat: number;
  tre: number;
  vang: number;
  coPhep: number;
}

export interface AttendanceSummary {
  totalSessions: number;
  coMat: number;
  tre: number;
  vang: number;
  coPhep: number;
  chuaCheckin: number;
  attendanceRate?: number;
  onTimeRate?: number;
}

export interface StudentAttendanceReport {
  summary: AttendanceSummary;
  byMonth: AttendanceMonthPoint[];
}

export interface ClassAttendanceReport {
  summary: AttendanceSummary;
  byMonth: AttendanceMonthPoint[];
}

export interface BucketStat {
  key: string;   // EASY|MEDIUM|HARD hoặc MULTIPLE_CHOICE|ESSAY|TRUE_FALSE
  correctCount: number;
  incorrectCount: number;
  ungradedCount: number;
  correctPct?: number;
}

export interface BreakdownResponse {
  byDifficulty: BucketStat[];
  byType: BucketStat[];
}

export interface RecentExamItem {
  examStudentId: number;
  examId: number;
  examCode: string;
  examName: string;
  subjectName?: string;
  classId?: number;
  className?: string;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
}

export interface ScoreTrendPoint {
  examId: number;
  examName: string;
  publishAt?: string;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
  classAverage?: number;
}

export interface ScoreBand {
  index: number;
  fromScore: number;
  toScore: number;
  count: number;
  containsStudent: boolean;
}

export interface ExamScoreDistribution {
  examId?: number;
  examName?: string;
  maxScore?: number;
  bandCount: number;
  bands: ScoreBand[];
  studentScore?: number;
  studentBandIndex?: number;
  percentile?: number;
  classAverage?: number;
  median?: number;
  highest?: number;
  lowest?: number;
  rank?: number;
  submittedCount?: number;
  classSize?: number;
}

export interface ExamReportDetail {
  examId: number;
  examName: string;
  examCode: string;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
  classAverage?: number;
  rank?: number;
  submittedCount?: number;
  classSize?: number;
  topicId?: number;
  topicName?: string;
  sessionId?: number;
  sessionTitle?: string;
  sessionDate?: string;
  breakdown: BreakdownResponse;
  distribution: ExamScoreDistribution;
  // GHI CHÚ: KHÔNG hiện ScoreDistributionChart ở /reports/.../exams/:examId —
  // đã bỏ theo docs/SPEC_BaoCao.md As-built #4 (13/08/2026), dù field vẫn còn ở BE.
}

export interface TopicMasteryItem {
  topicId: number;
  topicName: string;
  gradedCount: number;
  correctCount: number;
  ungradedCount: number;
  earned: number;
  max: number;
  masteryPct?: number;
}

export interface ChapterAnalysisResponse {
  chapterLabel: string;
  avgScore?: number;
  rank?: number;
  classSize?: number;
  abilityInsights: string[];
  attendanceInsight?: string;
}

export interface SessionAnalysisResponse {
  avgScore?: number;
  classAverage?: number;
  comparisonInsight?: string;
  abilityInsights: string[];
  examCount: number;
  submittedCount: number;
}

export interface ExamAnalysisResponse {
  score?: number;
  classAverage?: number;
  rank?: number;
  classSize?: number;
  comparisonInsight?: string;
  abilityInsights: string[];
}

export interface ChapterAnalysisItem {
  topicId?: number;
  chapterLabel: string;
  avgScore?: number;
  rank?: number;
  classSize?: number;
}

export interface ReportAnalysisResponse {
  studentName: string;
  className: string;
  scoreSpectrumLabel?: string;
  courseAverage?: number;
  courseRank?: number;
  classSize?: number;
  chapters: ChapterAnalysisItem[];
  abilityInsights: string[];
  attendanceInsight?: string;
  teacherCommentAuthor?: string;
  teacherCommentContent?: string;
}

export interface StudentClassOption {
  classId: number;
  code?: string;
  name: string;
  subjectName?: string;
  teacherNames?: string;
}

export interface ChildOption {
  studentId: number;
  fullName: string;
  username: string;
}

export interface ClassExamAverageItem {
  examId: number;
  examName: string;
  publishAt?: string;
  avgScore?: number;
  maxScore?: number;
  submittedCount: number;
  assignedCount: number;
}

export interface ClassStudentAverageItem {
  studentId: number;
  fullName: string;
  username: string;
  submittedCount: number;
  avgScore?: number;
  avgPct?: number;
  attendanceRate?: number;
}

export interface CommentItem {
  id: number;
  studentId: number;
  classId: number;
  examStudentId?: number;
  authorId: number;
  authorName: string;
  authorRole: string;
  content: string;
  visibleToStudent: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DifficultyCount { easy: number; medium: number; hard: number }
export interface TypeCount { multipleChoice: number; trueFalse: number }

export interface PracticeAssignmentResponse {
  assignmentId: number;
  examId: number;
  examCode: string;
  examName: string;
  classId: number;
  className: string;
  topicId?: number;
  topicName?: string;
  numQuestions: number;
  durationMinutes?: number;
  byDifficulty: DifficultyCount;
  byType: TypeCount;
  deadline?: string;
  status: string;
}
```

**Bảng endpoint Báo cáo → kiểu trả về** (đọc từ `StudentReportController`/`ClassReportController`/`ReportCommentController`, base `/api/v1/reports`):

| Endpoint | Kiểu trả về |
|---|---|
| `GET /students/{id}/recent-exams?limit=` | `RecentExamItem[]` |
| `GET /students/{id}/exam-history?classId=` | `RecentExamItem[]` |
| `GET /students/{id}/exams/{examId}?classId=` | `ExamReportDetail` |
| `GET /students/{id}/classes/{cid}/score-trend?topicId=` | `ScoreTrendPoint[]` |
| `GET /students/{id}/classes/{cid}/breakdowns?topicId=` | `BreakdownResponse` |
| `GET /students/{id}/exams/{eid}/score-distribution?classId=&bandCount=` | `ExamScoreDistribution` |
| `GET /students/{id}/classes/{cid}/score-distribution?bandCount=` | `ExamScoreDistribution` (phổ điểm toàn khóa) |
| `GET /students/{id}/classes/{cid}/topics/{tid}/analysis` | `ChapterAnalysisResponse` |
| `GET /students/{id}/classes/{cid}/sessions/{sid}/analysis` | `SessionAnalysisResponse` |
| `GET /students/{id}/exams/{eid}/analysis?classId=` | `ExamAnalysisResponse` |
| `GET /students/{id}/classes/{cid}/topic-mastery` | `TopicMasteryItem[]` |
| `GET /students/{id}/classes/{cid}/attendance?topicId=` | `StudentAttendanceReport` |
| `GET /students/{id}/classes/{cid}/sessions/{sid}/exams` | `RecentExamItem[]` |
| `GET /students/{id}/classes/{cid}/sessions/{sid}/breakdowns` | `BreakdownResponse` |
| `GET /students/{id}/classes/{cid}/analysis` | `ReportAnalysisResponse` |
| `GET /students/{id}/classes` | `StudentClassOption[]` |
| `GET /my-children` | `ChildOption[]` |
| `POST /students/{id}/classes/{cid}/assign-practice` | `PracticeAssignmentResponse` |
| `GET /students/{id}/classes/{cid}/practice-assignments` | `PracticeAssignmentResponse[]` |
| `GET /students/{id}/practice-assignments` | `PracticeAssignmentResponse[]` (mọi lớp) |
| `GET /classes/{cid}/exam-averages?topicId=` | `ClassExamAverageItem[]` (GV) |
| `GET /classes/{cid}/attendance?topicId=` | `ClassAttendanceReport` (GV) |
| `GET /classes/{cid}/students` | `ClassStudentAverageItem[]` (GV) |
| `GET /comments?studentId=&classId=&examStudentId=` | `CommentItem[]` |

### 4.7 Đề thi (`/api/v1/exams`)

```ts
// src/typings/exam.d.ts
export interface PaperOption {
  id: number;
  order: number;
  text: string;
  image?: string;
  isCorrect?: boolean;   // chỉ có sau khi đã nộp (DA_LAM/QUA_HAN)
}

export interface PaperTfItem {
  id: number;
  order: number;
  text: string;
  image?: string;
  answer?: boolean;      // chỉ có sau khi đã nộp
}

export interface PaperQuestion {
  examExerciseId: number;
  exerciseId: number;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY';
  points: number;
  questionText: string;
  questionImage?: string;
  options?: PaperOption[];
  trueFalseItems?: PaperTfItem[];
  essayAnswer?: string;
  essayAnswerImage?: string;
}

// Map<Long, Long> / Map<Long, Map<Long, Boolean>> / Map<Long, String> ở Java
// → dùng Record<string, T> ở TS (key JSON luôn là string dù Java là Long)
export interface SubmitExamRequest {
  mc: Record<string, number>;                     // examExerciseId -> selected optionId
  tf: Record<string, Record<string, boolean>>;      // examExerciseId -> (tfItemId -> answer)
  essay: Record<string, string>;                     // examExerciseId -> nội dung tự luận
}

export interface ExamPaperResponse {
  examId: number;
  code: string;
  name: string;
  durationMinutes?: number;
  deadline?: string;         // Instant — DÙNG LÀM MỐC đếm ngược, KHÔNG dùng đồng hồ client (xem §12 #2)
  status: string;
  questions: PaperQuestion[];
  submitted?: SubmitExamRequest;   // bài đã lưu nháp/đã nộp trước đó (điền lại form)
  score?: number;
  result?: ExamGradeResponse;
}

export interface QuestionGrade {
  examExerciseId: number;
  earned: number;
  max: number;
  correct?: boolean;   // null = tự luận chưa chấm
}

export interface ExamGradeResponse {
  earned: number;
  total: number;
  autoCorrect: number;
  autoTotal: number;
  hasEssay: boolean;
  byQuestion: QuestionGrade[];
}
```

### 4.8 Học phí / Thanh toán (`/api/v1/invoices`)

```ts
// src/typings/invoice.d.ts
export type InvoiceStatus = 'DRAFT' | 'CONFIRMED' | 'PAID' | 'CANCELLED'; // xác nhận lại đúng tên enum khi code

export interface MyInvoiceItem {
  id: number;
  studentId: number;
  classId: number;
  className: string;
  periodFrom: string;
  periodTo: string;
  sessionCount: number;
  amount: number;
  status: InvoiceStatus;
  paidAt?: string;
}

export interface InvoiceQrResponse {
  qrPayload: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  paymentCode: string;
}

export interface InvoiceItemLine {
  sessionId: number;
  sessionDate: string;
  price: number;
}

export interface InvoiceResponse {
  id: number;
  studentId: number;
  studentName: string;
  username: string;
  classId: number;
  className: string;
  periodFrom: string;
  periodTo: string;
  sessionCount: number;
  grossAmount: number;
  discountPercent?: number;
  amount: number;
  paymentCode: string;
  status: InvoiceStatus;
  confirmedAt?: string;
  paidAt?: string;
  note?: string;
  createdAt: string;
  items: InvoiceItemLine[];
}
```

### 4.9 Xu (`/api/v1/coins`)

```ts
// src/typings/coin.d.ts
export interface CoinBalanceResponse {
  userId: number;
  fullName: string;
  username: string;
  balance: number;
}

export interface CoinTransactionItem {
  id: number;
  amount: number;
  balanceAfter: number;
  reason?: string;
  createdBy?: string;
  createdAt: string;
}

export type CoinTransactionPageResponse = FlatPageResponse<CoinTransactionItem>;
```

### 4.10 Bài viết (`/api/v1/posts`)

```ts
// src/typings/post.d.ts
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // xác nhận lại tên enum khi code

export interface PostItem {
  id: number;
  title: string;
  summary?: string;
  coverImageUrl?: string;
  status: PostStatus;
  pinned: boolean;
  publishedAt?: string;
  createdAt: string;
  author?: string;
}

export interface PostDetail extends PostItem {
  contentMd: string;
}

export type PostPageResponse = FlatPageResponse<PostItem>;
```

### 4.11 Thông báo (`/api/v1/notifications`)

```ts
// src/typings/notification.d.ts
export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  payload?: string;   // JSON string — parse tuỳ theo `type`
  status: string;
  read: boolean;
  messageId?: number;
  sentAt?: string;
  createdAt: string;
}

export type NotificationPageResponse = FlatPageResponse<NotificationItem>;
```

### 4.12 Tin nhắn (`/api/v1/messages`) — MỚI (16/08/2026, đọc từ `MOBILE/lib/messages/data/`)

> Phát hiện khi review lại kế hoạch: module thật, có repository gọi API thật (`MessagesRepositoryImpl`), gắn icon "Tin nhắn" trên AppBar mọi màn hình cùng badge số chưa đọc — **thiếu hoàn toàn khỏi các bản kế hoạch trước, bổ sung ở đây.**

```ts
// src/typings/message.d.ts
export type NotifType =
  | 'MISSING_CHECKIN' | 'MISSING_CHECKOUT' | 'CHECKIN_OK' | 'CHECKOUT_OK'
  | 'LEAVE_SUBMITTED' | 'LEAVE_RESULT' | 'SCHEDULE_CHANGED' | 'SESSION_REMINDER';
  // xác nhận lại đủ giá trị khi đọc NotifType phía BE lúc code — Mobile chỉ map các giá trị nó dùng

export interface MessageItem {
  id: number;
  type: NotifType;
  title: string;
  preview: string;
  read: boolean;
  createdAt?: string;
}

export interface MessageDetail {
  id: number;
  type: NotifType;
  title: string;
  content: string;
  payload?: string;
  createdAt?: string;
}
```

| Endpoint | Kiểu trả về |
|---|---|
| `GET /api/v1/messages/me?current=&pageSize=&type=&unread=` | `MessageItem[]` (xác nhận lại lúc code: phẳng hay bọc `ApiResponse` — Mobile đọc thẳng `List`, khả năng cao là phẳng như `notifications`) |
| `GET /api/v1/messages/{id}` | `MessageDetail` |
| `GET /api/v1/messages/me/unread-count` | `{ count: number }` |
| `PATCH /api/v1/messages/read-all` | — |

---

## 5. Ánh xạ tính năng: Mobile → Web

### 5.1 Xác thực & khung sườn

| Trang | Route | API | Wireframe / ghi chú |
|---|---|---|---|
| Đăng nhập | `/login` | `POST /auth/login` | Form username/password — `<Form>` antd thường đủ, `layout: false` (route cấp cao nhất, đúng cơ chế Umi, không có `ProLayout` bao quanh) |
| Khung ứng dụng | mọi route (trừ `/login`, `/exams/:examId`) | `GET /auth/me` (1 lần lúc `getInitialState`) | `ProLayout` kiểu `top` (menu ngang có sẵn của template, copy runtime config từ `ADMIN/src/app.tsx`) — KHÔNG tự viết AppBar/tab riêng |
| Trang chủ | `/home` | `GET /posts?pageSize=3`, `GET /timetable?view=...&from=today&to=today` | `PageContainer` (ProComponents) + `ProCard` "Buổi học hôm nay" + `ProList` rút gọn cho feed bài viết — dựng hoàn toàn từ component có sẵn |

```
Desktop (menu ngang co sẵn của ProLayout):
┌──────────────────────────────────────────────────┐
│ Logo   Trang chủ  TKB  Khóa học  Báo cáo  Học phí │ ← ProLayout menu (layout: 'top')
│                                        [Nam ▾]     │
├──────────────────────────────────────────────────┤
│  PageContainer "Trang chủ"                         │
│  ┌───────────────┐  ┌───────────────┐              │
│  │ Buổi học      │  │ Bài viết mới   │  ← 2 cột trên desktop (Row/Col)
│  │ hôm nay        │  │ (ProList)      │
│  └───────────────┘  └───────────────┘              │
└──────────────────────────────────────────────────┘

Điện thoại (< 768px — ProLayout tự thu menu ngang thành hamburger, KHÔNG cấu hình gì thêm):
┌─────────────────────────┐
│ ☰  Trang chủ       [Nam]│ ← hamburger mở menu, tự có sẵn
├─────────────────────────┤
│ Buổi học hôm nay          │
│ ┌───────────────────┐    │
│ │ Toán 9 · 18:00-19:30│   │
│ └───────────────────┘    │
│ Bài viết mới (1 cột)       │
└─────────────────────────┘
```

**🎨 Thiết kế lại 17/08/2026 (2 lần, theo phản hồi người dùng)**:
- **Layout tổng thể**: đổi `layout: 'top'` → `layout: 'mix'` trong `config/defaultSettings.ts` (menu ngang bị chê xấu — quay lại menu bên trái/sider quen thuộc như ADMIN/Ant Design Pro gốc, xem §1 #4 đã sửa).
- **Trang chủ**: bản đầu port thẳng layout card ảnh to kiểu Mobile theo ảnh chụp màn hình người dùng gửi — bị chê "đó chỉ là gợi ý nội dung, phải thiết kế web đẹp". Đã dựng lại thành dashboard web đúng nghĩa: `PageContainer` header chào theo giờ trong ngày, hàng `StatisticCard.Group` (Buổi học hôm nay/Thông báo chưa đọc/Tin nhắn chưa đọc, click điều hướng), rồi bố cục 2 cột (`Row`/`Col` 15/9) — trái là "Lịch hôm nay" dạng `Timeline`, phải là "Bảng tin" dạng `List` compact (không phải card ảnh to full-width như Mobile).

### 5.2 Lịch học / Nghỉ phép / Chấm công GV

> **Đã bỏ hoàn toàn điểm danh học viên khỏi Web** (yêu cầu 14/08/2026): không có nút tự check-in/check-out qua QR, không có màn xem danh sách điểm danh buổi học. Điểm danh vẫn ghi nhận như hiện tại qua Mobile (tự quét QR) hoặc Admin (GV/nhân viên đặt tay) — Web chỉ **không thêm luồng ghi nhận thứ 3**. Số liệu chuyên cần (đã điểm danh) vẫn xem được ở Báo cáo §5.4 — đó là XEM dữ liệu có sẵn, không phải hành động điểm danh.

| Trang | Route | API | Wireframe / ghi chú |
|---|---|---|---|
| TKB | `/timetable` | `GET /timetable?view=STUDENT\|PARENT\|TEACHER&refId=&from=&to=` | Danh sách theo ngày, nhóm header là thứ/ngày, mỗi dòng = 1 buổi (giờ, lớp, phòng), tap → session detail |
| Chi tiết buổi | `/timetable/session/:id` | `GET /sessions/{id}`, `GET /sessions/{id}/videos`, `GET /sessions/{id}/zoom-links`, `GET /exams/by-session/{id}` | 3 khối: Video (nếu có) / Zoom (nếu có) / Đề thi buổi (nếu có) — **không có** khối điểm danh |
| Danh sách đơn nghỉ | `/leave` | `GET /leaves?studentId=&status=` | `ProList<LeaveItem>` (component có sẵn của `pro-components`, tự có `request`/loading/empty/phân trang) — mỗi item: `metas.title` = tên HV, `metas.description` = phạm vi, `metas.avatar`/`extra` = `StatusChip`; PARENT + chưa xác nhận → nút "Xác nhận" trong `actions` |
| Tạo đơn nghỉ | `/leave/new` | `POST /leaves` | `ProForm` (`DrawerForm` hoặc trang riêng): chọn HV (nếu PARENT có nhiều con) → phạm vi (buổi/khoảng ngày) → lý do |
| Chấm công GV | `/teacher-work` (access: `isTeacher`) | `POST /sessions/{id}/teacher-checkin\|teacher-checkout` (body `{roomCode}` — QR phòng giải mã ra mã này), `GET /teachers/me/teaching-attendance?from=&to=` | Nút "Quét QR phòng" → `QrScanner` (component tự viết, không có sẵn trong template) → gọi checkin/checkout với `roomCode` đọc từ QR. **Luồng QR DUY NHẤT còn lại trên Web** |

```
/leave — dùng ProList có sẵn của template (không tự viết list component):
┌──────────────────────────────────────────────────┐
│ PageContainer "Đơn xin nghỉ"      [+ Tạo đơn]      │ ← nút trong extra của PageContainer
├──────────────────────────────────────────────────┤
│ ProList item:                                       │
│  Nguyễn Văn A — Buổi 15/08 · Toán 9    [Chờ duyệt]  │
│  PH chưa xác nhận                       [Xác nhận]  │ ← action trong ProList, chỉ PARENT thấy
├──────────────────────────────────────────────────┤
│ ProList item: ...                                   │
└──────────────────────────────────────────────────┘
```

### 5.3 Khóa học

| Trang | Route | API | Ghi chú |
|---|---|---|---|
| Tất cả khóa học | `/catalog` | `GET /classes/me` (danh mục toàn hệ thống) | **Không click vào từng khóa** — chỉ xem (As-built Mobile 11/08/2026) |
| Khóa đã ghi danh | `/courses` (ẩn với PARENT) | `GET /classes/me`, `GET /reports/students/{id}/practice-assignments` | Card ghim "Bài phụ huynh giao" ở đầu danh sách nếu có |
| Đề cương khóa học | `/courses/:classId` | `GET /classes/{id}/outline` (mặc định `onlyDone=false` — hiện TOÀN BỘ buổi kể cả tương lai) | Cây: chuyên đề → buổi → đề thi buổi. Buổi `PLANNED`/`CANCELLED` không bấm được (đúng As-built Mobile) |

### 5.4 Báo cáo

| Trang | Route | API | Ghi chú |
|---|---|---|---|
| Chọn học viên | `/reports` | PARENT: `GET /reports/my-children` (hiện danh sách con để chọn). STUDENT: `GET /reports/my-classes` (nếu có nhiều lớp → hiện danh sách chọn lớp; nếu chỉ 1 lớp → `history.replace()` thẳng tới `/reports/:myStudentId/classes/:onlyClassId`, không dừng lại ở màn chọn) | Trang `/reports` PHẢI biết `studentId` của chính STUDENT đang đăng nhập — lấy từ `initialState.currentUser.userid`, không có sẵn trong response nào khác. **Quyết định 16/08/2026**: menu "Báo cáo" ẩn cho STUDENT (khớp Mobile — xem §6.3), nhưng route + trang vẫn tồn tại, STUDENT vào qua link sâu từ nơi khác (vd thẻ "Bài phụ huynh giao" ở `/courses`, tương đương `assign_practice_button.dart`/`practice_assignments_page.dart` bên Mobile) — cần đối chiếu lại các điểm liên kết này khi làm Đợt 4 |
| Báo cáo cấp khóa | `/reports/:studentId/classes/:classId` | `score-trend`, `breakdowns`, `topic-mastery`, `attendance`, `analysis`, `GET /classes/{id}/outline?onlyDone=true` | Port đúng thiết kế mới nhất (13/08/2026): 1 `SegmentedButton` 3 lựa chọn **Bài thi / Buổi học / Chương học** (đúng thứ tự), sắp theo ngày gần nhất, chỉ hiện mục **đã học**. Tái dùng chart từ `ADMIN/src/pages/report/components/` |
| Báo cáo theo chương | `/reports/:studentId/classes/:classId/topics/:topicId` | `ChapterAnalysisResponse`, breakdown có `topicId` | |
| Báo cáo theo buổi | `/reports/:studentId/classes/:classId/sessions/:sessionId` | `SessionAnalysisResponse`, breakdown có `sessionId` | |
| Chi tiết 1 bài thi | `/reports/:studentId/classes/:classId/exams/:examId` | `ExamReportDetail` | **Không** hiện `ScoreDistributionChart`/"Phổ điểm của lớp" — khớp As-built 13/08/2026 dù field `distribution` vẫn có ở response |
| Báo cáo cả lớp (GV) | `/reports/classes/:classId` (access: `isTeacher`) | `exam-averages`, `attendance`, `students` (cấp lớp) | `ProTable<ClassStudentAverageItem>` — dữ liệu nhiều cột (họ tên, số bài nộp, điểm TB, % chuyên cần), GV thường xem trên desktop nên bảng hợp lý hơn card; `ProTable` tự `scroll:{x}` khi thu hẹp |

### 5.5 Đề thi / Làm bài

| Trang | Route | API | Ghi chú |
|---|---|---|---|
| Làm bài | `/exams/:examId` | `GET /exams/{id}/paper`, `POST /exams/{id}/draft` (auto-save), `POST /exams/{id}/submit` | **Rủi ro kỹ thuật cao nhất** — xem §12 #2. Đếm ngược dùng `deadline` (Instant) từ response, tính lại mỗi lần focus lại tab (`visibilitychange`), không cộng dồn bằng `setInterval` đơn thuần (trôi giờ nếu tab bị throttle) |

### 5.6 Học phí / Xu

| Trang | Route | API | Ghi chú |
|---|---|---|---|
| Học phí | `/fee` | `GET /reports/my-children`, `GET /invoices/my?studentId=` | PARENT: gộp hóa đơn TẤT CẢ con — mỗi con 1 `ProCard` chứa `ProList<MyInvoiceItem>` bên trong (As-built Mobile 11/08/2026) — KHÔNG dropdown chọn con |
| Thanh toán QR | drawer trong `/fee` | `GET /invoices/{id}/qr` | `<QRCode value={qrPayload}>` (antd v6 built-in) + copy số TK/nội dung CK, dùng `Drawer` thường (không cần `placement="bottom"` kiểu mobile — desktop mở cạnh phải như ADMIN vẫn hợp lý, tự thu hẹp trên màn nhỏ) |
| Xu | `/coin` | `GET /coins/my?studentId=` (STUDENT/PARENT), `GET /coins/my/transactions?studentId=` | Số dư hiện bằng `Statistic`/`StatisticCard` (pro-components), lịch sử giao dịch dùng `ProTable<CoinTransactionItem>` (nhiều cột: số tiền, số dư sau, lý do, ngày) |

### 5.7 Nội dung & Thông báo

| Trang | Route | API | Ghi chú |
|---|---|---|---|
| Bài viết | `/posts`, `/posts/:id` | `GET /posts?current=&pageSize=`, `GET /posts/{id}` | `/posts` dùng `ProList<PostItem>` (ảnh bìa trong `metas.avatar`). `PostDetail.contentMd` — cần render Markdown (thêm `react-markdown`, nhẹ, không có trong ADMIN hiện tại — bổ sung riêng) |
| Thông báo | `/notifications` | `GET /notifications/me`, `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all` | `ProList<NotificationItem>` — dòng chưa đọc in đậm, action "Đánh dấu đã đọc" trong `actions`. Không có push thật (xem §12 #3) — tự làm mới khi mở trang |

### 5.7b Tin nhắn — MỚI (16/08/2026, xem §4.12)

| Trang | Route | API | Ghi chú |
|---|---|---|---|
| Danh sách tin nhắn | `/messages` | `GET /messages/me?current=&pageSize=&type=&unread=` | `ProList<MessageItem>` — dòng chưa đọc in đậm (cùng pattern với `/notifications`) |
| Chi tiết tin nhắn | `/messages/:id` | `GET /messages/{id}` | Hiện `content` đầy đủ; đối chiếu lại `message_detail_cubit.dart` khi code xem có tự đánh dấu đã đọc lúc mở chi tiết không — Mobile chỉ có `PATCH /messages/read-all`, không thấy `PATCH /messages/{id}/read` riêng, cần xác nhận hành vi thật |

> **Quyết định UI/UX (16/08/2026)**: Thông báo + Tin nhắn **KHÔNG** đưa lên menu ngang `ProLayout` (route không có `name`/`icon`) — đúng theo pattern gốc Mobile (2 icon trên AppBar kèm badge, xem `home_shell.dart` dòng 178-198) và đúng pattern `ADMIN/src/components/RightContent/` đã có sẵn. Thay vào đó: 2 icon-badge (chuông + tin nhắn) đặt trong `actionsRender` của `ProLayout` (`app.tsx`, cạnh `AvatarDropdown`), badge số lấy từ `unread-count` tương ứng, tự làm mới khi đổi route. Lý do: (1) đúng hành vi nguồn Mobile, (2) menu ngang đỡ dồn — còn 9 mục thay vì 11.

### 5.8 Tài khoản

| Trang | Route | API | Ghi chú |
|---|---|---|---|
| Tài khoản | `/account` | Không gọi API — dùng lại `initialState.currentUser` | Đăng xuất → `POST /auth/logout` + xoá token + redirect `/login` |

---

## 6. Auth & phân quyền

### 6.1 Vai trò dùng WEB
- **STUDENT** — lịch, khóa học, báo cáo (kể cả chuyên cần — chỉ xem) của mình, xin nghỉ, học phí/xu của mình, làm bài thi.
- **PARENT** — báo cáo (kể cả chuyên cần) từng con, xác nhận đơn nghỉ của con, học phí gộp tất cả con, **không** thấy tab Khóa học.
- **TEACHER** — TKB dạy, chấm công QR phòng, duyệt nghỉ phép lớp mình, báo cáo cả lớp.
- **ADMIN/EMPLOYEE** — không phải đối tượng chính; nếu đăng nhập, chuyển hướng sang ADMIN kèm thông báo.

### 6.2 Route tree đầy đủ (`config/routes.ts`)

> Dùng ĐÚNG cơ chế `layout` built-in của Umi Max (giống ADMIN `config/routes.ts`), KHÔNG có route wrapper tự viết. `ProLayout` tự bao mọi route có `name` (route có `name` → hiện trong menu; route không có `name`, vd trang chi tiết, vẫn được `ProLayout` bao nhưng KHÔNG lên menu — đúng pattern ADMIN đã dùng cho `class/detail/:id` v.v.). Chỉ `/login` và `/exams/:examId` đặt `layout: false` ở route **cấp cao nhất** (đây mới là cách `layout: false` thật sự có tác dụng, khác bẫy kỹ thuật của bản kế hoạch trước khi còn định tự viết `AppShell`).

```ts
export default [
  { path: '/login', component: './login', layout: false },
  { path: '/exams/:examId', component: './exams/[examId]', layout: false },
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', icon: 'home', component: './home' },
  { path: '/timetable', name: 'timetable', icon: 'calendar', component: './timetable' },
  { path: '/timetable/session/:id', component: './timetable/session' }, // không name → không lên menu
  { path: '/leave', name: 'leave', icon: 'carryOut', component: './leave' },
  { path: '/leave/new', component: './leave/new' },
  { path: '/teacher-work', name: 'teacher-work', icon: 'qrcode', component: './teacherWork', access: 'isTeacher' },
  { path: '/catalog', name: 'catalog', icon: 'appstore', component: './catalog' },
  { path: '/courses', name: 'courses', icon: 'book', component: './courses', access: 'canViewCourses' },
  { path: '/courses/:classId', component: './courses/[classId]' },
  { path: '/reports', name: 'reports', icon: 'barChart', component: './reports', access: 'canViewReports' },
  { path: '/reports/:studentId/classes/:classId', component: './reports/[studentId]/classes/[classId]' },
  { path: '/reports/:studentId/classes/:classId/topics/:topicId', component: './reports/[studentId]/classes/[classId]/topics/[topicId]' },
  { path: '/reports/:studentId/classes/:classId/sessions/:sessionId', component: './reports/[studentId]/classes/[classId]/sessions/[sessionId]' },
  { path: '/reports/:studentId/classes/:classId/exams/:examId', component: './reports/[studentId]/classes/[classId]/exams/[examId]' },
  { path: '/reports/classes/:classId', component: './reports/classes/[classId]', access: 'isTeacher' },
  { path: '/fee', name: 'fee', icon: 'creditCard', component: './fee' },
  { path: '/coin', name: 'coin', icon: 'gold', component: './coin' },
  { path: '/posts', name: 'posts', icon: 'fileText', component: './posts' },
  { path: '/posts/:id', component: './posts/[id]' },
  { path: '/notifications', component: './notifications' }, // không name/icon — vào qua icon header, xem §5.7b
  { path: '/messages', component: './messages' },             // MỚI (16/08/2026) — không name/icon, vào qua icon header
  { path: '/messages/:id', component: './messages/[id]' },   // MỚI (16/08/2026)
  { path: '/account', name: 'account', icon: 'user', component: './account' },
];
```

> `name` ở mỗi route khớp key `menu.<name>` trong `src/locales/vi-VN/menu.ts` (chỉ 1 file locale duy nhất theo quyết định #13) — đúng pattern i18n-menu ADMIN đang dùng, chỉ rút từ 8 locale còn 1.

### 6.3 `access.ts` đầy đủ

```ts
// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const roles: string[] = initialState?.currentUser?.roles ?? [];
  const isStudent = roles.includes('STUDENT');
  const isParent = roles.includes('PARENT');
  const isTeacher = roles.includes('TEACHER');
  const isStaffOnly = !isStudent && !isParent && !isTeacher; // ADMIN/EMPLOYEE thuần

  return {
    isStudent,
    isParent,
    isTeacher,
    isStaffOnly,
    canViewCourses: !isParent,
    canViewReports: !isStudent,
    canTeacherWork: isTeacher,
    canViewClassReport: isTeacher,
  };
}
```

> **Đã đối chiếu (16/08/2026)** với `MOBILE/lib/home/view/home_shell.dart._visibleTabs()`: Mobile ẩn hẳn tab "Báo cáo" khỏi bottom-tab cho STUDENT (lý do: HS đã có báo cáo của mình gộp sẵn ở "Bài phụ huynh giao" + màn khác, quyết định 11/08/2026 — chỉ là quyết định tiết kiệm chỗ trên bottom-tab, không phải cấm nghiệp vụ). **Quyết định (16/08/2026): khớp chính xác hành vi Mobile trên Web** — thêm cờ `canViewReports: !isStudent`, gắn `access: 'canViewReports'` vào route `/reports` ở `config/routes.ts` (§6.2) để ẩn khỏi menu `ProLayout` cho STUDENT. Route con (`/reports/:studentId/classes/:classId`...) vẫn giữ nguyên không cần access riêng vì không lên menu.

### 6.4 `getInitialState` — chặn ADMIN/EMPLOYEE thuần

```ts
// src/app.tsx (trích đoạn khác biệt so với ADMIN)
// import { history } from '@umijs/max'; — giống ADMIN app.tsx đã import sẵn
// const ADMIN_URL = process.env.ADMIN_URL as string; — khai báo qua config/config.ts `define`
export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const user = await getMe();
      const cu = toCurrentUser(user);
      const roles = cu.roles ?? [];
      const isStaffOnly = !roles.some((r) => ['STUDENT', 'PARENT', 'TEACHER'].includes(r));
      if (isStaffOnly) {
        window.location.href = ADMIN_URL; // biến môi trường, xem §12 #5
        return undefined;
      }
      return cu;
    } catch {
      history.replace(`/login?redirect=${encodeURIComponent(history.location.pathname)}`);
    }
    return undefined;
  };
  // ... phần còn lại giống ADMIN
}
```

---

## 7. Component dùng chung cần dựng mới

> **Nguyên tắc (14/08/2026): chỉ tự viết component khi template THẬT SỰ không có sẵn.** Layout (`ProLayout`), menu (route `name`/`icon`), danh sách (`ProList`/`ProTable`), form (`ProForm`/`DrawerForm`), số liệu (`Statistic`/`StatisticCard`), thẻ (`ProCard`), trang khung (`PageContainer`) — **tất cả đã có sẵn trong `@ant-design/pro-components`/`antd`, dùng thẳng, không viết lại**. Danh sách dưới đây chỉ còn 4 thứ THẬT SỰ mới (không có tương đương trong template vì đặc thù nghiệp vụ này chưa từng xuất hiện ở ADMIN):

| # | Component | Props chính | Hành vi |
|---|---|---|---|
| 1 | `StatusChip` | `status: string`, `variant: 'leave' \| 'session' \| 'invoice' \| 'exam'` | Bảng màu/nhãn TẬP TRUNG 1 chỗ (`src/utils/statusMeta.ts`) — mỗi variant map đúng enum tương ứng ở §4. ADMIN hiện lặp `STATUS_META` rải rác nhiều trang (`leave/index.tsx` và `LeaveDetailDrawer.tsx` đang lặp) — **rút kinh nghiệm, không lặp ở WEB**, dù bản thân `Tag` vẫn là component có sẵn của antd, chỉ bảng màu là tự viết |
| 2 | `QrScanner` | `onScan: (payload: string) => void`, `onManualEntry?` | Bọc `qr-scanner` (npm), xin quyền camera, có nút "Nhập mã thủ công" dự phòng (giống `qr_scan_page.dart._manualEntry`) khi bị từ chối quyền hoặc thiết bị không có camera — ADMIN không có tính năng quét QR nào để tái dùng |
| 3 | `ScoreCard` | `score?: number`, `maxScore?: number`, `label: string`, `onClick?` | Thẻ điểm dùng lại ở Báo cáo VÀ Khóa học — dựng TRÊN `ProCard` + `Statistic` có sẵn (không phải viết từ số 0, chỉ đóng gói lại 1 tổ hợp hay lặp lại) |
| 4 | `CountdownTimer` (riêng cho `/exams/:examId`) | `deadline: string`, `onExpire` | Tính lại chênh lệch server-time mỗi khi `visibilitychange` về `visible`, không tin `setInterval` đếm lùi đơn thuần (xem §12 #2) — antd có `Statistic.Countdown` nhưng KHÔNG tự xử lý được yêu cầu "tính lại khi tab quay lại active", nên vẫn cần bọc thêm logic riêng quanh nó (không viết lại từ đầu, chỉ bọc thêm) |

**Layout**: copy gần nguyên `ADMIN/src/app.tsx` phần `getInitialState`/`export const layout: RunTimeLayoutConfig` — chỉ đổi `defaultSettings.layout` từ `'side'` sang `'top'` và bỏ `SettingDrawer` (công cụ đổi theme dành cho dev/admin, không cần lộ ra cho STUDENT/PARENT/TEACHER).

---

## 8. Kế hoạch kiểm thử

| Loại | Phạm vi | Công cụ |
|---|---|---|
| Unit — `access.ts` | Mọi tổ hợp vai trò (STUDENT/PARENT/TEACHER/staff-only) → đúng cờ `canViewCourses`/`canTeacherWork`/... | `vitest` (đã có `access.test.ts` mẫu ở ADMIN) |
| Unit — `services/*.ts` | Mock `request()`, kiểm tra đúng URL/params/method cho từng hàm | `vitest` + mock `@umijs/max` |
| Unit — `QrScanner` | Giả lập callback `onScan`, kiểm tra `onManualEntry` hiện khi camera lỗi | `@testing-library/react` |
| Unit — `CountdownTimer` | Giả lập `deadline` quá khứ/tương lai, kiểm tra `onExpire` gọi đúng lúc, kiểm tra tính lại khi `visibilitychange` | `vitest` fake timers |
| Integration (thủ công, checklist) | Từng trang ở §5 — mở bằng tài khoản STUDENT/PARENT/TEACHER thật, đối chiếu số liệu với ADMIN/Mobile cho cùng 1 học viên/lớp | Checklist theo Đợt, xem §13 |
| E2E (đợt sau, không bắt buộc MVP) | Luồng "đăng nhập → xem TKB → tạo đơn nghỉ → PH xác nhận → GV duyệt" | Cân nhắc Playwright nếu dự án lớn dần — CHƯA quyết định công cụ, để mở |

---

## 9. Checklist khả năng tiếp cận (a11y)

> Mirror đúng bộ tiêu chí đã áp dụng cho Mobile (`docs/SPEC_KhoaHoc_NoiDung_Mobile.md` §a11y) — áp dụng tương đương cho Web.

| # | Tiêu chí | Áp dụng ở đâu |
|---|---|---|
| 1 | Không truyền tải thông tin chỉ bằng màu (WCAG 1.4.1) | `StatusChip` luôn có nhãn chữ kèm màu, không chỉ chấm màu |
| 2 | Tương phản ≥ 4.5:1 (WCAG 1.4.3) | Kiểm cả `prefers-color-scheme` nếu WEB hỗ trợ dark mode (mở, xem §12) |
| 3 | Vùng chạm ≥ 44×44px (đủ dùng ngón tay trên điện thoại) | Menu ngang `ProLayout` (mặc định antd đã đạt chuẩn này), item trong `ProList`, `ScoreCard` |
| 4 | Focus/`aria-expanded` đúng cho phần tử đóng/mở (accordion đề cương khóa học) | `Collapse`/`Descriptions` antd đã tự phát semantics — kiểm tra khi tuỳ biến |
| 5 | `aria-label` gộp cho mỗi dòng danh sách thay vì để screen reader đọc rời icon+chữ | `ProList`/`ProTable` đã tự phát semantics hợp lý ở mức component — chỉ cần kiểm tra `metas.title`/`metas.description` truyền đủ ngữ cảnh, không phải tự bọc `role`/`aria-label` thủ công |
| 6 | Không dựa vào cuộn tự động làm cách duy nhất tới nội dung | Nếu có auto-scroll tới buổi kế tiếp (giống Mobile), vẫn phải tab tuần tự được |
| 7 | Tôn trọng cỡ chữ hệ thống trình duyệt (không hardcode `px` nhỏ cho nội dung chính) | Dùng `rem`/token typography antd, test ở zoom 200% |
| 8 | Form (`/leave/new`) có label rõ, thông báo lỗi gắn đúng field | `ProForm` antd tự hỗ trợ tốt — vẫn phải review khi custom |

---

## 10. Checklist bảo mật

| # | Mục | Ghi chú |
|---|---|---|
| 1 | Token lưu ở đâu | `localStorage` (giống ADMIN) — chấp nhận XSS-risk tương đương ADMIN hiện tại, KHÔNG đổi sang cookie httpOnly trừ khi có yêu cầu riêng (thay đổi này cần sửa BE) |
| 2 | CORS | Nếu WEB khác domain BE/ADMIN → xác nhận + thêm origin ở BE (xem §12 #5) — **thay đổi BE duy nhất có thể cần** |
| 3 | Role check ở FE chỉ là UX, KHÔNG thay cho check ở BE | Mọi endpoint đã có `@PreAuthorize` ở BE — `access.ts` chỉ ẩn/hiện UI, không phải lớp bảo mật thật |
| 4 | Không log payload nhạy cảm (điểm thi, học phí) ra console ở production build | Kiểm tra `console.log` sót lại trước khi build |
| 5 | Đề thi (`/exams/:examId`): không hiện đáp án đúng (`isCorrect`/`answer`) trước khi nộp | Trường `isCorrect`/`answer` trong `PaperOption`/`PaperTfItem` chỉ về **sau khi đã nộp** theo đúng BE — FE không cần tự ẩn thêm, nhưng PHẢI kiểm tra kỹ khi hiển thị `submitted`/`result` không bị lộ sớm nếu component tái dùng sai ngữ cảnh |
| 6 | Camera permission | `QrScanner` phải xin quyền rõ ràng, không tự động bật camera nền khi chưa vào màn Chấm công |
| 7 | Rà theo `/security-review` (skill có sẵn) trước khi release | Chạy 1 lượt cuối Đợt cuối (§13) |

---

## 11. Quy ước Git / CI

- Repo `WEB/` là **git repo độc lập** (giống `ADMIN`/`BE`/`MOBILE`), tạo remote riêng khi bắt đầu code (đặt tên đề xuất `decaWebv2`, khớp pattern `decaAdminv2`/`decav2`/`decaMobilev2`).
- Copy nguyên `.husky/`, `commitlint.config.ts`, `.lintstagedrc`, `biome.json` từ ADMIN → **Conventional Commits bắt buộc** (`feat(scope): ...`, đã xác minh commitlint chặn commit sai format ở ADMIN).
- Pre-commit: `lint-staged` chạy `biome check --write` trên file staged (đúng pattern ADMIN).
- CI (đề xuất, chưa dựng): GitHub Actions job `biome check` + `tsc --noEmit` + `vitest run` trên mọi PR — copy/điều chỉnh từ workflow ADMIN nếu đã có sẵn (`.github/workflows/`, cần kiểm tra ADMIN có file này chưa lúc bắt đầu code).

---

## 12. Rủi ro & Câu hỏi mở

| # | Câu hỏi / Rủi ro | Đề xuất mặc định | Trạng thái (16/08/2026) |
|---|---|---|---|
| 1 | Domain/deploy: WEB chạy ở domain nào, cùng BE server hay khác? | Cần bạn quyết định trước khi cấu hình `config/proxy.ts` | **CHỐT**: domain mới, FE là project `WEB/` riêng (đã có sẵn tại `D:\duantrungtam\Code Version 2\WEB`) |
| 2 | Làm bài thi trên web dễ bị can thiệp hơn app (DevTools, mở tab tra cứu) — đồng hồ đếm ngược phải dựa `deadline` từ BE, không tin đồng hồ máy client | `CountdownTimer` (§7 #8) tính lại theo `visibilitychange`; cân nhắc thêm cảnh báo "đã rời khỏi trang N lần" hiển thị cho GV (không chặn cứng) — quyết định khi vào Đợt làm `/exams/:examId` | **CHỐT**: giữ nguyên đề xuất mặc định |
| 3 | Không có push notification thật ở đợt đầu | Chấp nhận; có thể bổ sung Web Push sau (ADMIN đã có sẵn `service-worker.js` làm điểm khởi đầu tham khảo) | **CHỐT**: chấp nhận, `/notifications` không tự cập nhật realtime đợt đầu, người dùng tự mở trang để thấy thông báo mới |
| 4 | `payment/` vs `fee/` ở Mobile có trùng chức năng không? | Đọc lại 2 module Mobile này ngay đầu Đợt làm Học phí, gộp nếu trùng | **ĐÃ XÁC MINH**: `MOBILE/lib/payment/view/payment_page.dart` chỉ là placeholder "đang phát triển", không gọi API, không được điều hướng tới từ đâu trong app — không trùng thật. Toàn bộ chức năng thật nằm ở `fee/`. Giữ nguyên kế hoạch gộp vào `/fee`, không cần port gì từ `payment/` |
| 5 | CORS nếu WEB khác domain BE — cần thêm origin ở BE? | Xác nhận domain trước | **ĐÃ XÁC MINH**: `BE/.../security/SecurityConfig.java` dòng 85 `setAllowedOriginPatterns(List.of("*"))` — mọi origin đều gọi được lúc dev, **không cần sửa BE**. Chỉ cần siết lại origin cụ thể khi lên production (việc của giai đoạn deploy, không ảnh hưởng lúc code) |
| 6 | Giữ `@ant-design/pro-components` chỉ để dùng `ProForm`? | Đề xuất: giữ, chỉ dùng cho `/leave/new` | **CHỐT — sửa lại đề xuất**: câu hỏi này là tàn dư của bản kế hoạch cũ; quyết định kiến trúc mới nhất (§1 #4, #12, §7) đã dùng cả `ProLayout`/`ProTable`/`ProList`/`ProForm`/`PageContainer`/`ProCard`/`Statistic`, không chỉ `ProForm`. Giữ nguyên gói, dùng đầy đủ như ADMIN (đã xác nhận `ADMIN/package.json` có `"@ant-design/pro-components": "^3.1.12-0"`) |
| 7 | Có cần dark mode? | Chưa quyết — mặc định KHÔNG làm đợt đầu | **CHỐT**: không tìm thấy cấu hình `darkMode`/`prefers-color-scheme` nào trong `ADMIN/config/` — ADMIN cũng chưa làm. Giữ nguyên: không làm đợt đầu |
| 8 | Enum chính xác của `InvoiceStatus`/`PostStatus` ở §4.8/§4.10 mới chỉ suy đoán từ context | Đọc 2 file enum này ngay đầu Đợt làm `/fee` và `/posts` | **ĐÃ XÁC MINH** (đọc trực tiếp `BE/.../payment/entity/InvoiceStatus.java` và `BE/.../post/entity/PostStatus.java`): `InvoiceStatus = DRAFT, CONFIRMED, PAID, CANCELLED`; `PostStatus = DRAFT, PUBLISHED, ARCHIVED` — khớp 100% với type TS đã viết ở §4.8/§4.10, không cần sửa |
| 9 | `react-markdown` (render `PostDetail.contentMd`) chưa có trong dependency nào của ADMIN — cần thêm mới | Thêm vào `package.json` lúc làm Đợt `/posts` | Chưa xử lý — vẫn để tới Đợt 7 như kế hoạch |
| 10 | Thư viện QR nào chính xác (`qr-scanner` vs `html5-qrcode`) — chưa POC thực tế trên nhiều trình duyệt | Dựng 1 spike nhỏ đầu Đợt chấm công GV | Chưa xử lý — vẫn để tới Đợt 2 như kế hoạch |
| 11 | **(mới, 16/08/2026)** Mobile ẩn hẳn tab "Báo cáo" khỏi bottom-tab cho STUDENT (`home_shell.dart` dòng 151, quyết định 11/08/2026 — lý do thiếu chỗ trên bottom-tab, không phải cấm nghiệp vụ) — Web có nên hiện menu này cho STUDENT không (Web có nhiều chỗ hơn) hay ẩn cho khớp Mobile? | — | **CHỐT**: ẩn cho STUDENT, khớp chính xác hành vi Mobile — đã cập nhật `access.ts` (§6.3, thêm `canViewReports: !isStudent`) và route `/reports` (§6.2, thêm `access: 'canViewReports'`). STUDENT vẫn vào được trang qua link sâu (xem ghi chú ở §5.4) |

---

## 13. Lộ trình triển khai — chia nhỏ tới từng trang

> Mỗi bước: code xong → `npm run lint` (biome + tsc) sạch → verify thủ công qua tài khoản thật → mới sang bước kế. Đúng quy ước đã áp dụng xuyên suốt dự án cho BE/ADMIN/MOBILE.

### Đợt 0 — Khung sườn
0.1. Clone template (§2.1), đồng bộ `package.json` (§2.2–2.3), xoá code mẫu.
0.2. Copy `.husky/`, `commitlint.config.ts`, `biome.json`, `.lintstagedrc` từ ADMIN.
0.3. Cấu hình `layout: 'top'` trong `defaultSettings.ts` + copy runtime `layout` config từ `ADMIN/src/app.tsx` (bỏ `SettingDrawer`) — KHÔNG tự viết layout component nào (§7).
0.4. Copy `services/auth.ts` từ ADMIN; viết `access.ts` (§6.3) — đối chiếu `home_shell.dart._visibleTabs()` trước khi hoàn thiện; điền `name`/`icon`/`access` cho từng route ở `config/routes.ts` (§6.2) để `ProLayout` tự sinh menu đúng theo vai trò.
0.5. Trang `/login` + `getInitialState` (§6.4) — chặn ADMIN/EMPLOYEE thuần.
0.6. Trang `/home` rỗng (chỉ hiện tên user trong `PageContainer`).
**Xong khi**: `npm run dev` chạy, đăng nhập STUDENT/PARENT/TEACHER thật → đúng tên, menu `ProLayout` đúng mục hiện/ẩn theo vai trò (desktop: menu ngang; thu hẹp trình duyệt: tự thành hamburger — không cần code thêm gì cho phần này).

**✅ Hoàn tất & xác nhận live 16/08/2026** — đăng nhập thật qua BE dev (Postgres, seed `seed_fullflow.sql`, mật khẩu mọi user seed = `Admin@123`) với `fs0016`(STUDENT)/`fp016`(PARENT)/`ft001`(TEACHER): tên + menu đúng theo vai trò ở cả 3 case. 2 lỗi phát hiện khi test thật, đã sửa:
- Cổng dev trùng ADMIN (8000) → đổi `package.json` script `dev` sang `PORT=8001`.
- **Bug quan trọng, ghi nhớ cho các Đợt sau**: `layout.locale: false` trong `config/config.ts` KHÔNG phải cờ ẩn language-switcher như tưởng — nó tắt luôn việc `ProLayout` dịch tên menu qua i18n. Đã bỏ cờ này. Locale thật của dự án đặt ở `src/locales/en-US/menu.ts` (không phải `vi-VN` — xác nhận ADMIN cũng không có locale `vi-VN` thật, chỉ nhét tiếng Việt vào `en-US`), `config.locale.default: 'en-US'`, `baseNavigator: false`. Bất kỳ route `name` mới thêm ở các Đợt sau đều phải thêm key `menu.<name>` vào file này.

### Đợt 1 — Lịch học & Nghỉ phép
1.1. `services/timetable.ts` + `typings/timetable.d.ts` (đã có sẵn ở §4.2, copy thẳng).
1.2. Trang `/timetable` (`ProList<TimetableItem>`, nhóm theo ngày).
1.3. `services/session.ts` + trang `/timetable/session/:id` (video/zoom/đề thi buổi — không điểm danh).
1.4. `services/leave.ts` + trang `/leave` (danh sách, `StatusChip` variant `leave`).
1.5. Trang `/leave/new` (`ProForm`).
1.6. Nút "Xác nhận (phụ huynh)" trên `/leave` khi `parentConfirmedBy` null (chỉ PARENT).
**Xong khi**: xem TKB thật, mở chi tiết buổi thật, tạo/xem/PH-xác nhận đơn nghỉ thật qua BE.

**✅ Hoàn tất & xác nhận live 16/08/2026** — `npm run tsc`/`biome:lint`/`test`/`build` sạch. Test thật qua BE với `fp016` (PARENT, 3 con): `/timetable` hiện đúng tuần + lọc theo con (Segmented) + tên thứ tiếng Việt; click buổi → `/timetable/session/:id` hiện đúng video/Zoom/đề thi buổi; `/leave` + tạo đơn qua `POST /leaves` thật → hiện đúng trong danh sách, PH tự tạo thì tự động `parentConfirmedBy` (BE tự set, không cần bấm Xác nhận riêng). 2 điều chỉnh phát hiện khi code:
- §4.3 đã sửa: không có `GET /sessions/{id}` — dùng router state từ `/timetable` + `SessionExamItem` đúng field thật (không phải `RecentExamItem`).
- dayjs global locale bị ghi đè bởi locale container của Umi (project tên `en-US`) — thêm `src/utils/date.ts` (`viDate()`) gọi `.locale('vi')` cục bộ mỗi nơi cần tên thứ/tháng tiếng Việt thay vì dựa vào default toàn cục.

**🎨 Thiết kế lại `/timetable` theo phản hồi người dùng (17/08/2026)** — bản đầu (danh sách xếp dọc theo từng ngày) bị chê không giống thời khóa biểu thật. Đã đổi 2 lần theo yêu cầu trực tiếp:
1. Lần 1: đổi sang bảng lưới 7 cột (1 cột/ngày trong tuần), mỗi cột là danh sách card buổi học xếp dọc.
2. Lần 2 (gọn hơn nữa + đủ rộng): đổi thành bảng lưới thật kiểu thời khóa biểu trường học — **hàng = Sáng/Chiều/Tối, cột = 7 ngày**, ô rộng 180px (đủ chỗ cho tối đa 2 ca/ô), chip buổi học nhỏ gọn (giờ + tên lớp, hover xem đủ môn/phòng/GV). Đồng thời bổ sung thêm **"Danh sách buổi học trong tuần"** (`ProList` dạng chữ, đủ chi tiết) ngay bên dưới bảng lưới — kết hợp cả xem nhanh (lưới) lẫn xem đầy đủ (danh sách), khớp đúng yêu cầu "vẫn cần lịch học bằng chữ".

### Đợt 2 — Chấm công GV
2.1. Spike chọn thư viện QR (§12 #10) — test `qr-scanner` vs `html5-qrcode` trên thiết bị thật.
2.2. Dựng `QrScanner` component (kèm fallback nhập tay).
2.3. Trang `/teacher-work` (access `isTeacher`).
**Xong khi**: quét QR phòng thật trên điện thoại (HTTPS/localhost), chấm công ghi nhận đúng ở BE (đối chiếu ADMIN).

**✅ Code xong 16/08/2026** — `tsc`/`biome`/`build` sạch, trang tải thật qua `ft001` không lỗi runtime. Đã đọc `MOBILE/lib/schedule/data/models/qr_payload.dart` để bắt đúng format `DECA-ROOM:{roomId}:{code}` (chỉ dùng `code`, bỏ `roomId`). **Không test được checkin/checkout QR đầu-cuối thật** — DB dev hiện KHÔNG có phòng nào (`GET /rooms` rỗng), mọi buổi học đều `roomId: null`, nên không có mã QR thật nào để quét/nhập tay thử. Đã verify đúng theo BE contract qua đọc trực tiếp `TeacherAttendanceController`/`TeacherCheckinRequest` — cần test lại bằng tay khi DB có dữ liệu phòng thật.

### Đợt 3 — Khóa học
3.1. `services/classOutline.ts` + `typings/classOutline.d.ts`.
3.2. Trang `/catalog` (chỉ xem, không click).
3.3. Trang `/courses` (ẩn PARENT) + card "Bài phụ huynh giao".
3.4. Trang `/courses/:classId` (cây chuyên đề → buổi → đề thi, khoá tap buổi PLANNED/CANCELLED).
**Xong khi**: đề cương khớp dữ liệu thật, catalog không click được.

**✅ Hoàn tất & xác nhận live 16/08/2026** — `tsc`/`biome`/`build` sạch. Test thật `fs0016`: `/courses` hiện đúng "Bài phụ huynh giao" + 5 lớp thật; `/courses/38` hiện đúng cây đề cương (tiến độ 11/69 buổi, chuyên cần 90%, 5 chuyên đề, buổi PLANNED không bấm được, tag "Đã xin nghỉ" đúng buổi đã nghỉ). **Phát hiện quan trọng khi code**: `/catalog` ở Mobile (`catalog_repository.dart`) **chưa từng nối BE thật** — trả thẳng mock tĩnh, kèm TODO chưa làm. BE cũng không có endpoint "toàn bộ khóa học" khả dụng cho STUDENT/PARENT (`GET /classes` cần `CLASS:READ`, chỉ ADMIN/TEACHER/EMPLOYEE). Web giữ đúng parity: `/catalog` dùng data tĩnh giống Mobile, có ghi chú rõ trong code — không giả vờ gọi endpoint không tồn tại. §5.3 coi như đã cập nhật đúng thực tế.

**🐛 Lỗi layout nghiêm trọng phát hiện + sửa 17/08/2026** (người dùng báo qua ảnh chụp màn hình thật): `/courses/:classId` bị vỡ hoàn toàn — tiêu đề buổi học vỡ chữ từng ký tự 1 dòng dọc. Nguyên nhân: `<List.Item>` chứa `<List.Item.Meta>` rồi thêm 1 sibling khác (khối đề thi của buổi) — antd hiểu nhầm sibling đó là vùng "actions", ép cột `Meta` co lại chỉ còn vài px. **Đã viết lại toàn bộ trang bằng div/flex thường** (không dùng `List`/`List.Item.Meta` nữa) để kiểm soát chắc chắn layout. Rà lại toàn bộ codebase phát hiện **thêm 1 chỗ y hệt** ở `/home` (card "Bảng tin" — tag "Ghim" là sibling ngoài `List.Item.Meta`) — đã sửa bằng cách gộp tag vào trong `description` thay vì để làm sibling. 2 chỗ còn lại dùng `List.Item.Meta` (`teacherWork`, `timetable/session`) đã rà và xác nhận an toàn (dùng đúng prop `actions={[...]}` chính thức, không phải sibling thô).

### Đợt 4 — Báo cáo (module lớn nhất)
4.1. Copy chart component từ `ADMIN/src/pages/report/components/` sang `WEB/src/components/` (điều chỉnh responsive theo `Row`/`Col` nếu cần, không phải theo khung điện thoại cố định).
4.2. `services/report.ts` + toàn bộ `typings/report.d.ts` (đã có sẵn §4.6).
4.3. Trang `/reports` (chọn con/thẳng vào).
4.4. Trang `/reports/:studentId/classes/:classId` — port đúng `SegmentedButton` 3 lựa chọn + sắp ngày gần nhất + lọc "đã học" (đối chiếu `student_report_view.dart` mới nhất).
4.5. Trang chương/buổi (`topics/:topicId`, `sessions/:sessionId`).
4.6. Trang chi tiết bài thi (`exams/:examId`) — **không** `ScoreDistributionChart`.
4.7. Trang `/reports/classes/:classId` (GV).
**Xong khi**: số liệu khớp 1-1 với Mobile cho cùng 1 học viên/lớp.

**✅ Hoàn tất & xác nhận live 16/08/2026** — `tsc`/`biome`/`build` sạch. Test thật `fp016` (PARENT): chọn con → chọn lớp → `/reports/289/classes/38` hiện đúng 4 chart (xu hướng điểm, chuyên cần donut, chuyên cần theo tháng, nắm kiến thức theo chương) + Segmented 3 tab đúng thứ tự, sắp theo ngày gần nhất; click bài thi → chi tiết đúng (điểm/TB lớp/xếp hạng/2 breakdown chart, **không** có phổ điểm — đúng thiết kế). Test `ft001` (TEACHER): `/reports/classes/29` hiện đúng bảng điểm từng đề + bảng học viên (ProTable phân trang). Đã copy 5 chart component từ `ADMIN/src/pages/report/components/` (`ScoreTrendChart`, `BreakdownChart`, `AttendanceMonthChart`, `TopicMasteryChart`, `AttendanceDonut` + `colors.ts`) sang `src/components/charts/`, chỉ đổi đường dẫn import type sang `@/typings/report` — logic giữ nguyên 100%. Đồng thời phát hiện BE có 2 endpoint riêng biệt `GET /reports/students/{id}/classes` (cho id bất kỳ, PARENT dùng) và `GET /reports/my-classes` (tự scope theo STUDENT đăng nhập) — plan trước gộp chung, đã tách đúng 2 hàm `fetchStudentClasses`/`fetchMyReportClasses`.

### Đợt 5 — Học phí & Xu
5.1. Đọc lại `MOBILE/lib/fee/` và `MOBILE/lib/payment/` — xác nhận có trùng chức năng không (§12 #4).
5.2. Đọc `InvoiceStatus.java` lấy đúng enum (§12 #8).
5.3. `services/invoice.ts` + trang `/fee` (gộp hóa đơn tất cả con cho PARENT).
5.4. Drawer/modal thanh toán QR (`<QRCode>` antd).
5.5. `services/coin.ts` + trang `/coin`.
**Xong khi**: xem hóa đơn, mở QR chuyển khoản đúng dữ liệu thật.

**✅ Hoàn tất & xác nhận live 16/08/2026** — `tsc`/`biome`/`build` sạch. Test thật `fp016`: `/fee` hiện đúng 3 ProCard theo con, mỗi con đủ hóa đơn + nút "Thanh toán" chỉ hiện khi `CONFIRMED`; Drawer QR mở đúng (canvas QR + số tiền + ngân hàng + mã thanh toán khớp API thật). `/coin` Segmented chọn con, số dư + lịch sử giao dịch khớp đúng dữ liệu BE. **Phát hiện khi code**: `GET /invoices/my` và `GET /coins/my` **bắt buộc `studentId`** kể cả khi PARENT chỉ có 1 con hoặc STUDENT tự xem (không tự scope như `/timetable`/`/leaves`) — đã xử lý đúng bằng cách luôn truyền `studentId` tường minh.

### Đợt 6 — Đề thi (rủi ro cao nhất, làm riêng)
6.1. `services/exam.ts` + `typings/exam.d.ts`.
6.2. `CountdownTimer` component + unit test (fake timers, `visibilitychange`).
6.3. Trang `/exams/:examId` — hiển thị câu hỏi theo `type` (MC/TF/Essay), auto-save định kỳ (`POST .../draft`).
6.4. Nộp bài (`POST .../submit`) + hiển thị kết quả (`ExamGradeResponse`).
6.5. Test thủ công: làm 1 bài đầy đủ, thử refresh/đóng tab giữa chừng không mất bài, thử hết giờ tự nộp.
**Xong khi**: checklist 6.5 pass hết.

**✅ Code xong & xác nhận live một phần 16/08/2026** — `tsc`/`biome`/`test` (8/8, gồm 3 test `CountdownTimer` với fake timers + `visibilitychange`) sạch. Test thật `fs0016` với đề 192 (`/exams/192`, status thật từ BE = `QUA_HAN`) → **đúng chế độ chỉ xem**: hiện điểm 0/10, đáp án đúng/sai từng câu khớp chính xác `ExamGradeResponse` thật, không cho sửa. **Chưa test được luồng làm bài tương tác đầy đủ (chọn đáp án → auto-save → nộp → hiện kết quả)** vì không tìm được đề nào ở trạng thái đang mở thật trong DB dev hiện tại (mọi đề tra được đều đã `QUA_HAN` hoặc `CHUA_PHAT_HANH`) — cần test tay theo đúng checklist 6.5 khi có dữ liệu đề đang mở thật, hoặc tạo đề test mới qua ADMIN. Logic auto-save định kỳ (20s, `saveExamDraft` im lặng khi lỗi mạng) và submit đã viết đúng theo BE contract (`SubmitExamRequest` map key string), chưa xác minh qua HTTP thật ở luồng nộp bài.

### Đợt 7 — Nội dung & Thông báo & Tin nhắn & Tài khoản
7.1. Thêm `react-markdown` (§12 #9), đọc `PostStatus.java` lấy đúng enum.
7.2. `services/post.ts` + trang `/posts`, `/posts/:id`.
7.3. `services/notification.ts` + trang `/notifications` (đánh dấu đã đọc, đọc tất cả).
7.4. `services/message.ts` + trang `/messages`, `/messages/:id` (MỚI 16/08/2026, §4.12/§5.7b) — đối chiếu `MessageDetailCubit` xem hành vi đánh dấu đã đọc thật.
7.5. Icon-badge Thông báo + Tin nhắn trong `actionsRender` của `app.tsx` (§5.7b) — thay cho việc đưa 2 route này lên menu ngang.
7.6. Trang `/account` (đọc `initialState.currentUser`, nút đăng xuất).
**Xong khi**: các trang còn lại hoàn thiện, khớp dữ liệu thật, badge chuông/tin nhắn cập nhật đúng số chưa đọc.

**✅ Hoàn tất & xác nhận live 16/08/2026** — `tsc`/`biome`/`test`/`build` sạch. Test thật `fs0016`: icon chuông/tin nhắn hiện đúng ở header (không chiếm menu — còn 9 mục), click chuông → `/notifications` đúng dữ liệu; `/posts` → click bài viết → markdown (`react-markdown`) render đúng heading; `/messages` → click tin nhắn → chi tiết đúng + tự đánh dấu đã đọc. **Phát hiện khi đọc trực tiếp `MessageController.java`/`NotificationType.java`**: BE đầy đủ hơn suy đoán trong plan — `PATCH /messages/{id}/read` THẬT SỰ tồn tại (nghi ngờ trước đó ở §12 #11 sai), `MessageItem`/`MessageDetail` có thêm field `readAt`, và `NotificationType` có 13 giá trị (không phải 8 như liệt kê ban đầu) — đã cập nhật type TS khớp đủ.

### Đợt 8 — QA & hoàn thiện
8.1. Test responsive: điện thoại thật (Android + iOS Safari, menu tự thu hamburger) + desktop rộng (menu ngang đầy đủ, layout co giãn theo `Row`/`Col`).
8.2. Chạy checklist a11y (§9) và bảo mật (§10).
8.3. Chạy `/security-review` (skill có sẵn) trên toàn bộ diff.
8.4. Polish UI, xử lý các câu hỏi mở còn tồn (§12) chưa chốt.
**Xong khi**: checklist §14 pass hết.

**✅ Hoàn tất phần code & QA khả thi 16/08/2026**:
- 8.1 Responsive: test thật resize xuống 375×812 (mobile) — `ProLayout` tự chuyển menu ngang thành hamburger (icon "menu"), Drawer mở đúng đủ 9 mục tiếng Việt theo vai trò — không cần code thêm gì (đúng dự đoán §1 #4/#8).
- 8.2 Bảo mật: rà thủ công theo §10 — không có `console.log` nhạy cảm, không hardcode secret, token JWT vẫn ở `localStorage` (chấp nhận như ADMIN), FE chỉ ẩn/hiện UI theo `access.ts` (không thay cho `@PreAuthorize` ở BE), đáp án đề thi (`isCorrect`/`answer`) chỉ áp dụng style khi `isReview=true` (khớp đúng BE chỉ trả field này sau khi nộp), `QrScanner` không tự bật camera nền (chỉ khi mở Modal).
- 8.2 A11y: `StatusChip` luôn có nhãn chữ kèm màu (không chỉ màu); `ProList`/`Collapse`/`ProTable` dùng nguyên component có sẵn của template (tự phát đúng semantics); không có auto-scroll; không hardcode font-size nhỏ.
- 8.3 `/security-review`: **KHÔNG chạy được** — cần git repo, nhưng `WEB/` chưa `git init` (quyết định khởi tạo + remote là việc của bạn theo §11, chưa tự ý làm vì đây là hành động cần xác nhận). Đã bù bằng rà thủ công ở trên; nên chạy `/security-review` hoặc `/code-review ultra` thật sau khi có git repo.
- `npm run lint` (biome + tsc, đúng lệnh CI dự kiến ở §11) sạch trên toàn bộ 9 Đợt.
- Test đầy đủ 24 trang qua BE thật (Postgres dev seed) với 3 tài khoản `fs0016`(STUDENT)/`fp016`(PARENT)/`ft001`(TEACHER) xuyên suốt Đợt 0-7 — chi tiết từng đợt đã ghi trong các mục "✅ Hoàn tất" tương ứng ở trên.

**Còn tồn đọng, cần làm tiếp (không phải bug, là việc chưa làm được do giới hạn dữ liệu/thời gian phiên này)**:
- `git init` + remote `decaWebv2` cho `WEB/` (quyết định + thao tác của bạn).
- Luồng làm bài thi tương tác đầy đủ (chọn đáp án → auto-save → nộp) chưa test qua trình duyệt thật (§6, thiếu đề đang mở trong DB dev) — logic đã viết đúng theo BE contract, chỉ chưa click-test.
- QR chấm công GV chưa test đầu-cuối thật (§2, DB dev không có phòng nào).
- 2 mục ở §12: `react-markdown` không xung đột React 19 (đã build/chạy thật thành công — coi như xác nhận), thư viện QR (`qr-scanner`) chưa POC trên thiết bị di động thật (Chrome Android/Safari iOS).

---

## 14. Checklist trước khi bắt đầu code Đợt 0

- [x] Xác nhận **18 quyết định kiến trúc** ở §1.
- [x] Trả lời **11 câu hỏi mở** ở §12 (16/08/2026 — #1,2,3,4,5,6,7,8,11 đã chốt; #9 react-markdown, #10 QR library để lại đúng lúc theo lộ trình, không chặn Đợt 0).
- [x] Đối chiếu `MOBILE/lib/home/view/home_shell.dart._visibleTabs()` thật với bảng vai trò §6.1/§6.3 — phát hiện lệch (Reports ẩn cho STUDENT ở Mobile), đã sửa `access.ts` + route (§6.2/§6.3, xem §12 #11).
- [x] Xác nhận danh sách route/trang §5 + §6.2 đã đủ — review 16/08/2026 đối chiếu lại toàn bộ thư mục `MOBILE/lib/` (18 thư mục), phát hiện thiếu `messages/` (module thật, có API thật, đã bổ sung §4.12/§5.7b) và xác nhận `payment/` đúng là placeholder chết (không cần port). Danh sách nay đủ 13 module nghiệp vụ (xem §0).
- [x] Chốt lộ trình §13 (16/08/2026) — làm tuần tự Đợt 0→8.
- [x] Xác nhận repo Git riêng cho `WEB/` (§11, 16/08/2026) — tên remote `decaWebv2`.

**Tham chiếu source dùng để verify khi code** (xác nhận 16/08/2026): `ADMIN/` = `D:\duantrungtam\Code Version 2\ADMIN`, `MOBILE/` = `D:\duantrungtam\Code Version 2\MOBILE`, `BE/` = `D:\duantrungtam\Code Version 2\BE`, Swagger/OpenAPI JSON = `D:\duantrungtam\Code Version 2\docs\api-docs.json` (đối chiếu thêm nếu cần khi DTO ở §4 có nghi ngờ chưa khớp BE mới nhất).

---

**Tổng kết 1 câu**: `WEB/` = clone sạch template Ant Design Pro (đúng bản ADMIN) → dùng thẳng `ProLayout`/`ProTable`/`ProList`/`ProForm` có sẵn của template (menu ngang tự responsive 9 mục, Thông báo/Tin nhắn ra icon-badge header thay vì chiếm menu, không tự viết bottom-tab hay khung điện thoại, không điểm danh HV) → 13 module Mobile (auth, lịch/nghỉ phép/chấm công GV, khóa học, đề thi, báo cáo, học phí/xu, nội dung/thông báo/tin nhắn, tài khoản) port sang theo đúng kiểu dữ liệu TypeScript khớp 100% DTO BE đã liệt kê ở §4 — gọi thẳng BE hiện có, không sửa gì trừ khả năng CORS lúc lên production.

---

## 15. Thiết kế lại theo bản Designer (17/08/2026) — CHỈ LÊN KẾ HOẠCH, CHƯA CODE

> Người dùng đã thuê designer thiết kế lại giao diện, cung cấp 8 file HTML/CSS tĩnh tại `docs/ThietKe/Web/`: `home.html`, `timetable.html`, `leave.html`, `courses.html`, `course-detail.html`, `fee.html`, `coin.html`, `account.html`. Mục này đọc kỹ, rút ra hệ thống thiết kế, rồi lên kế hoạch áp dụng cho **toàn bộ** trang (kể cả 16 trang designer chưa vẽ) — sẽ **hiện thực hoá ở phiên làm việc sau**, phiên này chỉ lập kế hoạch.

### 15.1 Hệ thống thiết kế rút ra được (8 file dùng chung 1 bộ CSS y hệt)

**Màu sắc** (`:root` CSS variables):
| Token | Giá trị | Vai trò |
|---|---|---|
| `--paper` | `#F7F4EC` | nền trang (kem ấm, không phải xám lạnh mặc định antd) |
| `--card` / `--card-warm` | `#FFFFFF` / `#FFFDF8` | nền card / nền header bên trong card |
| `--ink` / `--ink-soft` / `--ink-faint` | `#1C1B2E` / `#6E6C82` / `#A7A4B8` | chữ chính/phụ/mờ |
| `--line` / `--line-soft` | `#E9E4D8` / `#EFEBE1` | viền đậm/nhạt |
| `--cobalt` / `--cobalt-dark` / `--cobalt-tint` | `#2E43E8` / `#1E2FB8` / `#EBEDFC` | **màu chủ đạo** (primary) — khác hẳn `#1677ff` đang dùng |
| `--coral` / `--coral-tint` | `#FF5D6C` / `#FFEAEC` | cảnh báo/nhấn mạnh/ghim |
| `--gold` / `--gold-dark` | `#F2A93B` / `#C97F1B` | cảnh báo nhẹ/chờ duyệt/Xu |
| `--sage` / `--sage-tint` | `#2FAE7A` / `#E7F7EF` | thành công/đã hoàn thành |
| Bo góc | `20px` (lg, card lớn) / `14px` (md) / `10px` (sm, nút) |
| Đổ bóng | `--shadow-card` (nhẹ, cho mọi panel) / `--shadow-pop` (nổi hơn, khi hover) |

**Font**: `Plus Jakarta Sans` (tiêu đề, 500-800) + `Be Vietnam Pro` (nội dung, 400-600) + `JetBrains Mono` (số/ngày tháng — class `.mono`, dùng cho mọi con số: điểm, tiền, ngày, mã) — tải qua Google Fonts. **Khác hẳn font hệ thống antd mặc định hiện tại.**

**Icon**: SVG vẽ tay (stroke-based, 1.8px, bo tròn đầu nét) cho mọi icon — KHÔNG dùng `@ant-design/icons` (font-icon). Phải trích xuất thành bộ icon component riêng để giữ đúng nét vẽ.

**Bố cục khung** (khác hẳn `ProLayout` hiện tại):
- Sidebar 260px, nền trắng, 4 nhóm có nhãn: **Tổng quan** (Trang chủ, TKB, Đơn nghỉ), **Học tập** (Danh mục, Khóa học), **Tài chính** (Học phí, Xu), **Cá nhân** (Bài viết, Tài khoản) — mục active có thanh dọc màu cobalt bên trái + nền tint. Cuối sidebar có `plan-card` gradient "Cần hỗ trợ?" + nút liên hệ.
- Topbar 72px, nền paper mờ (backdrop-blur), có ô tìm kiếm dạng viên thuốc (decorative), 2 icon-btn (chuông/tin nhắn, có `badge-dot` chấm đỏ khi có tin chưa đọc), user-chip (avatar tròn gradient chữ cái đầu + tên + chevron) dẫn tới `/account`.
- Responsive: ≥1080px đủ 2 cột; 900-1080px sidebar thu icon-only; <640px sidebar thành Drawer trượt + hamburger.

**Component dùng lặp lại nhiều nơi** (cần dựng thành React component riêng, KHÔNG có sẵn trong ProComponents):
| Tên (class CSS gốc) | Mô tả | Dùng ở trang |
|---|---|---|
| `page-head` | Tiêu đề H1 + phụ đề + nút hành động bên phải | mọi trang |
| `crumb` | Breadcrumb "← Khóa học" | course-detail |
| `panel` | Card bo góc lớn, padding 22px, đổ bóng nhẹ | mọi trang (thông tin tổng quan) |
| `list-card` + `list-row` | Card chứa danh sách dòng (icon vuông bo góc + tiêu đề/phụ đề trái, badge/nút/chevron phải) | leave, courses, fee, timetable (danh sách buổi) |
| `table-wrap` + `data-table` + `pagination` | Bảng dữ liệu viền mảnh, hover đổi nền, phân trang dạng viên tròn | coin (lịch sử giao dịch) |
| `badge` (5 màu: sage/gold/cobalt/coral/neutral) | Pill trạng thái, luôn có icon nhỏ + chữ | trạng thái buổi/đơn nghỉ/hóa đơn |
| `accordion` + `session-item` + `quiz-chip` | Khối gập theo chuyên đề, bên trong là từng buổi + chip đề thi thu nhỏ | course-detail |
| `tt-grid` (bảng Sáng/Chiều/Tối × 7 ngày) | **Giống hệt hướng đã tự nghĩ ra ở §5.2 lần sửa trước** — xác nhận đúng hướng | timetable |
| `empty-state` | Icon lớn mờ + text + nút hành động | timetable/home khi rỗng |
| `progress-track/fill` | Thanh tiến độ bo tròn, gradient cobalt | course-detail |
| `info-grid` | Lưới 2-3 cột nhãn/giá trị | course-detail, fee, account |
| `xu-card` | Card gradient vàng nổi bật, có hoa văn tròn mờ góc, dùng riêng cho widget Xu ở trang chủ | home |
| `feed-card` | Card bài viết dạng feed: thumbnail vuông bo góc gradient theo loại tin, tiêu đề đậm, mô tả 2 dòng, badge loại + tác giả + ngày | home (Bảng tin), sẽ dùng lại cho `/posts` |
| `greet-bar` | Thanh chào đầu trang chủ, hiệu ứng "vé xé" (viền răng cưa giả lập bằng chấm tròn `punch-holes`) + `mini-stats` (số liệu nhỏ ngăn cách bởi viền dọc) | home |

### 15.2 Đối chiếu 8 trang designer đã vẽ với trang hiện có

| Designer file | Route hiện tại | Đánh giá | Việc cần làm |
|---|---|---|---|
| `home.html` | `/home` | Bố cục khác hẳn bản vừa làm (2 cột: Bảng tin chiếm 1fr bên trái dominant, phải là stack "Lịch hôm nay" + `xu-card`) — **không có hàng StatisticCard rời**, số liệu gộp vào `greet-bar` luôn | Viết lại hoàn toàn theo `home-grid` 2 cột, thêm `xu-card` (hiện chưa có ở bản hiện tại — cần `fetchMyCoinBalance` ngay ở trang chủ) |
| `timetable.html` | `/timetable` | **Khớp đúng hướng** bảng Sáng/Chiều/Tối đã tự sửa theo yêu cầu trước — chỉ cần thay da (class CSS) cho đúng token màu/khoảng cách, thêm `date-nav` dạng viên thuốc | Reskin, không đổi cấu trúc dữ liệu |
| `leave.html` | `/leave` | Đơn giản hơn bản hiện tại (không thấy nút "Xác nhận PH" trong mock — designer chỉ vẽ 1 trạng thái mẫu) | Giữ nguyên logic (nút Xác nhận PH khi `!parentConfirmedBy`), chỉ đổi giao diện `list-row` |
| `courses.html` | `/courses` | Khớp — "Bài phụ huynh giao" + "Lớp học của tôi", nhưng dùng `list-card` với `list-row` (icon vuông + chevron) thay vì `ProList` | Reskin |
| `course-detail.html` | `/courses/:classId` | Khớp cấu trúc (accordion + progress + info-grid) — nhưng dùng `accordion`/`session-item`/`quiz-chip` thay vì Collapse/div tự viết đã sửa lỗi vỡ layout gần đây | Viết lại bằng component mới, giữ nguyên fix layout đã học (KHÔNG dùng `List.Item.Meta`) |
| `fee.html` | `/fee` | Designer chỉ vẽ góc nhìn STUDENT (danh sách phẳng, có tổng học phí/đã đóng/còn lại ở đầu) — **KHÔNG vẽ góc nhìn PARENT** (gộp theo con) | Reskin cho STUDENT theo mock; **PARENT vẫn giữ logic gộp theo con đã làm** (mỗi con 1 `list-card`), bổ sung thêm khối tổng học phí 3 cột đầu trang cho từng con |
| `coin.html` | `/coin` | Khớp — số dư to + `table-wrap` lịch sử. Designer không vẽ Segmented chọn con cho PARENT | Reskin, giữ Segmented PARENT (đặt trên panel số dư) |
| `account.html` | `/account` | Khớp — panel max-width 560px, avatar 64px + badge vai trò, info-grid 1 cột, nút đăng xuất viền đỏ | Reskin |

### 15.3 Trang designer CHƯA vẽ — cần tự thiết kế bổ sung (bám sát hệ thống ở §15.1)

Nav sidebar designer **cố ý ẩn "Báo cáo" và "Chấm công"** vì mock từ góc nhìn STUDENT (`account.html` ghi rõ badge "STUDENT") — **khớp đúng** quyết định `access.ts` đã làm (`canViewReports:!isStudent`, `canTeacherWork: isTeacher`), không phải thiếu sót. Nav cũng thiếu "Thông báo"/"Tin nhắn" trong sidebar — **khớp đúng** quyết định icon-badge header thay vì chiếm menu đã làm ở Đợt 7. Vậy các trang thật sự cần tự vẽ thêm là:

| Trang | Lý do vắng mặt trong bản designer | Hướng thiết kế bổ sung |
|---|---|---|
| `/login` | Không nằm trong shell có sidebar | Card `panel` giữa màn hình nền `--paper`, logo DECA (hình thoi cobalt + chấm coral, lấy nguyên từ sidebar), input viền `--line`, nút `btn-primary` full-width |
| `/catalog` (Danh mục) | Có trong nav (`category.html`) nhưng **không có file** — designer bỏ sót, không phải cố ý ẩn | Dùng `list-card` như `courses.html` nhưng KHÔNG có `list-row.clickable` (đúng logic hiện tại: chỉ xem, data tĩnh) |
| `/teacher-work` (Chấm công GV) | Ẩn đúng vì STUDENT không thấy — cần thêm khi vẽ cho vai trò TEACHER | `mini-stats` kiểu greet-bar cho 4 số (Đúng giờ/Vào trễ/Vắng/Chưa chấm) + `list-card` buổi dạy, mỗi dòng có 2 `icon-btn-sm` (Vào/Ra) — giữ nguyên `QrScanner` Modal, chỉ đổi bo góc/màu cho khớp `--radius-lg`/`--cobalt` |
| `/reports` + 5 trang con | Ẩn đúng vì STUDENT không thấy — cần thêm khi vẽ cho PARENT/TEACHER | `page-head` + `panel` chứa chart (giữ nguyên 5 chart `@ant-design/plots` đã copy từ ADMIN, chỉ đổi màu chart sang bộ `--cobalt/--sage/--gold/--coral` cho đồng bộ) + tab chuyển "Bài thi/Buổi học/Chương học" dựng bằng pill-tab tự vẽ (giống `.badge` nhưng dạng toggle) thay `Segmented` mặc định; danh sách dùng `list-card`; bảng GV dùng `table-wrap` |
| `/posts` + `/posts/:id` | Có trong nav + link từ Bảng tin nhưng không có file riêng | `/posts`: lặp lại `feed-card` full-width dạng danh sách (đã có mẫu ở home). `/posts/:id`: `panel` rộng, ảnh bìa full-width bo góc trên, tiêu đề `Plus Jakarta Sans` lớn, nội dung markdown dùng `Be Vietnam Pro` |
| `/notifications` | Chỉ có icon topbar, không có trang | `list-card`/`list-row`: icon chuông màu theo loại, chưa đọc chữ đậm + chấm tròn cobalt đầu dòng, nút "Đánh dấu đã đọc tất cả" kiểu `btn-outline` ở `page-head` |
| `/messages` + `/messages/:id` | Chỉ có icon topbar, không có trang | Giống `/notifications` (list) + trang chi tiết dạng `panel` đơn giản (tiêu đề, ngày `.mono`, nội dung) |
| `/exams/:examId` (làm bài thi) | Full-screen, không sidebar — designer không vẽ | Tự thiết kế riêng: nền `--paper`, card `panel` giữa màn hình rộng ~800px, đồng hồ đếm ngược dạng `badge` lớn màu cobalt/coral (đỏ khi <5 phút), câu hỏi từng `panel` nhỏ nối tiếp — **giữ nguyên toàn bộ logic `CountdownTimer`/auto-save đã viết đúng, chỉ thay giao diện** |

### 15.4 Việc kỹ thuật cần làm để áp dụng hệ thống thiết kế (không đổi logic nghiệp vụ)

1. **Nạp font**: thêm `<link>` Google Fonts vào `config/config.ts` (`links`/`headScripts` của Umi) — 3 font family. Cân nhắc tự host (`@font-face` local) nếu cần offline-safe, nhưng bám sát mock nên dùng CDN trước.
2. **Tách CSS tokens**: đưa toàn bộ biến `:root` ở designer vào `src/global.less` làm CSS variables dùng chung, KHÔNG trộn lẫn với biến antd.
3. **Theme antd**: cấu hình `ConfigProvider`/`token` trong `app.tsx` để `colorPrimary: '#2E43E8'`, `borderRadius` khớp, `fontFamily` map sang `Be Vietnam Pro` — để các component antd thuần (Modal, Drawer, Form, Table nội bộ ProTable) không bị lệch tông với phần tự vẽ.
4. **Bộ icon riêng**: trích toàn bộ SVG designer dùng thành `src/components/icons/*.tsx` (khoảng 25-30 icon: home, calendar, leave, category, course, fee, coin, post, account, bell, message, search, chevron-left/right/down, check-circle, clock, book, coin-stack, v.v.) — export dạng React component nhận `className`/`style`.
5. **Bộ component design-system riêng** `src/components/ds/`: `PageHead`, `Panel`, `ListCard`/`ListRow`, `Badge` (5 màu, thay `StatusChip` hiện tại — hoặc sửa `StatusChip` dùng chung bảng màu mới), `DataTableWrap`, `Accordion`, `ProgressBar`, `InfoGrid`, `EmptyState`, `XuCard`, `FeedCard`, `GreetBar`.
6. **AppShell mới thay `ProLayout`**: đây là thay đổi kiến trúc lớn nhất — **đảo ngược quyết định §1 #4** (đang dùng `ProLayout` có sẵn) vì sidebar/topbar designer quá đặc thù (4 nhóm nav có nhãn, plan-card gradient, search pill, greet-bar) để chỉnh qua props của `ProLayout` mà vẫn đúng pixel. Đề xuất: viết `src/components/AppShell/` tự quản lý sidebar + topbar + responsive Drawer, dùng `routes.ts` hiện có để sinh nav (lọc theo `access`), giữ `react-router` (`Outlet` qua `@umijs/max`) cho phần nội dung. **Không còn dùng `ProLayout`/`PageContainer` nữa** — nhưng vẫn giữ `ProTable`/`ProForm`/`@ant-design/plots` cho phần chức năng phức tạp bên trong.
7. **`StatusChip`/`badge` màu**: viết lại bảng màu ở `src/utils/statusMeta.ts` theo đúng 5 tông designer (sage/gold/cobalt/coral/neutral) thay vì màu antd mặc định hiện tại (green/gold/blue/red/default) — tinh thần giữ, chỉ đổi mã màu + thêm icon nhỏ trong badge.
8. **Trách nhiệm dữ liệu KHÔNG đổi**: toàn bộ `services/*.ts`, `typings/*.d.ts`, logic fetch/state của 24 trang đã làm ở Đợt 0-8 **giữ nguyên 100%** — đây thuần là việc thay lớp giao diện (view), không đụng vào tầng dữ liệu đã test kỹ qua BE thật.

### 15.5 Câu hỏi mở cần bạn chốt trước khi bắt đầu code lại

| # | Câu hỏi | Đề xuất mặc định (nếu không phản hồi) |
|---|---|---|
| 1 | Bỏ `ProLayout`/`PageContainer`, tự viết `AppShell` — chấp nhận đánh đổi (mất vài tiện ích có sẵn của template như `SettingDrawer`, đổi lại đúng pixel thiết kế)? | Đồng ý bỏ, vì đây là hướng đúng để "đẹp" như yêu cầu |
| 2 | Ô tìm kiếm ở topbar (`search-pill`) — làm thật (tìm khóa học/tin nhắn) hay để decorative như mock? | Để decorative trước, làm thật là việc ngoài phạm vi 24 trang hiện có |
| 3 | `plan-card` "Cần hỗ trợ? Liên hệ ngay" cuối sidebar — liên kết đi đâu (hotline? email? trang riêng?) | Mặc định `mailto:` hoặc số điện thoại trung tâm nếu có sẵn, tạm để `href="#"` nếu chưa có thông tin |
| 4 | Font Google Fonts qua CDN — chấp nhận phụ thuộc mạng ngoài lúc tải trang lần đầu, hay cần tự host? | Dùng CDN trước (đúng mock), tự host sau nếu cần |
| 5 | Thứ tự thực hiện: làm lại theo Đợt 0→8 y hệt lần trước (khung sườn/AppShell trước, rồi từng module), hay ưu tiên 8 trang designer đã vẽ trước rồi mới tới 16 trang tự thiết kế? | Đề xuất: AppShell + 8 trang có sẵn thiết kế trước (khối lượng chắc chắn, ít đoán), rồi mới tới 16 trang tự bổ sung theo hệ thống đã rút ra |

**Chưa code gì trong phiên này** — chờ xác nhận §15.5 (hoặc "cứ làm theo mặc định") rồi mới bắt đầu viết lại từ `AppShell`.
