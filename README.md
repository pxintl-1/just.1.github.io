# just.1.github.io
# ʚ𝑳𝑶𝑽𝑬ɞ 數據備份與還原模組

本專案的前端數據全數儲存於瀏覽器本地端的 `IndexedDB` 中，為了防止瀏覽器快取被清理導致聊天紀錄或設定遺失，本模組提供**一鍵打包下載**與**數據還原**功能。

## 📂 檔案目錄說明

- `index.html` : 專案主頁面，已引入 `localforage` 與 `jszip` 核心庫。
- `js/backup-engine.js` : 本次新增的備份核心邏輯。

## 🛠️ 安裝與對接步驟

1. **放置 JS 檔案**：將 `backup-engine.js` 檔案放入專案的 `js/` 資料夾內。
2. **在 HTML 中引入**：請確保 `index.html` 底部引入了此指令碼：
   ```html
   <script src="js/config.js"></script>
   <script src="js/utils.js"></script>
   <script src="js/backup-engine.js"></script> ```
3. **綁定按鈕事件**：在前端 UI 介面的備份按鈕上綁定對應的點擊事件：
   - 下載按鈕：`onclick="exportToZIP()"`
   - 上傳 Input：`<input type="file" onchange="importBackup(event)" accept=".zip,.json">`

## ⚠️ 注意事項

- 資料庫預設 Name Space 為 `ZmilkChatData`，若有變更，請同步修改 `js/backup-engine.js` 中的 `name` 欄位。
- 支援還原由本系統導出的 `.zip` 整體快取壓縮包，或是符合欄位格式的單一 `.json` 檔案。
