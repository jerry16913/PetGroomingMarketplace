# ProSpace - 共享職人空間預約平台

一站式共享職人空間 + 預約 Marketplace SaaS 平台，支援多業種（寵物美容、按摩、美甲、刺青、健身、芳療），提供客人預約、職人管理、平台營運三端完整 UI。

---

## 技術架構

| 項目 | 版本 |
|------|------|
| Next.js (App Router) | 15 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| dayjs | 1.x |
| zod | 3.x |

- 不依賴任何 UI 套件（純 Tailwind + 自建元件）
- 全站 RWD（mobile / tablet / desktop）
- Mock Data 驅動，無需後端即可完整運行

---

## 快速開始

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm start
```

開啟瀏覽器前往 `http://localhost:3000`

---

## 測試帳號

| 角色 | Email | 密碼 |
|------|-------|------|
| 客人 (Customer) | `customer@test.com` | 任意輸入 |
| 職人 (Professional) | `pro@test.com` | 任意輸入 |
| 管理員 (Admin) | `admin@test.com` | 任意輸入 |

登入後依角色自動導向對應後台。

---

## 專案結構

```
├── app/
│   ├── layout.tsx                  # 根 Layout（ToastProvider）
│   ├── (public)/                   # 公開端（含 Navbar + Footer）
│   │   ├── page.tsx                # 首頁
│   │   ├── explore/                # 探索頁
│   │   ├── professionals/          # 職人列表 + 詳情
│   │   ├── services/               # 服務列表
│   │   ├── booking/                # 預約流程 + 確認付款
│   │   ├── account/                # 帳號總覽 / 訂單 / 評價
│   │   └── auth/                   # 登入 / 註冊
│   ├── (pro)/pro/                  # 職人後台
│   │   ├── dashboard/              # 儀表板
│   │   ├── profile/                # 個人資料
│   │   ├── services/               # 服務管理
│   │   ├── availability/           # 預約時段
│   │   ├── bookings/               # 訂單管理
│   │   ├── earnings/               # 收入報表
│   │   └── settings/               # 設定
│   └── (admin)/admin/              # 管理後台
│       ├── dashboard/              # 平台儀表板
│       ├── professionals/          # 職人審核
│       ├── bookings/               # 訂單管理
│       ├── catalog/                # 分類 / 服務管理
│       ├── resources/              # 資源（空間）管理
│       ├── reviews/                # 評價管理
│       └── settings/               # 平台設定
├── components/
│   ├── ui/                         # 基礎 UI 元件（14 個）
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Pagination.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── DataTable.tsx
│   ├── Navbar.tsx                  # 導覽列（依角色動態顯示）
│   ├── Footer.tsx                  # 頁尾
│   ├── SearchBar.tsx               # 搜尋列（300ms 防抖）
│   ├── FilterBar.tsx               # 篩選列（分類/價格/評分/排序）
│   ├── ProfessionalCard.tsx        # 職人卡片
│   ├── ServiceCard.tsx             # 服務卡片
│   ├── BookingStepper.tsx          # 預約步驟指示器
│   ├── CalendarPicker.tsx          # 日曆選擇器
│   ├── TimeSlotPicker.tsx          # 時段選擇器
│   ├── ReviewList.tsx              # 評價列表
│   └── StatsCards.tsx              # 統計卡片
├── lib/
│   ├── api.ts                      # Mock API 層（未來替換為真實 API）
│   ├── format.ts                   # 格式化工具（價格/日期/狀態）
│   ├── auth.ts                     # 客戶端認證（localStorage）
│   └── mock/                       # Mock 資料
│       ├── categories.ts           # 6 個業種分類
│       ├── services.ts             # 18 個服務項目
│       ├── professionals.ts        # 24 位職人
│       ├── bookings.ts             # 40 筆訂單
│       ├── reviews.ts              # 60 筆評價
│       ├── resources.ts            # 12 個空間資源
│       ├── users.ts                # 3 個測試帳號
│       └── index.ts
├── types/                          # TypeScript 型別定義
│   ├── category.ts
│   ├── service.ts
│   ├── professional.ts
│   ├── booking.ts
│   ├── review.ts
│   ├── resource.ts
│   ├── user.ts
│   └── index.ts
└── styles/
    └── globals.css                 # 全域樣式
```

---

## 三端功能說明

### 客人端 (Customer)

