# Git 協作開發流程

## 📚 快速導航

- [開發流程](#開發流程)
- [每次開始工作前](#每次開始工作前)
- [提交 PR 前檢查](#提交-pr-前檢查)
- [新功能發布後處理](#新功能發布後處理)
- [衝突處理](#衝突處理)
- [常見問題](#常見問題)

---

## 開發流程

### 1. 開始新功能

```bash
# 更新最新代碼
git fetch origin

# 從 test 分支創建新的 feature 分支
git checkout origin/test
git checkout -b feature/你的名字-功能描述

# 範例：
# git checkout -b feature/john-login
# git checkout -b feature/mary-dashboard
```

### 2. 開發階段

```bash
# 寫代碼...

# 隨時提交（建議每完成一個小功能就 commit）
git add .
git commit -m "feat: 簡短描述你做了什麼"

# 推送到遠端（備份）
git push origin feature/你的分支名
```

### 3. 提交 Pull Request

```bash
# 確保代碼已推送
git push origin feature/你的分支名

# 到 GitHub 網頁：
# 1. 點擊 "Pull requests"
# 2. 點擊 "New pull request"
# 3. Base: test, Compare: feature/你的分支名
# 4. 填寫 PR 說明
# 5. 請隊友 review
```

### 4. Merge 後

- ✅ Feature 分支會自動刪除
- ✅ 繼續開發下一個功能

---

## 每次開始工作前

**⚠️ 重要：每次開始寫代碼前都要做這個！**

```bash
# 1. 獲取最新的遠端資訊
git fetch origin

# 2. 切換到你的 feature 分支
git checkout feature/你的分支名

# 3. Rebase 到最新的 test
git rebase origin/test

# 4. 如果有衝突，解決後繼續（見下方「衝突處理」）
# 如果沒有衝突，直接推送

# 5. 強制推送（因為 rebase 改變了歷史）
git push origin feature/你的分支名 --force
```

**為什麼要這樣做？**
- ✅ 避免累積太多衝突
- ✅ 確保你的代碼建立在最新版本上
- ✅ 讓最後 merge 更順利

**多久做一次？**
- 每次開始寫代碼前
- 建議：至少每天一次

---

## 提交 PR 前檢查

### 自我檢查清單

```bash
# ✅ 1. 確保已 rebase 到最新
git fetch origin
git rebase origin/test

# ✅ 2. 測試你的代碼
npm test          # 或其他測試命令
npm run lint      # 檢查代碼風格

# ✅ 3. 確認沒有遺留的 debug 代碼
# - console.log()
# - 註解掉的代碼
# - TODO 標記

# ✅ 4. 檢查 commit message 是否清楚
git log --oneline -5

# ✅ 5. 推送最新版本
git push origin feature/你的分支名
```

### PR 描述應該包含

```markdown
## 做了什麼
簡短描述這個 PR 的目的

## 如何測試
1. 步驟一
2. 步驟二
3. 預期結果

## 截圖（如果是 UI 變更）
[貼上截圖]

## 相關 Issue
Closes #123
```

---

## 新功能發布後處理

### 情況 A：有人 merge 到 dev

**你會看到通知：**
> ✅ Test Branch Synced with Dev
> 
> 請更新你的 feature 分支

**你需要做的：**

```bash
# 1. 更新遠端資訊
git fetch origin

# 2. 切換到你的 feature 分支
git checkout feature/你的分支名

# 3. Rebase
git rebase origin/test

# 4. 解決衝突（如果有）
# 見下方「衝突處理」

# 5. 強制推送
git push origin feature/你的分支名 --force
```

**時限：** 建議當天完成

---

### 情況 B：有人 merge 到 main（較嚴重）

**你會看到通知：**
> ⚠️ CRITICAL - Action Required
> 
> Dev and Test Branches Synced with Main
> 
> 所有 feature 分支必須在 24 小時內更新

**你需要做的：**

```bash
# 1. 暫停當前工作，優先處理這個

# 2. 更新遠端資訊
git fetch origin

# 3. 如果你有多個 feature 分支，逐一處理
git branch -vv  # 查看所有分支

# 4. 對每個分支：
git checkout feature/分支名
git rebase origin/test
# 解決衝突...
git push origin feature/分支名 --force

# 5. 重複直到所有分支都更新完成
```

**時限：** ⏰ **24 小時內必須完成**

**為什麼這麼急？**
- Main 的更新代表有重要版本發布
- 所有開發都應該基於最新版本
- 避免團隊其他人在舊版本上開發

---

## 衝突處理

### 基本流程

```bash
# 1. Rebase 時遇到衝突
git rebase origin/test

# 會看到類似訊息：
# CONFLICT (content): Merge conflict in src/app.js

# 2. 查看有衝突的檔案
git status

# 紅色標記的就是有衝突的檔案
```

### 解決衝突

#### 打開衝突檔案，會看到：

```javascript
<<<<<<< HEAD (你的代碼)
function greet() {
  console.log("Hello");
}
=======
function greet() {
  console.log("Hi there");
}
>>>>>>> origin/test (別人的代碼)
```

#### 決定保留哪個版本：

**選項 1：保留你的**
```javascript
function greet() {
  console.log("Hello");
}
```

**選項 2：保留別人的**
```javascript
function greet() {
  console.log("Hi there");
}
```

**選項 3：合併兩者**
```javascript
function greet() {
  console.log("Hello");
  console.log("Hi there");
}
```

#### 完成解決

```bash
# 3. 刪除衝突標記 (<<<<<<<, =======, >>>>>>>)
# 保留你想要的代碼

# 4. 標記為已解決
git add <衝突的檔案>

# 5. 繼續 rebase
git rebase --continue

# 6. 如果還有其他衝突，重複 2-5 步驟

# 7. 完成後推送
git push origin feature/你的分支名 --force
```

---

### 使用 VS Code 解決衝突

VS Code 會自動識別衝突，顯示按鈕：

```
<<<<<<< HEAD (Current Change)
你的代碼
[Accept Current Change] [Accept Incoming Change] [Accept Both Changes]
=======
別人的代碼
>>>>>>> origin/test (Incoming Change)
```

點擊對應的按鈕即可快速解決！

---

### 衝突太多怎麼辦？

#### 方法 1：取消 rebase，重新來過

```bash
# 取消當前的 rebase
git rebase --abort

# 回到原始狀態，之後可以再試一次
```

#### 方法 2：重新開分支（最後手段）

```bash
# 1. 備份當前工作
git checkout feature/你的分支名
git branch feature/你的分支名-backup

# 2. 查看你做了哪些重要的 commits
git log --oneline

# 記下你的 commit hash (例如：abc1234, def5678)

# 3. 從最新的 test 重新開分支
git checkout origin/test
git checkout -b feature/你的分支名-new

# 4. 手動挑選你的重要 commits
git cherry-pick abc1234
git cherry-pick def5678

# 5. 刪除舊分支，重命名新分支
git branch -D feature/你的分支名
git branch -m feature/你的分支名-new feature/你的分支名

# 6. 強制推送
git push origin feature/你的分支名 --force
```

---

## 常見問題

### Q1: 我忘記每天 rebase，現在有很多衝突怎麼辦？

**A:** 慢慢解決，一個一個來。或者使用「重新開分支」的方法（見上方）。

---

### Q2: 我可以直接 push 到 test 分支嗎？

**A:** 不行。Test 分支有保護，只能透過 PR merge。

---

### Q3: 什麼時候該用 `--force` push？

**A:**
- ✅ Rebase 之後（因為改寫了歷史）
- ✅ 在你自己的 feature 分支上
- ❌ **永遠不要** force push 到 main/dev/test

---

### Q4: 我同時有 2 個 feature 分支，都需要 rebase 嗎？

**A:** 是的。所有基於 test 的分支都需要更新。

```bash
# 逐一處理
git checkout feature/分支-1
git rebase origin/test
git push origin feature/分支-1 --force

git checkout feature/分支-2
git rebase origin/test
git push origin feature/分支-2 --force
```

---

### Q5: 如何查看我的分支與 test 差了多少？

**A:**
```bash
# 查看差異的 commits
git log origin/test..HEAD

# 查看差異的檔案
git diff origin/test

# 查看統計
git diff --stat origin/test
```

---

### Q6: Rebase 搞砸了怎麼辦？

**A:**
```bash
# 方法 1：取消 rebase
git rebase --abort

# 方法 2：回到之前的狀態
git reflog  # 找到之前的 commit
git reset --hard HEAD@{n}  # n 是 reflog 顯示的數字
```

---

### Q7: 我可以在別人的 feature 分支上開發嗎？

**A:** 盡量避免。如果必須：
1. 與該分支的人溝通
2. 從他的分支開新分支
3. 完成後提 PR 回他的分支

---

### Q8: 如何撤銷最後一個 commit？

**A:**
```bash
# 撤銷但保留修改（可以重新 commit）
git reset --soft HEAD~1

# 完全撤銷（放棄修改）
git reset --hard HEAD~1
```

---

### Q9: 如何修改上一個 commit 的訊息？

**A:**
```bash
git commit --amend

# 會打開編輯器讓你修改 commit message
# 修改後存檔即可
```

---

### Q10: 忘記在哪個分支上開發了怎麼辦？

**A:**
```bash
# 查看當前分支
git branch

# 前面有 * 的就是當前分支

# 如果在錯的分支上開發了：
git stash  # 暫存當前修改
git checkout 正確的分支
git stash pop  # 恢復修改
```

---

## 🆘 遇到問題時

1. **先不要慌張**
2. **檢查 `git status`** - 了解當前狀態
3. **如果不確定，用 `git rebase --abort` 取消操作**
4. **在團隊群組求助** - 說明你遇到的問題
5. **參考這份文檔** - 大部分問題這裡都有解答

---

## 📝 Commit Message 建議格式

```bash
# 格式：類型: 簡短描述

feat: 新增登入頁面
fix: 修復註冊按鈕無法點擊的問題
refactor: 重構資料處理邏輯
docs: 更新 README
style: 調整首頁排版
test: 新增單元測試
```

**類型：**
- `feat` - 新功能
- `fix` - 修復 bug
- `refactor` - 重構（不影響功能）
- `docs` - 文檔
- `style` - 樣式調整
- `test` - 測試
- `chore` - 雜項（更新套件等）

---

## ✅ 每日檢查清單

### 開始工作前
- [ ] `git fetch origin`
- [ ] `git rebase origin/test`
- [ ] 解決衝突（如果有）
- [ ] `git push --force`

### 寫代碼時
- [ ] 頻繁 commit（每完成一個小功能）
- [ ] Commit message 清楚
- [ ] 定期 push 備份

### 提交 PR 前
- [ ] 已 rebase 到最新
- [ ] 測試通過
- [ ] 沒有 console.log 等 debug 代碼
- [ ] PR 描述完整

---

## 🎯 記住這些重點

1. **每次開始工作前先 rebase**
2. **遇到衝突不要慌，一個一個解決**
3. **不確定就問，不要自己亂搞**
4. **永遠不要 force push 到 main/dev/test**
5. **收到通知就處理，不要拖延**

---

**💡 把這份文檔加入書籤，隨時查閱！**

**有問題就在群組問，大家一起學習！**
