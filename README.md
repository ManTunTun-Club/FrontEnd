# 版本

本專案使用 React Native 0.82.x (New Architecture)。

## 1. JavaScript 環境

- **Node.js:** `v20.x` (LTS/Iron)
    - (安裝 nvm 後，在專案根目錄執行 `nvm use` 即可自動切換)
- **Package Manager:** `npm`
    - (請勿使用 yarn 或 cnpm)

## 2. iOS 原生環境 (macOS)

- **Xcode:** `16.1` 或更新版本
    - (React Native 0.81+ 已要求 Xcode 16.1+)
- **CocoaPods:** `1.15.x` 或更新版本
    - (安裝指令: `sudo gem install cocoapods` 或 `brew install cocoapods`)

## 3. Android 原生環境 (macOS / Windows / Linux)

- **Java Development Kit (JDK):** `JDK 17`
    - (官方推薦 `Azul Zulu 17`。Android Gradle Plugin 8.x 已強制要求 JDK 17)
- **Android Studio:** 2024.x (Koala) 或 2025.x (Narwhal)
- **Android SDK:**
    - **Compile SDK Version:** `36` (Android 16)
    - **Target SDK Version:** `36` (Android 16)
    - **Min SDK Version:** `24` (Android 7.0)
    
# 檔案架構

```bash
/src
|
|-- /assets            # 靜態資源 (圖片, 字體)
|
|-- /components        # 1. 全域共用組建 (Shared Components)
|   |-- /common        #    - 原子組建 (Button, Input, Icon, Card)
|   |-- /layout        #    - 佈局組建 (Container, Header, Grid)
|
|-- /features          # 2. 功能模組 (等同於「頁面」的集合)
|   |
|   |-- /Auth          #    - (例如：認證功能)
|   |   |-- /components  #  - 3. 局部組建 (Auth 專用, e.g., LoginForm)
|   |   |-- /screens     #  - 2. 頁面 (LoginScreen, RegisterScreen)
|   |   |-- /services    #  - (Auth 相關的 API 邏輯)
|   |   `-- index.js     #  - (導出此模組)
|   |
|   |-- /Home          #    - (例如：首頁功能)
|   |   |-- /components  #  - 3. 局部組建 (Home 專用, e.g., PostList)
|   |   |-- /screens     #  - 2. 頁面 (HomeScreen)
|   |   `-- index.js
|   |
|   `-- /Profile       #    - (例如：個人資料功能)
|       |-- /components  #  - 3. 局部組建 (Profile 專用, e.g., ProfileHeader)
|       |-- /screens     #  - 2. 頁面 (ProfileScreen, EditProfileScreen)
|       `-- index.js
|
|-- /navigation        # 導航 (React Navigation stacks, tabs)
|
|-- /services          # 共用的 API 服務 (e.g., axios instance)
|
|-- /store             # 狀態管理 (Redux, Zustand, etc.)
|
|-- /theme             # 主題, 樣式, 顏色, 尺寸
|
|-- /utils             # 共用工具函式 (formatters, validators)
|
`-- App.js             # 應用程式進入點
```

## 重點說明

### /src 內層結構 (JavaScript 專案)

1. `/assets`
    - **定義：** 靜態資源目錄。
    - **功能：** 存放圖片（.png, .jpg）、字體（.ttf）等非程式碼檔案。
2. `/components`
    - **定義：** 全域共用組建。
    - **功能：** 存放高複用性、純粹的 UI 組建（如 `Button`, `Input`, `Card`）。
    - **協作重點 (JS)：**
        - 檔案應使用 `.js` 結尾。
        - **必須使用 `PropTypes`** 來定義傳入的 `props` 型別。這是 JavaScript 專案在多人協作時，確保組件被正確使用的最重要防線。
        - 應避免在此層撰寫業務邏輯或呼叫 API。
3. `/features`
    - **定義：** 功能模組化目錄。這是多人協作的核心。
    - **功能：** 將 App 依「功能」垂直切割（如 `Auth`, `Home`, `Profile`）。
    - **協作重點 (JS)：**
        - 團隊成員可以「認領」各自的 feature 資料夾進行開發，**最大程度地減少程式碼合併衝突 (Merge Conflicts)**。
        - 嚴格遵守「高內聚」：`Profile` 模組不應直接 `import` `Home` 模組的內部檔案。
4. `/features/[FeatureName]/screens`
    - **定義：** 頁面 (Screens)。
    - **功能：** 實際在導航器 (Navigator) 中註冊的頁面。
    - **職責：** 組合「共用組建」和「局部組建」；處理該頁面的狀態與資料請求。
5. `/features/[FeatureName]/components`
    - **定義：** 局部組建 (Local Components)。
    - **功能：** 存放「僅供」目前這個功能（Feature）使用的組建（如 `ProfileHeader`）。
    - **規則：** 如果一個組建需要被其他 feature 使用，就應將其提升到 `/src/components`。
6. `/navigation`
    - **定義：** 導航配置中心。
    - **功能：** 集中管理 React Navigation 的 Stacks, Tabs。
    - **職責：** 定義 App 的畫面流程。
7. `/services`
    - **定義：** 全域共用服務。
    - **功能：** 存放與外部溝通的邏輯，最主要是 API 請求 (如 `apiClient.js`，用於封裝 `axios` 或 `fetch` 的設定)。
8. `/store` (或 `/state`)
    - **定義：** 全域狀態管理。
    - **功能：** 存放 Redux, Zustand 或 Context API 的設定。
    - **職責：** 管理跨功能模組的共享狀態（如使用者登入資訊）。
9. `/theme` (或 `/styles`)
    - **定義：** 全域樣式與主題。
    - **功能：** 集中定義 App 的色票（`colors.js`）、字體大小（`typography.js`）、間距（`spacing.js`）等，確保視覺一致性。
10. `/utils`
    - **定義：** 共用工具函式 (Utility Functions)。
    - **功能：** 存放與業務邏輯無關的純函式（如日期格式化 `dateFormatter.js`、驗證器 `validator.js`）。
11. `/App.js`
    - **定義：** 應用程式進入點。
    - **功能：** 載入最外層的 Providers（如 Redux Provider, NavigationContainer）並渲染主導航器。