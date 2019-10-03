# DDD 戰術設計：Aggregate 聚合設計 (續)

![](https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1463&q=80)

本篇我們將繼續介紹 Aggregate 的幾項設計原則，加深我們對於 Aggregate 在實戰上應用的理解。

## 四大設計原則

主要會介紹四種設計原則：

1. 在一致性邊界內保護不變條件
2. 設計小 Aggregate
3. 通過 ID 引用其他 Aggregate
4. 在邊界外使用最終一致性

### 原則一：在一致性邊界內保護不變條件

在每一次更改聚合的狀態時，我們必須要確保這次的更改能夠滿足整個聚合內所有的不變規則。舉一個例子，假如有一個聚合有數個不變規則長這樣：

- `c = a + b`
- `d = a + 3`

所以當 若 `a` 為 2、`b` 為 4，那 `c` 就一定要是 6，而 `d` 則是 5，否則就會破壞這個規則。今天當一個 Aggregate 中的 `a` 被更改為 4，那麼 `c` 就要跟著變成 8，`d` 也要跟著變成 8。

接著，當 Aggregate 完成了一個更改操作後，為了要儲存這次成功的操作，你需要將**整個 Aggregate 一起存進資料庫**，才能保證邊界內的不變規則被一起被完成。因此，一個 Transaction 會對應一個 Aggregate 的更改操作，**Aggregate 邊界同時也是 Transaction 的邊界**。

這樣設計的好處是可以更好地保護 Aggregate 邊界內的修改不會被其他 Aggregate 的修改干擾，導致意料外的結果。比如你希望訂單結案 (`Order` Aggregate) 後，可以升級會員 (`Member` Aggregate) 的等級，但你不一定希望「會員升級失敗」會影響到「訂單結案」的事實，而是有其他錯誤處理機制。

不過當你的某個使用案例就是會一次修改到多個 Aggregate，且某兩個 Aggregate 的操作之間必須存在「同進退」的關係，就會讓人忍不住將兩者包成一個 Transaction 進行。常見的解決方法是用之後會提到的最終一致性來解決。不過老實說，最終一致性也會添加一些複雜度，將兩者包在同一個 Transaction 是最快的解法。當然，我並不認為這是絕對不能打破的規則，不過也要想清楚這樣的作法會不利於未來的擴展性，我會在下面再談談打破規則的時機。

### 原則二：設計小 Aggregate

若是 Aggregate 拆分越小且越多，系統的性能跟擴展性也會跟著提升。但複雜度也會升高 ，反之亦然。但是當系統的資料量與複雜度逐漸提升，有時候所謂的「一對多」關係中的「多」可以是一個也可能是上千個。比如說在網購時，對於系統來說，其實我們購買的並不是「商品」(Product)，而是一個「商品規格」(Variant)，商品比較像是裝滿各種雞蛋的籃子，我們要買的是雞蛋而非籃子。就像是買衣服時，真正進你的購物車的是「M 號衣服」。

在一開始，你可能只會設計一個 `Product` Aggregate，裡面包含著 `Variant[]` Entity，但兩者間的不變規則只有商品的規格數量不能為 0 而已。此外，有時候當你只是想修改 `Product` 的一段敘述文字，卻可能要同時撈出上千筆 `Variant` 出來，然後再完整地回去。這時候你就可以考慮將 Variant 拆出來獨立成 Aggregate。

事實上，大多數時候，若是不變規則的約束並不嚴格，那讓 Aggregate 中除了 Aggregate Root 外，裡面的 Entity 數量應該越少越好，最好只剩下 Value Object。這樣一來，你也可以少考慮很多狀態變化的組合，而且也讓你在操作資料庫時，少做一些 JOIN。

甚至當你發現你 Aggregate 中的 Entity 沒有複雜的變化，只有建立與刪除，或是可以整個被替換掉，那就可以考慮改建成 Value Object。

### 原則三：通過唯一 ID 引用其他 Aggregate

在使用 Aggregate 時，因為他把相關連的物件都放在了邊界之內，所以我們可以更容易地遍歷得到我們需要的資訊。但有時候，一個 Aggregate 仍然可能會跟其他 Aggregate 有關聯，但直接引用整個 Aggregate 進來不但過於冗贅且不利效能，我們該怎麼做呢？

在實作上，若是一個 Aggregate Root 或是內部的物件想要引用外部的 Aggregate，我們會直接讓他們引用外部的 Aggregate Root ID 而非整個物件。這樣可以帶來幾個好處：

1. 減少記憶體消耗。
2. 不需要對於另一個 Aggregate 的一致性負責。
3. 有需要時再透過 Aggregate Root ID 去 Repository 撈出 Aggregate，可提升系統的擴展性

