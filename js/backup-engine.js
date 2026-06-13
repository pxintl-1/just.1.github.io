/**
 * 系統數據備份引擎 (js/backup-engine.js)
 * 負責處理 LocalForage 資料庫的 ZIP 壓縮下載與還原
 */

// 綁定本地快取庫 (名稱需與專案 config.js 保持一致)
const backupStore = localforage.createInstance({
    name: "ZmilkChatData",
    storeName: "app_core_state"
});

/**
 * 功能 A：將所有本地快取資料打包下載為 ZIP 檔
 */
async function exportToZIP() {
    try {
        const keys = await backupStore.keys();
        if (keys.length === 0) {
            alert("本地目前沒有任何快取數據可供備份！");
            return;
        }

        const zip = new JSZip();
        
        // 遍歷所有 Key 轉為 JSON 檔案塞入 ZIP
        for (const key of keys) {
            const value = await backupStore.getItem(key);
            zip.file(`${key}.json`, JSON.stringify(value, null, 2));
        }

        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        
        // 觸發瀏覽器下載
        const a = document.createElement('a');
        a.href = url;
        a.download = `zmilk_backup_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log("備份打包成功！");
    } catch (err) {
        alert("下載備份失敗: " + err.message);
    }
}

/**
 * 功能 B：讀取上傳的 ZIP 或單一 JSON 檔案並覆蓋還原
 * @param {Event} event - 檔案上傳事件
 */
async function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        // 情況一：上傳的是整個 ZIP 包
        if (file.name.endsWith('.zip')) {
            const zip = await JSZip.loadAsync(file);
            for (const [filename, fileObj] of Object.entries(zip.files)) {
                if (fileObj.dir) continue;
                
                const content = await fileObj.async("text");
                const key = filename.replace('.json', ''); // 去除副檔名當作 Key
                await backupStore.setItem(key, JSON.parse(content));
            }
            alert("ZIP 數據恢復完成！請重新整理網頁。");
        } 
        // 情況二：上傳的是單一 JSON 檔案
        else if (file.name.endsWith('.json')) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = JSON.parse(e.target.result);
                // 批次寫入 JSON 中的所有主鍵
                for (const [key, val] of Object.entries(data)) {
                    await backupStore.setItem(key, val);
                }
                alert("JSON 數據恢復完成！請重新整理網頁。");
            };
            reader.readAsText(file);
        }
    } catch (err) {
        alert("解析或還原失敗，請檢查檔案結構是否正確。");
    } finally {
        event.target.value = ''; // 清空選取器狀態
    }
}
