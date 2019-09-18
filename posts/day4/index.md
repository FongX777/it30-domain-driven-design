# Bounded Context 深度解析

Bounded Context 就像一個國家一樣，在台灣你說。
更直接一點，「爸爸」一詞只有在自己家 (context) 才成立。

## 🔍 如何辨識 Bounded Context

很多時候，如果系統大到需要被拆分出程式碼或是獨立出新系統，我們會依靠 Business Context

### 注重 Business Capabilities 勝過資料

同樣概念的資料，如顧客，可能會在不同業務功能中出現，如果單純用資料的概念去定義，最後一定會長出一個肥大且難用的 Bounded Context 。
事實上，用業務功能

很多時候，我們會把 Bounded Context

Customer 在不同 bounded context 中有不同的意義
ex:
瀏覽產品目錄時，顧客 = 先前購買紀錄、忠誠度、可買商品、折扣...
下單時的顧客 = 名字、聯絡方式、地址、其他術語

- Language
  Models act as an Ubiquitous Language, therefore it is necessary to draw a line between Contexts when the project language changes
  If a Bounded Context must be managed or implemented by more than one team it is probably too big and should be split up.

  - Data Authority

- One Team

- Meaningful Model
  Try to identify models that make sense and that are meaningful in one specific context. Also think about decoupling of models
  EX: avoid `utils` model
- Cohesion
  Take a look at your (sub-) domain and think about which parts of that domain are strongly related or in other words highly cohesive

最後提醒一下， DDD 是一種設計方法，並非數學考試，沒有正確答案。

> This is design and art, not science.

### 同一概念拆分在不同 Bounded Context

## 🚫 Bounded Context 常見迷思

### 迷思一：一次就要分完

事實上大多數系統一開始可能只會有一個 Bounded Context 或是業務複雜度不足以分出多個 Bounded Context 。

### 迷思二：根據技術架構分 Bounded Context

### 迷思三：根據開發任務拆分 Bounded Context

### 迷思四：Bounded Context 與團隊合作分離

Conway Laws
By Conwey Law: 軟體組織的團隊邊界決定系統邊界 => Bounded Context 也成為了一個決定團隊邊界的好方式，對於跨國團隊更有利。

## 💣 Bounded Context 的強大威力

### 命名不用怕

### 身份認證

### 可以用來拆分 Microservice

### 可以用來分配團隊任務

## 📝 Summary

Bounded Context 原先就是從與領域專家溝通得來的知識所建構出的邊界，因此不難理解他會是一個語意的邊界！因此在思考 Bounded Context 時，請開發人員先屏棄技術細節的探究，以軟體的業務功能為優先。
Bounded Context 為系統間提供了絕佳的邊界，不管是否之後有沒有採用 Tactical Design ，對於成長中的軟體服務都是非常實用的。

當我們拆分出 Bounded Context 後，我們也需要理解如何連結使用他們。下一篇會來介紹幾個常見的 Bounded Context 合作模式，又稱 context mapping。

## Resources

- [Context is King: Finding Service Boundaries](https://dev.to/codeopinion/context-is-king-finding-service-boundaries-4mob)
- [Focus on Service Capabilities, not Entities](https://codeopinion.com/focus-on-service-capabilities-not-entities/)
