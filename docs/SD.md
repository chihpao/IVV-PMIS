# 系統設計文件 (SD Document) - IVV-PMIS 專案管理資訊系統

## 1. 前端架構設計 (Frontend Architecture)

### 1.1 目錄結構 (Directory Structure)
採用 Feature-based 架構，將功能模組化以利維護。

```
src/
├── app/                  # Next.js App Router (頁面路由)
│   ├── (auth)/           # 認證相關頁面 (layoutGroup)
│   ├── (dashboard)/      # 主儀表板頁面 (layoutGroup)
│   │   ├── layout.tsx    # 全域 Dashboard 佈局 (Sidebar, Navbar)
│   │   ├── page.tsx      # 首頁
│   │   ├── workspaces/   # 工作空間相關路由
│   │   └── settings/     # 設定頁面 (已整合至 Modal，此路由保留或移除視需求)
│   └── api/              # Route Handlers (Appwrite SSR Proxy)
├── components/           # 全域共用元件 (UI Kit)
│   ├── ui/               # Shadcn UI 原子元件 (Button, Input, Skeleton...)
│   └── ...               # 複合元件 (Navbar, Sidebar...)
├── features/             # 功能模組 (核心商業邏輯)
│   ├── auth/             # 認證模組 (Login, Register, UserButton...)
│   ├── workspaces/       # 工作空間模組 (CRUD, Switcher...)
│   ├── projects/         # 專案模組
│   ├── tasks/            # 任務模組 (Kanban, Calendar, Table Views...)
│   ├── members/          # 成員管理模組
│   └── audit-logs/       # 稽核日誌模組
├── hooks/                # 全域 Custom Hooks
├── lib/                  # 工具函式庫 (Appwrite Client, Utils)
└── messages/             # i18n 翻譯檔 (zh-TW.json)
```

### 1.2 核心技術棧 (Tech Stack)
*   **Framework**: Next.js 14 (App Router)
*   **UI Library**: React 18, Radix UI, Tailwind CSS
*   **Component System**: Shadcn UI (可客製化元件庫)
*   **State Management**: Nuqs (URL State), React Query (Server State)
*   **Form Handling**: React Hook Form + Zod (Validation)
*   **Charts/Visuals**: Recharts (圖表), FullCalendar (行事曆)

## 2. 資料庫設計 (Database Design)
使用 Appwrite Database，主要 Collections (集合) 定義如下：

### 2.1 Workspaces (工作空間)
| 欄位名稱 | 型別 | 說明 |
| :--- | :--- | :--- |
| `$id` | string | Unique ID |
| `name` | string | 工作空間名稱 |
| `imageUrl` | string | 圖示 URL (Optional) |
| `inviteCode` | string | 邀請碼 (用於加入工作空間) |
| `userId` | string | 擁有者 ID (關聯 Appwrite Auth) |

### 2.2 Members (成員)
| 欄位名稱 | 型別 | 說明 |
| :--- | :--- | :--- |
| `$id` | string | Unique ID |
| `workspaceId` | string | 所屬工作空間 ID |
| `userId` | string | 使用者 ID |
| `name` | string | 成員顯示名稱 |
| `email` | string | 成員 Email |
| `role` | enum | 角色 (`ADMIN`, `MEMBER`) |

### 2.3 Projects (專案)
| 欄位名稱 | 型別 | 說明 |
| :--- | :--- | :--- |
| `$id` | string | Unique ID |
| `name` | string | 專案名稱 |
| `workspaceId` | string | 所屬工作空間 ID |
| `imageUrl` | string | 專案封面圖 URL |

### 2.4 Tasks (任務)
| 欄位名稱 | 型別 | 說明 |
| :--- | :--- | :--- |
| `$id` | string | Unique ID |
| `name` | string | 任務標題 |
| `status` | enum | 狀態 (`BACKLOG`, `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) |
| `workspaceId` | string | 所屬工作空間 ID |
| `projectId` | string | 所屬專案 ID |
| `assigneeId` | string | 指派對象 (關聯 Member) |
| `dueDate` | datetime | 到期日 |
| `description` | string | 詳細描述 (HTML/Markdown) |
| `position` | integer | 排序權重 (用於看板拖拉) |

## 3. API 設計 (API Design)
後端採用 Hono RPC 風格，透過 Appwrite SDK 與資料庫互動。

### 3.1 Auth 相關
*   `POST /api/sign-in`: 使用者登入
*   `POST /api/sign-up`: 使用者註冊
*   `POST /api/sign-out`: 登出
*   `GET /api/current`: 取得當前使用者資訊

### 3.2 Workspace 相關
*   `GET /api/workspaces`: 取得工作空間列表
*   `POST /api/workspaces`: 建立工作空間
*   `PATCH /api/workspaces/:workspaceId`: 更新工作空間
*   `DELETE /api/workspaces/:workspaceId`: 刪除工作空間
*   `POST /api/workspaces/:workspaceId/join`: 加入工作空間

### 3.3 Task 相關
*   `GET /api/tasks`: 取得任務列表 (支援 Filter)
*   `POST /api/tasks`: 建立任務
*   `PATCH /api/tasks/:taskId`: 更新任務 (狀態、內容、位置)
*   `DELETE /api/tasks/:taskId`: 刪除任務

## 4. 介面與體驗設計 (UI/UX Design)

### 4.1 設計規範 (Design System)
*   **配色 (Color Palette)**:
    *   Primary: 品牌主色 (藍/紫色系)
    *   Neutral: 用於文字、邊框、背景的灰階
    *   Semantic: Success (綠), Warning (黃), Error (紅), Info (藍)
*   **字體 (Typography)**: 支援繁體中文顯示優化 (Inter, System Fonts)。
*   **圓角與間距**: 統一使用 `0.5rem (8px)` 系統，保持視覺一致性 (部分元件採直角 `rounded-none` 風格)。

### 4.2 互動體驗 (Interaction)
*   **Loading State**: 使用 Skeleton 取代傳統 Spinner，減少視覺跳動。
*   **Modal/Dialog**: 使用攔截路由或 Overlay 呈現複雜表單，保持上下文。
*   **Drag & Drop**: 看板視圖支援流暢的拖曳排序與狀態變更。
*   **RWD**: 側邊欄 (Sidebar) 在行動裝置可收折為漢堡選單。
