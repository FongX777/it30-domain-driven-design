# DDD 戰術設計：Application Service 2 - 結合 TDD/BDD

很多人接觸 DDD 時，認為 DDD 「不夠敏捷」而放棄它。但事實上，有了 DDD 的諸多設計原則，反而可以讓你更容易加入測試，加快迭代的速度。

本篇就在現代分層式架構下，如何使用 TDD/BDD 來開發一個 Application Service。

## TDD/BDD 與現代分層式架構

TDD 是一個「測試先行」的「開發方法」。這個方法的流程會如同下圖所示，分為三個部分：寫一個會失敗的最小測試、讓測試通過、重構，之後再繼續擴展測試。

![](https://insights-images.thoughtworks.com/TDDInsightspost_32b977819d8d859b10904f332c436718.png)

這個開發方法很適合用於撰寫單元測試上，因為單元測試天生就具備體積小、速度快的特性。不過很多人因為程式中的關注點沒有適當的分離，導致單元測試難以撰寫或是拖累速度。

舉一個 REST API 的例子，在正常流程下，一個 Request 打進來後，會先由對應的 Route 接到，處理一下資料格式後 (e.g. `body`、`url encoded` 等)，交給 Controller ，再轉交給 Application Service 處理，而 Application Service 可以使用注入進來的 Infrastructure (e.g. Repository、外部系統) 以及調用 Domain Model 計算業務邏輯來完成任務。

不過如果你沒有將外部 IO 那層隔離出來，那你的測試就會需要執行到 HTTP，而如果你沒有將資料庫或是外部系統隔離開來，你甚至需要啟動一個資料庫才能進行測試。

有了現代式分層架構將各個關注點分離後，我們可以透過 Test Double (測試替身) 的方式，把程式中有副作用的地方用用自定義、沒有副作用的物件來代替，讓單元測試除了保持高速外，也可以專注於邏輯的驗證。

### TDD 的挑戰

透過 TDD 的方法，我們可以在寫程式前透過測試了解程式的目的，幫助我們寫出品質更好的程式碼。但即使有了現代式分層架構的幫助，導入 TDD 仍會遇到一些困難：

1. 真實世界的程式比 TDD Kata 的練習複雜多了
2. 找不到撰寫測試的起點與終點，而且太多的測試讓開發有點沒有方向，見樹不見林的感覺
3. 可能導致測試太重視細節，而失去了對於整個業務目標的方向感。
4. 承上，過於細節的測試也很難維護。
5. 測試寫出來也不代表你跟領域專家的想法沒有落差，一旦雙方理解不同，測試不就白寫了？

尤其是最後一點，是所有開發人員心中的痛、加班的根源：「需求怎麼又變了」。

因此就有了 BDD 的誕生來試圖解決以上問題。

### BDD 的誕生: 從改善版的 TDD 開始

BDD 是由 Dan North 在 2000 年初期為了教學與練習方便而設計的。一開始，他只是單純的改變了測試的敘述，用一種更「自然」的語言來撰寫。從針對 Class 的 function，變成針對範例寫測試。

就像如下的程式碼所展示，傳統 TDD 單元測試的寫法針對每個公開的 method 做測試，很容易在測試對象變更時壞掉且不好維護。

```js
// Before
describe('Test BankAccount', () => {
  test('BankAccount.transfer', () => {
    // ...
  });

  test('BankAccount.deposit', () => {
    // ...
  });
});
```

而如果改成用使用範例描述測試，如下所示，不但程式的功能一目了然，也可以避免寫出太細節且效益低的測試。

```js
// After
describe('When_Transferring_Internation_Funds', () => {
  it('should_transfer_funds_to_a_local_account', () => {
    // ...
  });
  it('should_transfer_funds_to_a_different_bank', () => {
    // ...
  });
  it('should_deduct_fees_as_a_separate_transaction', () => {
    // ...
  });
});
```

當 North 發現這樣 unit tests 讀起來更像 specification 且更專注於行為上 (相比傳統 TDD 單元測試只注重驗證)。因此他轉而開始發展出 Behavior-Driven Design。

註：本範例 code 是參考 BDD IN ACTION 一書寫成。
註：其實 JS framework 使用的 `it()` 就是從 BDD 衍生而來的，這樣讓測試更加好懂，也減少了與主程式間的耦合 (不然一改 method name 測試也要跟著改)

### BDD 決定測試的起點: 由外向內

既然是從範例出發，那測試的方向自然就會由外向內，先定義最外面「要完成什麼」，才走進內部「要實作什麼」。甚至良好的 BDD

## 步驟

### 步驟 1. 蒐集 Spec By Examples

### 步驟 2. 撰寫 Application Service Test

### 步驟 3. 撰寫 Application Service

### 步驟 4. 撰寫 Domain Model Test

### 步驟 4. 撰寫 Domain Model

### 步驟 5. 撰寫測試用 Repository

### 步驟 6. 將測試用 Repository 加入 Application Service Test

## Reference

```

```