此外，這樣的作法也可以支援 Event-Driven 的架構以及最終一致性的實作。

### 原則四：在邊界之外使用最終一致性

我們一直提到單個 Aggregate 的設計方法，那 Aggregate 之間的溝通呢？

老實說，這不是一個容易的課題，最簡單的方式就是直接在 Application Service (也就是你的 Use Case) 直接將兩者的關係從上到下寫進去。假如今天有個規則是訂單結案後，下訂單的會員信用度(`Credit`)加一，我們的使用案例會像這樣：

```typescript
// application/order/CloseOrder.ts
class CloseOrder {
  private orderRepo: OrderRepository;
  private memberRepo: MemberRepository;
  constructor(orderRepo: OrderRepository, memberRepo: MemberRepository) {
    this.orderRepo = orderRepo;
    this.memberRepo = memberRepo;
  }

  async execute(input: { orderId: string }) {
    // 1. 將訂單結案
    // transaction start
    const order: Order = await this.orderRepo.ofId(input.orderId);
    order.close(); // statu -> 'CLOSED'
    await this.orderRepo.save(order);
    // transaction end

    // 2. 會員信用度增加
    // another transaction start
    const member: Member = await this.memberRepo.ofId(order.buyerId);
    member.increaseCreditByOrderClosed(); // +1 credit
    await this.memberRepo.save(member);
    // another transaction end
  }
}
```

這種最直覺的作法被稱為 **Strong Consistency (強一致性)**，或是又被稱作 **Immediate Consistency**。根據 Wiki 的描述這樣的行為就是在遵守 Strong Consistency：

> All accesses are seen by all parallel processes (or nodes, processors, etc.) in the same order (sequentially)
> 所有並行的處理程序以相同的順序處理所有的訪問。