| 頁面 | 功能 |
|------|------|
| 首頁 `/` | Hero 搜尋、熱門分類、推薦職人、成為職人 CTA |
| 探索 `/explore` | 分類瀏覽、趨勢服務、精選評價 |
| 職人列表 `/professionals` | 篩選（分類/價格/評分/排序）、分頁、卡片瀏覽 |
| 職人詳情 `/professionals/[id]` | 個人資料、服務方案、作品集、評價、預約按鈕 |
| 服務列表 `/services` | 依分類瀏覽所有服務模板 |
| 預約流程 `/booking` | 四步驟：選服務 → 選日期 → 選時段 → 確認 |
| 確認付款 `/booking/confirm` | 預約摘要、填寫聯絡資訊、模擬付款 |
| 我的帳號 `/account` | 帳號總覽、下一筆預約、快捷入口 |
| 我的訂單 `/account/bookings` | 訂單列表、狀態篩選、取消/評價 |
| 我的評價 `/account/reviews` | 已撰寫的評價列表 |

### 職人端 (Professional)

| 頁面 | 功能 |
|------|------|
| 儀表板 `/pro/dashboard` | 今日訂單、月收入、評分統計 |
| 個人資料 `/pro/profile` | 編輯資料、管理作品集 |
| 服務管理 `/pro/services` | 啟停服務、自訂價格與時長 |
| 預約時段 `/pro/availability` | 週視圖時段管理、可預約/不可預約切換 |
| 訂單管理 `/pro/bookings` | 訂單列表、狀態篩選、確認/完成/未到操作 |
| 收入報表 `/pro/earnings` | 月收入長條圖、交易明細表 |
| 設定 `/pro/settings` | 通知偏好、付款方式 |

### 管理員端 (Admin)

| 頁面 | 功能 |
|------|------|
| 儀表板 `/admin/dashboard` | GMV、訂單量、職人數、使用率、近期訂單 |
| 職人管理 `/admin/professionals` | 審核（核准/拒絕/停權）、狀態篩選 |
| 訂單管理 `/admin/bookings` | 全平台訂單、狀態調整、退款操作 |
| 分類管理 `/admin/catalog/categories` | 新增/編輯/停用分類 |
| 服務管理 `/admin/catalog/services` | 新增/編輯服務模板 |
| 資源管理 `/admin/resources` | 空間資源 CRUD（美容台/按摩室等） |
| 評價管理 `/admin/reviews` | 評價列表、評分篩選、隱藏操作 |
| 平台設定 `/admin/settings` | 服務費率、取消政策、預約規則 |

---

## Mock 資料

| 資料 | 數量 |
|------|------|
| 業種分類 | 6（寵物美容/按摩/美甲/刺青/健身/芳療） |
| 服務項目 | 18（每業種 3 個） |
| 職人 | 24（寵物美容 10 位，其餘分散） |
| 訂單 | 40（含多種狀態） |
| 評價 | 60（分散於不同職人） |
| 空間資源 | 12（美容台/洗澡台/烘毛區/按摩室/多功能室） |

---

## API 介面（`lib/api.ts`）

所有資料操作透過 `lib/api.ts` 統一呼叫，目前以 Mock Data 模擬。未來接入真實 API 時，只需替換此檔案內的實作。

```typescript
// 分類
getCategories(): Promise<Category[]>
getCategoryByKey(key: string): Promise<Category | undefined>

// 服務
getServices(categoryId?: string): Promise<Service[]>
getService(id: string): Promise<Service | undefined>

// 職人
getProfessionals(filters?): Promise<Professional[]>
getProfessional(id: string): Promise<Professional | undefined>
approveProfessional(id: string): Promise<Professional>
suspendProfessional(id: string): Promise<Professional>

// 訂單
getBookings(filters?): Promise<Booking[]>
getBooking(id: string): Promise<Booking | undefined>
createBooking(payload): Promise<Booking>
updateBookingStatus(id, status): Promise<Booking>
updatePaymentStatus(id, status): Promise<Booking>

// 評價
getReviews(professionalId?: string): Promise<Review[]>
createReview(payload): Promise<Review>

// 資源
getResources(): Promise<Resource[]>
createResource(payload): Promise<Resource>
updateResource(id, data): Promise<Resource>
deleteResource(id): Promise<void>
```

---

## 部署至 Cloudflare Pages

1. 將專案推送至 GitHub
2. 前往 [Cloudflare Pages](https://pages.cloudflare.com/) 建立新專案
3. 連結 GitHub 儲存庫
4. 設定：
   - **Framework preset**: Next.js
   - **Build command**: `npx next build`
   - **Output directory**: `.next`
5. 部署完成後即可使用自訂網域

---

## 開發注意事項

- 所有列表頁皆有 **Loading Skeleton → Empty State → Data** 三態處理
- 表單皆有基本驗證（必填、格式檢查）
- 預約流程不可跳步（Stepper 控制）
- 價格顯示為 `NT$` 格式
- 日期時間依本地時區顯示
- Navbar 依登入角色動態顯示對應入口
- 進入 `/pro` 或 `/admin` 時自動檢查權限，不符則導回登入頁

---

## 授權

私有專案，僅供內部使用。
