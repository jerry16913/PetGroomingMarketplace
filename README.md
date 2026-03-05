# PetGroomingMarketplace - 寵物美容預約平台

一站式寵物美容預約 Marketplace 平台，提供客人預約、美容師管理、平台營運三端完整 UI，支援空間資源（美容台、洗澡台、烘毛區）自動分配與時段管理。

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
| 美容師 (Groomer) | `pro@test.com` | 任意輸入 |
| 管理員 (Admin) | `admin@test.com` | 任意輸入 |

登入後依角色自動導向對應後台。

---

## 專案結構

```
├── app/
│   ├── layout.tsx                  # 根 Layout（ToastProvider）
│   ├── (public)/                   # 公開端（含 Navbar + Footer）
│   │   ├── page.tsx                # 首頁（導向 /groomers）
│   │   ├── explore/                # 探索頁
│   │   ├── groomers/               # 美容師列表 + 詳情
│   │   ├── pet-services/           # 寵物服務列表
│   │   ├── booking/                # 預約流程 + 確認付款
│   │   ├── account/                # 帳號總覽 / 訂單 / 評價 / 寵物
│   │   └── auth/                   # 登入 / 註冊
│   ├── (pro)/pro/                  # 美容師後台
│   │   ├── dashboard/              # 儀表板
│   │   ├── profile/                # 個人資料
│   │   ├── services/               # 服務管理
│   │   ├── availability/           # 預約時段
│   │   ├── bookings/               # 訂單管理
│   │   ├── earnings/               # 收入報表
│   │   └── settings/               # 設定
│   └── (admin)/admin/              # 管理後台
│       ├── dashboard/              # 平台儀表板
│       ├── professionals/          # 美容師審核
│       ├── bookings/               # 訂單管理
│       ├── catalog/                # 分類 / 服務管理
│       ├── resources/              # 資源（空間）管理
│       ├── reviews/                # 評價管理
│       └── settings/               # 平台設定
├── components/
│   ├── ui/                         # 基礎 UI 元件（15 個）
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DataTable.tsx
│   │   ├── Dropdown.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Pagination.tsx
│   │   ├── Select.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Tabs.tsx
│   │   ├── Textarea.tsx
│   │   └── Toast.tsx
│   ├── AppLayout.tsx               # 後台共用 Layout
│   ├── BookingStepper.tsx          # 預約步驟指示器
│   ├── CalendarPicker.tsx          # 日曆選擇器
│   ├── FilterBar.tsx               # 篩選列
│   ├── Footer.tsx                  # 頁尾
│   ├── GroomerCard.tsx             # 美容師卡片
│   ├── Navbar.tsx                  # 導覽列（依角色動態顯示）
│   ├── ResourceAutoAssignPanel.tsx # 資源自動分配面板
│   ├── ResourceBadge.tsx           # 資源標籤
│   ├── ReviewList.tsx              # 評價列表
│   ├── SearchBar.tsx               # 搜尋列
│   ├── ServiceCard.tsx             # 服務卡片
│   ├── StatsCards.tsx              # 統計卡片
│   └── TimeSlotPicker.tsx          # 時段選擇器
├── lib/
│   ├── api.ts                      # Mock API 層（未來替換為真實 API）
│   ├── auth.ts                     # 客戶端認證（localStorage）
│   ├── format.ts                   # 格式化工具（價格/日期/狀態）
│   └── mock/                       # Mock 資料
│       ├── bookings.ts             # 訂單
│       ├── categories.ts           # 分類（寵物美容）
│       ├── groomers.ts             # 美容師
│       ├── index.ts
│       ├── pets.ts                 # 寵物
│       ├── resources.ts            # 空間資源
│       ├── reviews.ts              # 評價
│       ├── serviceResourceRules.ts  # 服務與資源關聯規則
│       ├── services.ts             # 服務項目
│       └── users.ts                # 測試帳號
├── types/                          # TypeScript 型別定義
│   ├── booking.ts
│   ├── category.ts
│   ├── groomer.ts
│   ├── index.ts
│   ├── pet.ts
│   ├── resource.ts
│   ├── review.ts
│   ├── service.ts
│   ├── serviceResourceRule.ts
│   └── user.ts
└── styles/
    └── globals.css                 # 全域樣式
```

---

## 三端功能說明

### 客人端 (Customer)