簡單來說，就是你要將所有操作一個等待一個完成後回傳最終結果。而相對的 **[Eventual Consistency (最終一致性)](https://en.wikipedia.org/wiki/Eventual_consistency)** 則是強調不在乎次序，只要最終能夠完成任務即可。

舉一個例子，今天你要交代你的部下早晨任務：完成倒茶、遞茶、列印報告、繳交報告這四項步驟。Immediate Consistency 就像是你要跟在你的部下身邊，一件事一件事的做好，直到任務完成為止，這種方式雖然可以保證你交代的任務被完美執行，但卻要浪費你自己的時間與力氣。相對的 Eventual Consistency 就像是你只在早上口頭交代他任務後，就讓他自己去做，中間不管他偷溜出去摸魚也好，反正最後他一定會把茶跟報告送上來，這種方式雖然無法立即得到結果，卻大大節省了你的力氣與時間。

這時候我們就可以趁機將我們自己系統中的使用案例拿出來檢視一下，是否每個使用案例都需要 Immediate Consistency 呢？

在實作上，Immediate Consistency 通常因為較簡單因此成為我們的首選，但當一個使用案例要處理的服務越來越多，個別的服務都有可能成為系統的效能瓶頸，比如一間訂房網站為了提高服務品質，讓客人能夠一次完成訂房、訂機票、租車等服務，這時候若是使用 Immediate Consistency 讓一個操作接著一個操作進行，除了可能會鎖住 Table 以外，牽涉到外部服務的時間成本更是昂貴。此時若是考慮使用最終一致性，我們的流程可以變成這樣：

![https://ithelp.ithome.com.tw/upload/images/20191004/20111997KKsn9yJ5kB.png](https://ithelp.ithome.com.tw/upload/images/20191004/20111997KKsn9yJ5kB.png)
(參考自: https://www.slideshare.net/kimKao/2019-03232ndmeetupessential-capabilities-behind-microservices-137920646)

而最終我們可能也只讓客人多等了零點幾秒，但至少他可以迅速的訂到旅宿，達到最大的價值。另外可以看到，每個動作都可以當作獨立的 service，而他們之間的溝通可以透過發送事件來傳遞。這種模式又被稱為 SAGA (長時間狀態處理過程)。

回到 Aggregate 也可以利用相似的方式，最常見的方法是在 Aggregate (e.g. `Order` Aggregate) 中送出 Domain Event (e.g. `OrderClosed` Event) 後繼續自己的持久化操作，而有訂閱這個 Domain Event 的 Aggregate (e.g. `Member` Aggregate) 就可以自己處理這個 Event 而不用管原先的 Aggregate 的狀態。就像 Eric Evans 說的一樣：

> 任何跨聚合的業務規則都不能總是保持最新的狀態。通過事件處理、批處理或者其他更新機制，我們可以在**一定時間**之內處理好他方依賴。

實作上會像是這樣：

```typescript
// domain/model/Order.ts
class Order {
  close() {
    // 判斷可不可以 close 以及遵守其他固定規則
    // ...
    this.setStatus('CLOSED');

    // 1. 加入 Events
    this.events.push(new OrderClosed(this.id, this.buyerId));
  }
}
class OrderClosed implements DomainEvent {
  public orderId: string;
  public buyerId: string;
  public occuredAt: Date;
  constructor(orderId, buyerId) {
    this.orderId = orderId;
    this.buyerId = buyerId;
    this.occuredAt = new Date();
  }
}

// application/order/CloseOrder.ts
const events = require('events');

class CloseOrder {
  private orderRepo: OrderRepository;
  private memberRepo: MemberRepository;
  private eventEmitter: events.EventEmitter;
  constructor(orderRepo: OrderRepository, memberRepo: MemberRepository) {
    this.orderRepo = orderRepo;
    this.memberRepo = memberRepo;
    this.eventEmitter = new events.EventEmitter();
  }

  async execute(input: { orderId: string }) {
    this.eventEmitter.on(
      'OrderClosed',
      async (orderClosed: OrderClosed): void => {
        // 4. 會員信用度增加
        // another transaction start
        const member: Member = await this.memberRepo.ofId(orderClosed.buyerId);
        member.increaseCreditByOrderClosed(); // +1 credit
        await this.memberRepo.save(member);
        // another transaction end
      }
    );

    // 2. 將訂單結案
    // transaction start
    const order: Order = await this.orderRepo.ofId(input.orderId);
    order.close(); // statu -> 'CLOSED'
    await this.orderRepo.save(order);
    // transaction end

    // 3. 發送所有 Events
    order.events.forEach(event => this.eventEmitter.emit('OrderClosed', event));
    this.eventEmitter.removeAllListeners();

    return;
  }
}
```

讀者可以觀察第三步「發送所有 Events」時，所有註冊這個 Event 的人都會收到並進行處理。當然，你也可以在收到 Event 後丟到外部的訊息處理機制 (e.g. Message Queue) 然後交給另一個 Bounded Context 或系統來處理。

註：上面那段程式碼我會在 Domain Event 章節更詳細地介紹這個機制。
註：上面那段程式碼為追求簡便，故不將詳細的 Transaction 實作放上來，僅用註釋提醒。有興趣的讀者可以自行實作看看。

## 打破 Transaction 邊界原則的例外

Aggregate 的邊界雖然等於 Transaction 的邊界，但遇到某些情況時，是可以協調的，讓我們來看看有哪些情況吧！

### 方便的 UI 介面

當你系統服務是 B2B 時，你常常會需要提供客戶(某家企業)一些功能讓他們更有效率地處理他們大量的資料，其中之一就是大量處理建立或更改的請求(批次處理)。這時候你可能同時要修改 100 筆訂單的狀態或是同時建立 500 筆商品，這時候你可能會寫出這樣的程式碼：

```typescript
interface OrderStatusUpdateCommand {
  orderId: string;
  status: Order.Status;
}

class bulkUpdateOrderStatus {
  async execute(input: OrderStatusUpdateCommand[]) {
    // transaction start
    for (const orderStatusUpdateCmd of input) {
      const order = await this.orderRepo.ofId(orderStatusUpdateCmd.orderId);
      order.updateStatus(status);
      await this.orderRepo.save(order);
    }
    // transaction end

    // return response...
  }
}
```

由以上的程式碼可以看出，雖然修改了多個 Aggregate 後才結束 Transaction，但是這之中也都沒有違反邊界內的不便條件，因此這可以當作一個打破原則的理由。

### Legacy 考量

就 legacy code 考量...

## 持久化考量

這邊再次提醒幾個關於 Aggregate 與 Repository 的關係：

1. 一個 Aggregate 最好對到一個 Repository
2. 從 Repository 一次可以拿出一整個 Aggregate Object (`ofId(id: string): Aggregate`)
3. 寫入 Repository 時也是一次寫入一整個 Aggregate Object (`save(obj: Aggregate): void`)

此外，我們必須要強調一次， Aggregate 物件與資料庫裡面的資料**是不同的東西**，或許他們的資料很接近，又或許 Aggregate 是透過資料庫裡的資料組出來的，但將兩者分離可以讓你更專注在 Aggregate 的領域知識上，甚至你可以寫完整個系統的業務邏輯後再去選擇資料庫或是儲存的細節。有關更多討論，待之後 Repository 篇章會再提到。
