# DeepLearnX Frontend

> AI-Powered Learning Platform — by Vũ Văn Thanh

## Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 18 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 8 | Build tool, dev server |
| MUI (Material UI) | 7 | Component library |
| Redux Toolkit | 2 | State management |
| redux-persist | 6 | Persist auth state to localStorage |
| Formik + Yup | 2 + 1 | Form handling & validation |
| Axios | 1 | HTTP client |
| React Router | 7 | Client-side routing |
| SCSS | — | Styling (module-scoped) |
| react-quill | 2 | Rich text editor |
| react-toastify | 11 | Toast notifications |

## Cài đặt & Chạy

```bash
# Cài dependencies
pnpm install

# Chạy dev server (port 4200 mặc định của Vite config)
pnpm dev

# Build production
pnpm build

# Preview build
pnpm preview

# Lint
pnpm lint
```

## Biến môi trường

Tạo file `.env` tại thư mục gốc:

```env
VITE_API_URL=http://localhost:9000
```

| Biến | Mô tả |
|------|-------|
| `VITE_API_URL` | Base URL của backend API |

## Cấu trúc thư mục

```
src/
├── assets/                   # Static assets (logo, hình ảnh)
│   └── logo.svg
│
├── libs/                     # Thư viện dùng chung toàn dự án
│   ├── components/
│   │   ├── layout/           # AppBar, Sidebar, Layout chính
│   │   └── ui/
│   │       ├── base-drawer/  # Drawer component (không đóng khi click nền)
│   │       ├── base-form/    # Form động dựa trên config (Formik)
│   │       ├── base-modal/   # Modal component
│   │       ├── base-table/   # Table component
│   │       ├── button/       # ButtonComponent wrapper
│   │       ├── editor/       # Rich text editor (react-quill)
│   │       └── input/        # Input component
│   ├── constants/            # Hằng số dùng chung (HTTP status, form types, error codes)
│   ├── interceptor/          # Axios interceptors
│   │   ├── axios-client.ts   # Singleton axios instance
│   │   ├── auth.interceptor.ts   # Attach token, xử lý 401 + refresh token
│   │   ├── token.service.ts  # Đọc/ghi token từ localStorage
│   │   ├── auth.service.ts   # AuthService.logout()
│   │   └── http.config.ts    # Base URL config
│   ├── pages/
│   │   └── not-found/        # Trang 404
│   ├── service/              # Base service (Repository pattern)
│   └── types/                # Shared TypeScript types
│
├── modules/                  # Feature modules (mỗi module độc lập)
│   ├── auth/
│   │   ├── page/login/       # Trang đăng nhập
│   │   │   ├── index.tsx
│   │   │   ├── login.config.ts
│   │   │   └── login.validation.ts
│   │   └── shell/            # Redux slice, types, service, endpoint, route
│   ├── home/
│   │   ├── page/             # Dashboard trang chủ
│   │   └── shell/
│   └── schedule/
│       ├── pages/schedule/   # Trang lịch (calendar view)
│       │   ├── index.tsx
│       │   ├── schedule.config.ts
│       │   ├── schedule.validation.ts
│       │   ├── schedule.constants.ts
│       │   ├── schedule.utils.ts
│       │   └── schedule.module.scss
│       └── shell/            # Redux slice, types, service, endpoint, route
│
├── shell/                    # App-level setup
│   ├── redux/                # Store config, hooks, redux-persist
│   └── route/                # Root router, protected routes
│
└── styles/                   # Global SCSS
    ├── abstracts/            # Variables, mixins
    └── base/                 # Reset, typography
```

## Kiến trúc Module

Mỗi feature module có cấu trúc chuẩn:

```
modules/<feature>/
├── shell/
│   ├── <feature>.route.ts        # Route path constants
│   ├── <feature>.endpoint.ts     # API endpoint constants
│   ├── <feature>.service.ts      # API calls (Singleton + Repository)
│   ├── <feature>.slice.ts        # Redux slice (thunks + reducers)
│   └── <feature>.type.ts         # TypeScript interfaces/types
└── pages/<page>/
    ├── index.tsx                 # Page component
    ├── <page>.config.ts          # BaseForm field config
    ├── <page>.validation.ts      # Yup schema
    ├── <page>.constants.ts       # Page-level constants
    ├── <page>.utils.ts           # Pure utility functions
    └── <page>.module.scss        # SCSS module
```

## Các quyết định kiến trúc

### 1. Service Layer — Singleton + Repository

```ts
// Mỗi service là singleton, chỉ gọi API
class ScheduleService {
  private static instance: ScheduleService;
  static getInstance() { ... }
  getSchedules(): Promise<...> { ... }
}
```

### 2. BaseFormComponent — Form động theo config

Truyền vào `formConfig` (danh sách field) + `validationSchema` (Yup), component tự render form:

```tsx
<BaseFormComponent
  formConfig={scheduleConfig}
  validationSchema={scheduleSchema}
  values={formValues}
  onChange={setFormValues}
  onSubmit={handleSubmit}
  handlers={{ close: () => setDialogOpen(false) }}
/>
```

Hỗ trợ field types: `TEXT`, `PASSWORD`, `SELECT`, `MULTI_SELECT`, `EDITOR`, `BUTTON`.

### 3. Validation — Module-scoped Yup schemas

Validation không nằm trong form config mà tách riêng thành file `.validation.ts` của từng module. `BaseFormComponent` nhận `validationSchema` qua props.

### 4. Refresh Token — Queue pattern

Khi access token hết hạn (401):
1. Request đầu tiên gọi `POST /api/auth/refresh`
2. Các request tiếp theo bị queue lại (không gọi refresh lặp)
3. Khi refresh thành công → retry tất cả request trong queue với token mới
4. Khi refresh thất bại → `AuthService.logout()`, clear queue với error

```
Request 401 → isRefreshing?
  Không → gọi refresh → processQueue(null, newToken) → retry
  Có    → đưa vào failedQueue → đợi resolve/reject
```

### 5. State Persistence

Redux state được persist qua `redux-persist`. Chỉ whitelist `auth` slice (lưu token + thông tin user). Các slice khác (schedule, v.v.) không persist — reload từ API.

### 6. Protected Routes

Route được bảo vệ bằng component kiểm tra `isAuthenticated` từ Redux store. Nếu chưa đăng nhập → redirect về `/login`. Nếu đã đăng nhập mà vào `/login` → redirect về trang chủ.

## Git Hooks (Husky)

- **pre-push**: Chạy `pnpm lint` tự động trước khi push. Push sẽ bị chặn nếu có lỗi ESLint.
