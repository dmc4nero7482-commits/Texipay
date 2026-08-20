# 計程跳表 · 網頁版（可上 GitHub 測試）

這是計程跳表的**網頁版**，用來上傳到 GitHub 後直接在瀏覽器／手機上跑起來測試功能，不用編譯或安裝 APK。計費公式與預設值和原生 App（`../IGreatMeter`、`../TWTaxi`）完全一致，是照原本 `com.igreat.taxi` 反編譯還原的模型。

架構參考 `scoreboard` 專案：單檔 HTML 的 PWA（可安裝、可離線），並保留 Capacitor 設定以便日後包成 APK。

## 內容

| 檔案 | 用途 |
|---|---|
| `taxi.html` | App 本體（原味／台灣兩種計價可切換、真 GPS、即時匯率、跳表音效） |
| `index.html` | 進入點，轉址到 `taxi.html` |
| `manifest.json` / `sw.js` / `icon.svg` | PWA（安裝、離線、圖示） |
| `capacitor.config.json` / `package.json` / `scripts/` | 選用：用 Capacitor 包成 Android APK（同 scoreboard） |

## 功能

- **兩種計價**：上方切「原味（5 項）」／「台灣三段式」，費率預設值同原生 App，設定頁可改。
- **距離來源**：
  - **GPS**（預設）：用手機 GPS 即時抓距離與車速跳表。需 HTTPS（GitHub Pages 就是 HTTPS）並允許定位權限。
  - **模擬**：用滑桿設定車速模擬行駛，方便在電腦上測試。
- **即時匯率**：基準 NT$，可切換顯示人民幣／美元／日圓等，自動連線抓即時匯率（免金鑰 API），抓不到時用最後快取值。
- **跳表音效**：設定頁可開關，用的是原 App 的音效檔。
- **可安裝離線**：加到主畫面後可離線開啟（匯率需連網更新）。

## 上傳到 GitHub 並開始測試

1. 把這個 `web` 資料夾的內容放到一個 GitHub repo（可新開一個 repo，或用 GitHub 網頁「Add file → Upload files」直接上傳這些檔案到 repo 根目錄）。
2. repo → **Settings → Pages → Build and deployment → Source 選 "Deploy from a branch"**，Branch 選 `main`、資料夾選 `/ (root)`，儲存。
3. 等一兩分鐘，GitHub 會給你一個網址（形如 `https://<帳號>.github.io/<repo>/`）。
4. **用手機瀏覽器開這個網址** → 按「開始」→ 允許定位 → 就能邊走邊跳表。或先在電腦上把「距離來源」切成「模擬」拉車速測試。

> GPS 一定要透過 https 網址（GitHub Pages 提供）才能用；直接用 `file://` 打開本機檔案時 GPS 會被瀏覽器擋，但「模擬」模式仍可用。

## 本機預覽（選用）

任一靜態伺服器即可，例如：

```bash
cd web
npx serve .        # 或 python -m http.server
```

然後開 `http://localhost:3000/taxi.html`。

## 選用：包成 Android APK（同 scoreboard 流程）

```bash
cd web
npm install
npx cap add android
npm run sync          # 複製網頁到 www/ 並同步 Capacitor
cd android && ./gradlew assembleDebug
```

APK 於 `android/app/build/outputs/apk/debug/`。（GPS 需在產生的 AndroidManifest 加入 `ACCESS_FINE_LOCATION` 權限。）

## 與原生 App 的關係

- `../IGreatMeter`、`../TWTaxi` 是主線的原生 Kotlin App（忠實還原原本 App）。
- 這個網頁版是同一套計費邏輯的可攜／可測試版本，方便放 GitHub 直接跑。
