# DDD 架構： 分層式架構與依賴反向原則

![cover photo](https://images.unsplash.com/photo-1521704042371-f13409bf0e6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1490&q=80)

相信很多人都有聽過 MVC 這類型的架構模式 (Architecture Pattern)，這類型的模式在初期可以幫助我們分離 UI 與資料處理的邏輯，讓我們將兩者的**關注點分離**。只是 MVC 的 `Model` 的職責過多，並不利於複雜業務邏輯的軟體的需求，此外，`Model` 也常讓人習慣直接套用 ORM 框架，導致業務邏輯被 ORM 綁架的情形出現，這對於未來要擴展業務邏輯非常不利。

對於一些擁有複雜業務邏輯的軟體，雖然專門解決領域問題的部分只佔了一小部分，但卻擁有超乎比例的重要性。所以我們要把「領域物件」與「其他技術細節的的物件」分離開來，並把「領域物件」視作核心。

接下來就讓我們介紹一種常見的架構風格 (Architecture Style): 分層式架構 (Layered Architecture)，並介紹他的變異體 Clean Architecture。

## 分層式架構

在傳統的分層式架構中，我們會先把領域模型與業務邏輯分離出來，並減少對於其他層的依賴。同時每一層都應該要有良好的內聚性，並指依賴於比自己還要低的層。

常見的分類會分成： User Interface (使用者介面層)、Application (應用層)、Domain (領域層)、Infrastructure (基礎設施層)。如下圖：

![https://ithelp.ithome.com.tw/upload/images/20190928/20111997ZUPRgzvmKT.png](https://ithelp.ithome.com.tw/upload/images/20190928/20111997ZUPRgzvmKT.png)

舉一個實際案例，我想要匯 500 元給用戶 A，那麼我會經歷以下的過程：

1. [User Interface] 在介面輸入金額 500 與對象 A
2. [Application] 處理「匯款」的使用案例，呼叫 DB 取出我的帳戶與 A 的帳戶並啟動一個 Transaction。
3. [Infrastructure] DB 收到 Application 的指令完成任務
4. [Application] 將兩個帳戶轉換為 Domain 層的物件 (`Account` class) ，然後進行轉帳 (`My_Account.TransferTo(A_Account, 500)`)
5. [Domain] 處理 `My_Account.TransferTo(A_Account, 500)` 的驗證(雙方帳戶狀態是否為開啟、餘額是否足夠)以及計算 (我扣 500，A 得 500 )。
6. [Application] 收到 `My_Account.TransferTo(A_Account, 500)` 成功的通知，將新的 Account 狀態存入 DB，然後送交 (commit) Transaction。
7. [Infrastructure] DB 執行 Application 來的指令。

| 層                            | 職責                                                                                                        |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| User Interface (Presentation) | 負責向使用者顯示資訊和解釋使用者的指令。使用者可能是人也有可能是另一個系統。                                |
| Application                   | 定義軟體要完成的任務(使用案例)，並指揮 Domain 來實現業務邏輯的計算。                                        |
| Domain                        | 負責保管業務概念、業務狀態以及業務規則。本層式軟體的核心。                                                  |
| Infrastructure                | 為上面個層提供技術能力：為 Application 傳遞訊息、為 Domain 提供持久化機制、為 User Interface 處理畫面等等。 |

以上的分層策略有效的幫助我們做到**關注點分離 (separation of concerns)**。當我們把軟體設計中的每一個部分獨立出來個別關注，程式就有更好的能力處理複雜的任務。

此外，他還有額外的好處：

- 好測試
- 好分工
- 職責分離
- 程式碼的意圖更加明確

而在引入 DDD 時，其實真正在乎的只有 Domain 層。對於其他的層要怎麼分其實並不嚴格要求。但是，這時候有一個問題來了，那就是**依賴性問題**。

> Domain 層既然是軟體的核心，那就要保持它的高層地位。

以目前的架構來看，我們可以看到 Application 與 Domain 層都會依賴於 Infrastructure 層，這樣導致底層機制一變動如更改 DB 或 ORM，那依賴他的那幾層都要全部打掉重練。但我們有提過，使用者並不在乎你是用 Postgres 還是 MongoDB，他只在乎軟體能夠完成任務。因此，我們不應該冒著軟體業務邏輯出錯的風險，讓 Domain 與 Application 依賴於 Infrastructure 層。

這邊我們就來介紹利用**依賴反向原則 (Dependency Inversion Principle, 簡稱 DIP)** 來扭轉這個劣勢。

註：MVC 並不是 Layered Architecture 的一種，因為 Layered Architecture 的關係是單向的，MVC 元間的互動是雙向的。但兩者並非相斥，
MVC 常用於 Layered Architecture 的 Presentation Layer 中。

### DIP 保持 Domain 的核心地位

依賴反向原則 (DIP) 的精神：

> 高層模組不該依賴於低層模組，兩者都應該依賴於抽象介面。抽象介面不應該依賴於細節，細節應該依賴於抽象。

在這邊，Infrastructure 與 Domain 層的主要模組都算是細節，而當我們**在 Domain 層定義了一個 Interface 規格給 Infrastructure 遵守**，那就達到了反向依賴的作用。如下圖：

![https://ithelp.ithome.com.tw/upload/images/20190928/20111997o0qpFGO4Hu.png](https://ithelp.ithome.com.tw/upload/images/20190928/20111997o0qpFGO4Hu.png)

注意！抽象出來的介面一定要放在高層，不然就沒有達到層之間的依賴反轉。

實際上程式碼會像是這樣：

Domain 層：

```typescript
// domain/model/Account.ts
class Account {
  constructor() {}
}

interface AccountRepository {
  // 取得資料
  getById(id: string): Account;
  // 新增
  add(acc: Account): void;
  // 更新
  save(acc: Account): void;
}
```

Infrastructure 層：

```typescript
// infrastructure/repository/PostgresAccountRepository.ts
class PostgresAccountRepository implements AccountRepository {
  private db: Pool;
  constructor(db) {
    this.db = db;
  }
  async getById(id: string): Account {
    const acc = await this.db.query('SELECT * FROM account WHERE id = $1', id);
    return acc;
  }
  async add(acc: Account) {
    await this.db.query('INSERT INTO account (....)', acc);
  }
  async save(acc: Account) {
    await this.db.query('INSERT INTO account (....)', acc);
  }
}
```

當依賴關係反轉之後，接著讓我們來介紹如何導入 Clean Architecture。

## Clean Architecture 的實作程式碼

### 資料夾結構

### 從一個 CRUD 來看 Clean Architecture

### 應用 TDD 與 BDD

## 進入服務化的時代： Port-Adapter Architecture

### 著重在服務互相串接

### 可以用 Event 來彼此溝通

這邊的一個個六角形都可以當作一個 Bounded Context 來看待，而前面的 Event Storming 告訴了我們。

## Summary

下一篇將繼續介紹如何將 Clean Architecture 實作到程式碼當中。

## Resources

- https://medium.com/@domagojk/patterns-for-designing-flexible-architecture-in-node-js-cqrs-es-onion-7eb10bbefe17
- https://blog.ndepend.com/hexagonal-architecture/
- https://github.com/qas/examples-nodejs-cqrs-es-swagger/blob/master/src/users/services/users.service.ts