| 頁面 | 功能 |
|------|------|
| 首頁 `/` | 自動導向美容師列表 |
| 探索 `/explore` | 分類瀏覽、趨勢服務、精選評價 |
| 美容師列表 `/groomers` | 篩選（評分/價格/排序）、分頁、卡片瀏覽 |
| 美容師詳情 `/groomers/[id]` | 個人資料、服務方案、作品集、評價、預約按鈕 |
| 寵物服務 `/pet-services` | 依分類瀏覽所有服務模板 |
| 預約流程 `/booking` | 四步驟：選服務 → 選日期 → 選時段 → 確認 |
| 確認付款 `/booking/confirm` | 預約摘要、填寫聯絡資訊、選擇寵物、模擬付款 |
| 我的帳號 `/account` | 帳號總覽、下一筆預約、快捷入口 |
| 我的訂單 `/account/bookings` | 訂單列表、狀態篩選、取消/評價 |
| 我的寵物 `/account/pets` | 寵物管理（新增/編輯/刪除） |
| 我的評價 `/account/reviews` | 已撰寫的評價列表 |

### 美容師端 (Groomer)

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
| 儀表板 `/admin/dashboard` | GMV、訂單量、美容師數、使用率、近期訂單 |
| 美容師管理 `/admin/professionals` | 審核（核准/拒絕/停權）、狀態篩選 |
| 訂單管理 `/admin/bookings` | 全平台訂單、狀態調整、退款操作 |
| 分類管理 `/admin/catalog/categories` | 新增/編輯/停用分類 |
| 服務管理 `/admin/catalog/services` | 新增/編輯服務模板 |
| 資源管理 `/admin/resources` | 空間資源 CRUD（美容台/洗澡台/烘毛區） |
| 評價管理 `/admin/reviews` | 評價列表、評分篩選、隱藏操作 |
| 平台設定 `/admin/settings` | 服務費率、取消政策、預約規則 |

---

## 空間資源與自動分配

平台支援三類空間資源：

| 類型 | 說明 | 範例 |
|------|------|------|
| `groom_table` | 美容台 | 美容台 1、美容台 2 |
| `bath` | 洗澡台 | 洗澡台 1、洗澡台 2 |
| `dryer` | 烘毛區 | 烘毛區 1、烘毛區 2 |

每項服務透過 **服務資源規則**（`serviceResourceRules`）定義所需資源類型與數量。預約建立時，系統會自動檢查時段衝突並分配可用資源；若資源不足則回傳 `RESOURCE_UNAVAILABLE`。

---

## Mock 資料

| 資料 | 數量 |
|------|------|
| 分類 | 1（寵物美容） |
| 服務項目 | 18（狗狗洗澡、狗狗美容、貓咪美容、小型犬美容等） |
| 美容師 | 多位（含作品集、服務方案、評分） |
| 訂單 | 多筆（含多種狀態） |
| 評價 | 分散於不同美容師 |
| 空間資源 | 美容台、洗澡台、烘毛區 |
| 寵物 | 測試用寵物資料 |

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

// 美容師
getGroomers(filters?): Promise<Groomer[]>
getGroomer(id: string): Promise<Groomer | undefined>
approveGroomer(id: string): Promise<Groomer>
suspendGroomer(id: string): Promise<Groomer>

// 寵物
getPets(ownerId: string): Promise<Pet[]>
getPet(id: string): Promise<Pet | undefined>
createPet(payload): Promise<Pet>
updatePet(id, data): Promise<Pet>
deletePet(id: string): Promise<void>

// 服務資源規則
getServiceResourceRules(): Promise<ServiceResourceRule[]>
getServiceResourceRule(serviceId: string): Promise<ServiceResourceRule | undefined>

// 資源自動分配
autoAssignResources(serviceId, startAt, endAt): Promise<{ assignedIds, assignments }>

// 訂單
getBookings(filters?): Promise<Booking[]>
getBooking(id: string): Promise<Booking | undefined>
createBooking(payload): Promise<Booking>
updateBookingStatus(id, status): Promise<Booking>
updatePaymentStatus(id, status): Promise<Booking>

// 評價
getReviews(groomerId?: string): Promise<Review[]>
createReview(payload): Promise<Review>

// 資源
getResources(): Promise<Resource[]>
createResource(payload): Promise<Resource>
updateResource(id, data): Promise<Resource>
toggleResourceActive(id: string): Promise<Resource>
deleteResource(id: string): Promise<void>
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
- 預約時支援選擇寵物，並自動分配空間資源

---

## 授權

私有專案，僅供內部使用。
