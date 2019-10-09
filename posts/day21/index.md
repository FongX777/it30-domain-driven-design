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

既然是從範例出發，那測試的方向自然就會由外向內，先定義最外面「要完成什麼」，才走進內部「要實作什麼」。甚至可以不用寫任何傳統的單元測試。通常我們會在外層 (Application Service)撰寫 Spec By Examples (用範例寫規格) 來測試，然後內層 (Domain Model) 用 BDD style 的測試 (又稱 low-level specification)。

### BDD 的精神：跨團隊合作

最後講一下 BDD 的核心精神。BDD 的精神跟 DDD 很相似，單很注重「跨團隊的交流」。很多時候，軟體開發的拖延或失敗都是源於不良的需求溝通。

流水線模式下的開發流程，有點像是傳聲筒遊戲一樣，將需求一個接一個往下傳，到最終端時，需求往往就失真了。而且有時候上游也需要來自下游的意見才能找出自己的盲點。

![Pasted image](https://dynalist.io/u/WUh9CCr5xd_pZ4QeN_YXX1zb)
(source: BDD IN ACTION)

而 BDD 的核心精神則是鼓勵不同團隊間互相溝通、達成共識。商業團隊提出商業需求、測試團隊提出測試的考量，開發團隊也貢獻自己的專業，透過**討論功能的實際案例**來建構一份可以被大家共同遵守的文件。

![Pasted image](https://dynalist.io/u/WaQeOv1I7JbM5JLccmiapb15)
(source: BDD IN ACTION)

而為了要被大家看懂，就必須捨棄那些艱深的技術字眼，用自然的語言來撰寫。而之後有許多格式出現來結構化文件，最有明的格式就是 [Cucumber](https://cucumber.io) 框架下的 Gherkin 語法。他將一個規格分為三個部分：

1. Given: 前置條件
2. When: 執行動作 (Action)
3. Then: 預期的執行結果 (Assertion)

比如有一個案例是「你身上有 20 元，你給我 10 元」：

```gherkin
Given you had 20 dollars
And I had 10 dollars
When you give me 10 dollars
Then I should have 30 dollars
And You should have 10 dollars
```

又或者「你身上有 10 元，你要給我 20 元」的失敗案例：

```gherkin
Given you had 10 dollars
And I had 10 dollars
When you give me 20 dollars
Then the transaction should fail
And show error message 'Balance Not Enough'
```

透過 Cucumber 框架的協助，我們可以將這些文件轉變為測試程式碼，成為「Living Documentation (活的文件)」，任何時候你程式碼或是文件的變更都必須保證兩處的同步。甚至加入自動化測試，保證你每一次整合的正確性。

同樣用以上給錢的案例，在 JS 中可以搭配 Cucumber 將文件轉為測試碼：

```js
// gherkin file
`Given you had '20' dollars
And I had '10' dollars
When you give me '10' dollars
Then I should have '30' dollars
And You should have '10' dollars`
// test file
const assert = require('assert');
const { Given, When, Then } = require('cucumber');

interface Person {
  name: string;
  // 餘額
  balance: number;
}

const creatPerson(name: string, balance: number): Person {
  return {
    name,
    balance
  };
}

const transfer(fromPerson: Person, toPerson: Person, amount: number): void {
  if (fromPerson.balance < amount) {
    throw new Error('Balance Not Enough')
  }
  fromPerson.balance -= amount;
  toPerson.balance += amount;
}

Given('you had {string} dollars', function (money) {
  this.fromPerson = createPerson('From', Number(money));
});

Given('I had {string} dollars', function (money) {
  this.toPerson = createPerson('To', Number(money));
});


When('When you give me {string} dollars', function (amount) {
  transfer(this.fromPerson, this.toPerson, amount);
});

Then('Then I should have {string} dollars', function (expectedBalance) {
  assert.equal(this.toPerson.balance, expectedBalance);
});

Then('Then You should have {string} dollars', function (expectedBalance) {
  assert.equal(this.fromPerson.balance, expectedBalance);
});
```

註：本案例參考 https://cucumber.io/docs/guides/10-minute-tutorial/

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
