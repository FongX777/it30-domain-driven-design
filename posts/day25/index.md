# DDD 戰術設計：Domain Service

![](https://images.unsplash.com/photo-1496151763167-abae6c394463?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)

在 Clean Architecture 推出之後，其中 Application Service (書中為 Use Case) 層與 Domain (書中為 Entity) 層的分離讓我們可以將程式的關注點分離，讓程式更易測試與維護。

不過隨著商業邏輯越來越複雜，Application Service 間可能會有重複的邏輯。原先最簡單的做法是抽出來往內層放，但是 Domain Model 不能使用任何外部套件的原則讓這件事難以達成。又或者，一個 Application Service 需要操作多個 Aggregate，但這些 Aggregate 之間有明顯的業務邏輯關係(判斷式或計算)，一旦放任這些操作在 Application Service 繼續成長，Application Service 就會被迫處理越來越多業務邏輯，讓原先關注點分離的用意失焦。

因此，我們可以利用 Domain Service 的幫助解決以上問題，一來他身在 Domain 層但是特殊的存在，可以操作多個 Aggregate 並使用依賴性注入使用外部套件。二來，對於 Application Service 中牽涉到商業邏輯的部分，可以放進 Domain Service 中，使 Application Service 維持它操作 Domain Model 不牽涉商業邏輯的特性。

同時，Domain Service 無狀態性的特色也讓它輕量、好測試。

聽起來很美好，但這邊就引出了 DDD 最難解的一個哲學(?)問題：**到底怎麼區分 Domain Service 與 Application Service**？

## Domain Service 與 Application Service 的差異

由於 Domain Service 在現代式分層架構是屬於 Domain 層，而 Application Service 則在他的外層。在了解這兩者的差異前，我們先來理解 Application Logic 與 Domain Logic。

## Application Logic vs Domain Logic

在開發時，我們常常會聽到「Business Logic 商業邏輯」一詞來泛指系統解決問題的方式。不過在這邊我們要先定義何謂「Business Logic」，我們先從 Wiki 上看看他的定義：

> In computer software, business logic or domain logic is the part of the program that encodes the real-world business rules that determine how data can be created, stored, and changed. It is contrasted with the remainder of the software that might be concerned with lower-level details of managing a database or displaying the user interface, system infrastructure, or generally connecting various parts of the program.  
> 在資訊工程，商業邏輯或是領域邏輯是軟體中負責將現實生活中的商業規則轉換成程式碼的部分，以決定資料如何被產生、儲存以及更改。他會與軟體中的其他低階的技術細節如管理資料庫、使用者介面或系統基礎設施、串接外部程式做出區別。

如果你在公司內對於 Business Logic 有自己的定義，那就不妨用 Domain Logic 來表示，而且 Domain Logic 聽起來也比較符合現代分層架構中心的 Domain 層。

不過在現實中，有些技術概念很容易偷渡進 Business Logic，比如在實作商業規則的「一起成功或失敗」時，我們會把 Transaction 技術也當作 Business Logic 的一部份，但他仍然是技術細節。這時我們得分清楚，「一起成功失敗」是商業規則，但實現方法可以用 Transaction、2 Phace Commit、SAGA 或其他 Eventual Consistency 機制。

如果還是很難分清楚，那建議可以直接找一位不懂技術的領域專家，把你的作法闡述一次，基本上**他聽得懂的**大概就會是 Domain Logic，他聽不懂的如 Transaction、Event Sourcing 等等就可能不在 Domain Logic 的範圍。

在現代式分層架構中，我們會把 Domain Logic 放在中心 Domain 層，而技術細節放在最外層的 Infrastructure 層，至於將兩者結合的就是中間的 Application Service，負責軟體的 Application Logic。

Domain Logic 基本上負責商業功能的規則。比如提款的邏輯是提款金額要小於等於該帳戶的餘額，通常是**系統中大家都要遵守的法律**；而 Application Logic 負責的是軟體的技術需求以及系統要完成的自動化任務。比如你可以用 本行 ATM、分行 ATM 或臨櫃等方式提款，而每種方式的轉帳都可能有微小的差異 (e.g. 超商 ATM 提款會有紅利點數)，但提款的**核心規則不會改變**，你可以把它當作**依行政機關而各自設定的行政命令，但他還是要遵守法律**。

其實，我想這兩者間其實並沒有一個絕對的界線，不過當一段程式碼要成為 Domain Logic 需要十分謹慎，除非能夠確定這是所有人都可以遵守的，我們才會把它放進 Domain Logic，不然一般來說可以先放在 Application Logic 中。

### 什麼是 Domain Service

我們現在理解，我們會盡量避免 Application Service 處理 Domain Logic，而是在 Application Service 操作 Domain Model 將 Domain Logic 的責任轉交給 Domain 層。

但大多數時候 Domain Model 只專注於特定領域的規則，所以當領域中的某個處理流程或轉換流程不是 Entity 或 Value Object 的職責時，我們就可以獨立出一個介面，即 Domain Service。另外，Domain Service 仍須遵守 Ubiquitous Language 且無狀態性。

如此一來，Application Service 的依賴性依然往內，而且也能順利把處理 Domain Logic 的責任往內層丟。

你可以用 Domain Service 來做到：

- 執行一個業務處理流程
- 對 Domain Model 進行轉換
- 以多個 Domain Model (Aggregate) 作為輸入進行計算，最後產出一個 Value Object。

在檔案位置上，我們會放在 `xxBoundedContext/domain/service/` 底下，與 `xxBoundedContext/domain/model` 底下的 Entity、Value Object 做出區別，也不用煩惱該將 Domain Service 分類在哪一個 Aggregate 下。

### 什麼時候該把 Application Service 抽成 Domain Service

由於我們的使用案例的數量與複雜度都會持續增長，有時候某些規則從一開始的特定操作變成放大家都要遵守的規則。建議可以在當你在 Application Service 看到以下情況時，就可以考慮把部分程式碼抽成 Domain Service：

1. 有計算邏輯 (加減乘除)時
2. 有 `if/else` 判斷領域概念時

比如一開始每個月初你都會寄送電子報給會員。後來為了專注在核心會員上，規定月中會再寄一次電子報，但僅限 VIP 會員。這時候原先寄信是寫在 Application Service 中，但有了條件判斷後，就可能要考慮抽成 Domain Service 裡。

### 所以什麼該留在 Application Service ?

1. 消息驗證
2. 錯誤處理
3. 監控
4. Transaction
5. 認證與授權

## Domain Service 實作

在這邊我們舉轉帳的例子。在轉帳中牽涉到了兩個帳戶的互動，而這互動的關係並不屬於單個帳戶的職責，因此可以放在 Domain Service 來做。

先來看看沒有使用 Domain Service 前，我們的 Application Service 會長這樣：

```typescript
// banking/application/account/Transfer.ts
async exectue(input: { amount: number, fromAccountId: string, toAccountId: string }) {

  this.client.query('BEGIN TRANSACTION;')
  try {
    this.accountRepo.set(this.client);
    const toAccount = await this.accountRepo.ofId(new AccountId(input.fromAccountId));
    const fromAccount = await this.accountRepo.ofId(new AccountId(input.toAccountId));

    if (fromAccount.balance > input.amount) {
      throw new Error('...')
    }

    fromAccount -= input.amount;
    toAccount += input.amount;

    await this.accountRepo.save(fromAccount);
    await this.accountRepo.save(toAccount);

    this.client.query('COMMIT;');
    return /* success */
  } catch (error) {
    this.client.query('ROLLBACK');
  }
}
```

當然，你也可以直接在 Account 中加入一個 `transfer(toAccount: Account): void` method 來處理，但是如果未來轉帳還需要加入其他概念的判斷的時候呢？比如信用評等要超過某個等級才能轉更高的金額、跨行手續費計算等等。

接著，我們把它抽成一個 Domain Service：

```typescript
// banking/domain/service/TransferService.ts
export function transfer(params: {
  amount: number;
  fromAccount: Account;
  toAccount: Account;
}) {
  if (fromAccount.balance > input.amount) {
    throw new Error('...');
  }

  fromAccount -= input.amount;
  toAccount += input.amount;
}

//banking/application/account/Transaction.ts
// banking/application/account/Transfer.ts
async exectue(input: { amount: number, fromAccountId: string, toAccountId: string }) {

  this.client.query('BEGIN TRANSACTION;')
  try {
    this.accountRepo.set(this.client);
    const toAccount = await this.accountRepo.ofId(new AccountId(input.fromAccountId));
    const fromAccount = await this.accountRepo.ofId(new AccountId(input.toAccountId));

    if (fromAccount.balance > input.amount) {
      return /* error */;
    }

    this.transferService.transfer({ amount, toAccount, fromAccount });

    await this.accountRepo.save(fromAccount);
    await this.accountRepo.save(toAccount);

    this.client.query('COMMIT;');
    return /* success */
  } catch (error) {
    this.client.query('ROLLBACK');
  }
}
```

當你把這段邏輯封裝進 Domain Service 後，未來你就可以更容易地針對不同使用案例作客制而不用怕影響基本的轉帳邏輯。另外， Domain Service 也可以接受依賴性注入將 Repository 或其他外部套件注入進來操作，但千萬記住，**不要將外部套件注入進 Aggregate 中**。

## Reference

想知道更多 Application Service 與 Domain Service 的應用場景，可參考[如何分辨領域服務與應用服務](https://mp.weixin.qq.com/s/d_Q9n3fpwUTzhpc0Gytr0A?fbclid=IwAR3RaRBZDvZuX3Wf9vXSiztPeSWPk0CyO3gxj7os1Y3uowQfOYuEVCPcFSg)。

- [cover photo from unsplash](https://unsplash.com/photos/Bp9hJrDRkf8)
