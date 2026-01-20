# 系統分析文件 (SA Document) - IVV-PMIS 專案管理資訊系統

## 1. 專案概述 (Project Overview)
IVV-PMIS (Independent Verification and Validation - Project Management Information System) 是一個為現代團隊打造的高效專案管理平台。它集成了任務追蹤、專案協作、工作空間管理及即時通知等功能，旨在提升團隊生產力與專案透明度。本系統採用現代化 Web 架構，強調使用者體驗 (UI/UX) 與系統安全性。

## 2. 系統架構 (System Architecture)
本系統採用前後端分離架構，前端使用 Next.js 框架，後端服務基於 Appwrite 提供的 Serverless 風格 API，並結合 Hono 進行輕量級路由處理。

```mermaid
graph TD
    User[使用者] -->|HTTPS| Frontend[前端應用 (Next.js 14)]
    Frontend -->|RPC/API Calls| Backend[後端服務層 (Hono / Node.js)]
    
    subgraph Frontend Logic
        ReactQuery[React Query (狀態管理)]
        Nuqs[Nuqs (URL 狀態同步)]
        Shadcn[Shadcn UI (介面元件)]
    end
    
    subgraph Backend Services
        Auth[認證服務 (Auth)]
        DB[資料庫服務 (Database)]
        Storage[檔案儲存 (Storage)]
        Audit[稽核日誌 (Audit Logs)]
    end
    
    Frontend --- ReactQuery
    Frontend --- Nuqs
    Frontend --- Shadcn
    
    Backend -->|SDK| Auth
    Backend -->|SDK| DB
    Backend -->|SDK| Storage
    Backend -->|SDK| Audit
```

## 3. 功能模組 (Functional Modules)

### 3.1 認證與授權 (Authentication & Authorization)
*   **使用者註冊/登入**：支援 Email/Password 及 OAuth (Google/GitHub) 登入。
*   **帳戶管理**：使用者可管理個人資料 (姓名、頭像) 及變更密碼。
*   **權限控制**：基於工作空間 (Workspace) 的 RBAC (Role-Based Access Control)，區分管理員 (Admin) 與一般成員 (Member)。

### 3.2 工作空間管理 (Workspace Management)
*   **多工作空間支援**：單一使用者可建立或加入多個工作空間。
*   **成員邀請**：透過邀請碼 (Invite Code) 或連結邀請成員加入。
*   **設定管理**：管理員可修改工作空間資訊、重設邀請碼或刪除工作空間 (具備防呆機制)。

### 3.3 專案管理 (Project Management)
*   **專案建立**：在工作空間下創建專案，支援設定封面圖與詳細描述。
*   **專案儀表板**：檢視專案進度摘要、任務統計。

### 3.4 任務管理 (Task Management)
*   **多視圖切換**：
    *   **表格視圖 (Table)**：適合大量資料檢視與排序。
    *   **看板視圖 (Kanban)**：拖拉式介面，適合敏捷開發流程。
    *   **行事曆視圖 (Calendar)**：以月/週為單位的任務排程。
    *   **時間軸視圖 (Timeline)**：甘特圖形式，檢視任務起訖與依賴。
*   **任務詳情**：設定指派人、到期日、優先級、狀態與詳細描述。
*   **全域搜尋**：跨專案搜尋任務。

### 3.5 協作與通知 (Collaboration & Notification)
*   **活動紀錄 (Audit Logs)**：記錄關鍵操作 (如建立任務、修改狀態)，並透過通知中心顯示。
*   **即時反饋**：操作成功/失敗的 Toast 提示。

## 4. 非功能性需求 (Non-Functional Requirements)
*   **效能 (Performance)**：
    *   首屏載入時間 < 1.5 秒 (Next.js SSR/ISR 優化)。
    *   API 回應時間 < 300ms。
    *   使用 Skeleton Loading 優化視覺體感等待時間。
*   **安全性 (Security)**：
    *   所有 API 傳輸強制使用 HTTPS。
    *   敏感操作 (如刪除工作空間) 需二次確認。
    *   資料庫層級的存取控制 (RLS)。
*   **可用性 (Usability)**：
    *   RWD 響應式設計，支援 Desktop 與 Mobile。
    *   支援繁體中文 (zh-TW) 介面。
    *   提供深色/淺色模式 (依系統設定或手動切換)。
