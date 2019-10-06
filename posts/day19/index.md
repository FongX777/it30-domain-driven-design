# DDD 戰術設計：Repository 資源庫

![](https://images.unsplash.com/photo-1565966245341-5a3f55bbf545?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)

DDD 注重在 Domain 層的領域物件，而這些領域物件雖然擁有計算能力，但仍需要有持久化機制將他們存下來，讓未來可以再次把他們拿出來。Respository 就是用來管理 Aggregate 持久化以及資料取得，並且保證領域模型 (domain model) 與資料模型 (data model) 的分離。

很多人都有聽過 Respository 模式，但是卻缺乏搭配 Aggregate 的概念 (一個 Repository 負責一個 Aggregate)，使得 Repository 隨著物件的關係一起複雜化，甚至瑣碎化(變成每個 Model 都要見一個 Respository)。

Repository 最大的優點就在於**分離領域模型與資料模型**，你可以更輕鬆的擴展領域模型或是優化資料庫操作的效能，而不用怕互相影響。而且還可以向**客戶端 (通常是 Application Services/Use Case)隱藏技術細節**，讓客戶端只需要對清晰的 Repository 介面下指令，而不用關心背後用的是什麼機制或是幾種機制。

很多人在一些新手語言教學中常常會直接使用 ORM 讓你的領域模型由資料模型定義。這樣的好處是開發快速，但缺點就是你的整個核心業務邏輯被資料框架所綁架，讓你很難擴展或優化。此外，Repository 也與 DAO 模式 (Data Access Object Pattern) 不同，DAO 本質上還是對於資料庫中的 Table 的 CRUD 操作，而 Repository 則是更加專注於 Domain Model (Aggregate) 的操作。

不過 Repository 並不跟 DAO 或是 ORM 衝突，甚至你可以透過 DAO 或是 ORM 作為 Repository 底層的技術實現。如下圖：

![D67BB86B-B4F4-4572-BDFC-8F753F1898DA.jpeg](https://dynalist.io/u/S2YdVkAFJNGTxpyk-X-a6fu3)
(source: PPPoDDD)

註：這裡的持久化泛指那些將資料存起來的技術，不論是用檔案、資料庫等等都是其中的一種。

## Repository 應用與實作

講到 Repository 的應用前，我們先必須了解他的幾個特點：

1. 它嚴格限制只能從 Aggregate Root 中取得或修改領域物件，確保能夠滿足 Aggregate 內的不變規則。
2. 藉由隱藏持久化技術細節，它提供了客戶端一個與技術無關的「外觀介面」(façade)
3. 他定義了一個領域模型與資料模型的邊界

接著我們來應用以上三個特點來設計我們的 Repository Interface:

```typescript
// domain/model/order/Order.ts
class OrderId extends EntityId<string> {}
interface OrderProps {}
class Order extends Entity<OrderId, OrderProps> {}

// domain/model/order/OrderRepository.ts
interface OrderRepository {
  // get order by id
  ofId(id: OrderId): Promise<Order | undefined>;
  // Upsert
  save(order: Order): Promise<void>;
  // remove order by id
  remove(id: OrderId): Promise<void>;
}
```

Repository Interface 被我放在了 domain 層，與領域模型(ex: `Order`)放在一起，因為這個 Interface 是屬於領域模型的一部份，這樣可以限制 Repository 的設計達到特點 1 的要求 (與 Aggregate 綁在一起)。同時也能滿足分層架構中依賴性的方向 (向內依賴的方向)。

有了 Interface，讓我們來看看實作的方式 (以 Postgres 為範例)：

```typescript
// infrastructure/persistence/order/OrderRepository.ts
class SqlOrderRepository implements OrderRepository {
  private pool: Postgres.Pool;
  constructor(pool) {
    this.pool = pool;
  }

  ofId(id: OrderId): Promise<Order | undefined> {
    const idVal: string = id.val();
    const queryResult = this.pool.query(
      'SELECT * FROM order WHERE id = $1',
      idval
    );
    // 將 queryResult 組成 order
    const order = new Order(/* data from queryResult */);
    return order;
  }

  save(order: Order): Promise<void> {
    // ...
  }
  remove(id: OrderId): Promise<void> {
    // ...
  }
}
```

可以注意到，Repository 實作中，會把技術細節封裝起來，對於客戶端來說，他只需要透過清楚又簡單的介面去使用這個 Repository。

### 將技術框架再抽離出來

這樣的實作方式讓 Repository 只要遵守介面的規範，不管後面怎麼做都沒關係。而在現實之中，隨著效能的需求，我們很有可能會用到多種持久化機制，比如為了效能加入快取、對於沒有明確 schema 的資料加入 NoSQL 或是為了增加搜索效能加入 Elasticsearch。

上面的範例程式碼雖然可以讓你在更換背後機制時不影響客戶端的邏輯，不過我們還可以將這些框架個別抽出來，提高我們的重用性(若是你已經用了 ORM 框架，那你可能可以省略這一步)

首先先定義一個通用的 Repository (Generic Repository)：

```typescript
// infrastructure/persistence/Repository.ts
interface Repository<
  Id extends EntityId<unknown>,
  A extends AggregateRoot<Id, {}>
> {
  exists(id: Id): Promise<boolean>;
  findById(id: Id): Promise<A | undefined>;
  // 提供更靈活的搜尋條件
  findAllMatching(querystring: string): Promise<A[]>;
  add(entity: Entity): Promise<void>;
  update(entity: A): Promise<void>;
  remove(id: Id): Promise<void>;
}
```

然後在 `OrderRepository` 中使用 composition 的概念使用這個 Generic Repository。

```typescript
// infrastructure/persistence/order/OrderRepository.ts
class SqlOrderRepository implements OrderRepository {
  private ordersRepo: Repository<OrderId, Order>;
  constructor(ordersRepo: Repository<OrderId, Order>) {
    this.ordersRepo = ordersRepo;
  }

  ofId(id: OrderId): Promise<Order | undefined> {
    return this.ordersRepo.findById(id);
  }

  save(order: Order): void {
    const existed = await this.ordersRepo.exists(order.id);
    if (existed) {
      await this.orderRepo.update(order);
      return;
    }
    await this.orderRepo.add(order);
    return;
  }

  remove(id: OrderId): void {
    const existed = await this.ordersRepo.exists(order.id);
    if (!existed) {
      throw new Error('Order Not Exists');
    }
    await this.orderRepo.remove(id);
    return;
  }
}
```

很多人在一開始實作時，會直接讓 Repository 繼承一個通用介面，在這邊我並不鼓勵這種做法，因為每一個 Aggregate 對應的 Repository 需求都不一樣，有的專注於多樣化的讀取策略，有的更在乎寫入，你很難抽出一個有意義的通用介面。因此這邊會建議使用上述的 composition 的方式。

註：關於 Entity 與 Entity ID 的實作細節，可以參考第 14 與 15 天的介紹。
註：我這邊遵守 Google Typescript Style Guide，所以不會在 Interface 前面加上 `I` 的前綴詞，讀者可以自行考量是否使用此前綴詞。
註：TypeScript 中 method 的預設存取權限就是 `public`，因此我就不另外加上 `public` 語法。

### 在領域模型與資料模型之間轉換

從技術的觀點來看，「取出已儲存物件」與「建立物件」是一樣的事情。但對於 DDD 來說，把物件取出只是 Aggregate 生命週期的中間。比如從資料庫取出一個 `User` 的資料並非是建立一個新的 `User` 領域模型。

我們把使用「已儲存資料」建立實例 (instance) 的過程稱為**重建 (Reconstituion)**。如下圖所示：

![https://ithelp.ithome.com.tw/upload/images/20191005/20111997IFBGJIF6zv.jpg](https://ithelp.ithome.com.tw/upload/images/20191005/20111997IFBGJIF6zv.jpg)

從 Repository 取出的資料模型要重建成領域模型，而寫入 Repository 的領域模型也要轉成資料模型後才能進入資料庫。

在實作上有很多種方法可以達到這種轉換，最直接的就是把領域模型所有屬性都設 `public` 讓 Repository 存取，不過這會有域模型資料被濫用的可能。另外就是自己實作一個 Mapper，在 Repository 中用來專門做資料的轉換，如下：

```typescript
class OrderMapper {
  public toDomain(raw: any): Order {
    // ...
  }
  public toPersistence(order: Order): Object {
    // ...
  }
}
```

乍看之下，Repository 其實很像 Factory，同樣會回傳一整個 Aggregate，但差別就在於，**Factory 負責處理物件生命週期的開始**，而 **Repository 幫助管理生命週期的中間與結束**。

### Transaction 管理

即使我們會在 Repository 中進行新增、修改與刪除，但 Repository 不應該負責操作 Transaction。因為只有客戶端擁有足夠的上下文資訊去判斷哪些操作要放進同一個 Transaction。

在實作上，我們可以透過外部 ORM 的機制來協助操作 Transaction。如果沒有框架協助，也可以更直接一點，在 Repository 中加入一個 `setter` 指定當前的 session。

```typescript
// domain/model/order/OrderRepository.ts
interface OrderRepository {
  setClient(client: unknown): void {}
}
// infrastructure/persistence/order/SqlOrderRepository.ts
class SqlOrderRepository {
  setClient(client: Postgres.Client): void  {
    this.pool = client;
  }
}

// application/order/PlaceOrder.ts
class PlaceOrder {
  private client: Postgres.Client;
  private order: OrderRepository;
  constructor(pgClient: Postgres.Client, order: OrderRepository) {
    this.orderRepo = orderRepo;
    this.client = pgClient;
  }
  async execute(input: PlaceOrderInput) {
    await this.client.beginTransaction();
    try {
      this.orderRepo.set(this.client);
      // ...
      // ...
      await this.client.commit();
    } catch (error) {
      // handle error
      await this.client.rollback();
    }
  }
}
```

## Repository Method 的設計策略

在設計 Repository 時，要時刻提醒自己 **Repository 是一個外顯的 contract**，Repository 的 contract 並不是一個單純的 CRUD 介面，他是領域模型的延伸並讓讓領域專家也可以理解內部的 method 函式命名。

你的 Repository 應該要從 Application 的使用案例角度出發，而非從資料的 CRUD 層面出發。

因此，我們來介紹一些 Repository 內部 method 設計會遇到哪些情況：

### 寫死查詢

這可以說是最常見的。對於客戶端的使用也最簡單，符合 ["Tell, Don't Ask!"](https://martinfowler.com/bliki/TellDontAsk.html)的原則。在 method 內寫死你的實作細節，但對於外面的客戶端來說，他只要依照 method 的命名來得知意圖。

Repository 的 method 並不是只能回傳領域物件(e.g. `ofId(id: OrderId): Order`，同時也能回傳非物件的資訊，如計算數量、總合等等。

### 靈活查詢

不過有時候，為了提升使用者體驗，比如根據日期、種類、區間等等要求取得 Aggregate 數據。在 Repository 中，也可以加入參數 Specification 化的方式，在提高靈活度的同時也不會失去可讀性。

```typescript
// domain/model/order/OrderRepository.ts
interface OrderSearchCriteria {
  // 日期區間
  dateRange: [Date];
  // 價格區間
  AmountRange: [number];
  // 狀態 filter
  Status: OrderStatus;
}

interface OrderRepository {
  findAllBySearchCriteria(criteria: OrderSearchCriteria): Promise<[Order]>;
}
```

## 其他職責

### 生產 ID

既然 ID 對於 Repository 有重要的意義，那由他生產也是很合理的。因此我們的 Repository Interface 可以多加一條 method:

```typescript
// domain/model/order/OrderRepository.ts
interface OrderRepository {
  // 產生新的 ID
  nextId(): OrderId;
}
```

註：method 名稱大家可以隨意取，`generateId`、`newId()` 等等都可以。

### 回傳匯總計算過的資料

Repository 除了可以回傳一些簡單計算過的資料，甚至可以客製一個 `Summary` 物件如下：

```typescript
// domain/model/order/OrderRepository.ts
interface OrderRepository {
  summary(month: number): OrderMonthlySummary;
}
class OrderMonthlySummary {
  public month: number;
  public orderCount: number;
  public closedOrderCount: number;
}
```

### 作為一層 Anti-corruption Layer

// TODO: 補上

## 測試 Repository

Repository 除了以上提到的好處，我認為他在分層式架構最大的價值之一就是它很好替代成 Fake 測試，甚至可以在你寫 application service 時完全不真正實作底層的持久化機制。

首先是測試 Repository 實作本身，這就必須依賴真實的資料庫參與。另外就是使用假 Repository 在 Application Service 中做測試，我們簡單介紹這種方式：

```typescript
// infrastructure/persistence/order/InMemoryOrderRepository
class InMemoryOrderRepository implements OrderRepository {
  orderMap: { [index: string]: Order };
  constructor() {
    this.orderMap = {};
  }

  ofId(id: OrderId): Promise<Order | undefined> {
    const idVal = id.value;
    return this.orderMap[idVal];
  }

  save(order: Order): Promise<void> {
    this.orderMap[idVal] = order;
  }
  // remove order by id
  remove(id: OrderId): Promise<void> {
    const idVal = id.value;
    if (!this.orderMap[idVal]) {
      throw new Error('Order Not Found')
    }
    this.orderMap[idVal] = undefined;
  }
}

// application/order/__tests__/PlaceOrder.test.ts
it('sholud place an order', async ()) => {
  const inMemoryOrderRepository = new InMemoryOrderRepository();
  const usecase = new PlaceOrder(inMemoryOrderRepository);
  const input: PlaceOrderInput = {
    // ...
  }
  const output: PlaceOrderOutput = await usecase.execute(input);

  // assertion

}
```

### Summary

向客戶端隱藏實作細節。比如 ORM，直接用很開心，但當哪一天你想替換掉時，你的整個系統大概就要重寫了。簡單來說 Repository 提供了以下好處：

- 他們未客戶提供了一個簡單的模型，可用來獲取「持久化物件」並管理他們的生命週期
- 他們使應用程式、領域設計與持久化技術(多個資料表或資料庫)解開耦合
- 他們表現了有關物件存取的設計決策
- 容易測試。可以將他們替換為「虛擬實作」(通常會用記憶體內的集合)

當客戶端不需要知道實作的細節，僅需遵照 Repository 透露出來的介面使用。那就可以利用**與客戶解耦的優點**，更容易修改 Repository 的實作，如果今天客戶直接呼叫底層機制，那我們就很難修改他的實作。

同時解耦後，關注點分離讓我們可以專注在 Repository 的性能提升，即使實作得再醜也不會影響客戶端的使用。你想要改快取、寫在記憶體都可以。
甚至，可以藉由記憶體中(in-memory)的機制來做測試，這樣的好處是甚至當你寫完八成的使用案例時，你還不需要考慮你要用哪一種資料庫。

另外，若是你對 C# 或是類似的 OO 特性的語言的實作有興趣，可以下載 PPPoDDD 的[範例 code (chapter 21)](http://www.wrox.com/WileyCDA/WroxTitle/Patterns-Principles-and-Practices-of-Domain-Driven-Design.productCd-1118714709,descCd-DOWNLOAD.html)

## Reference

- [cover photo from unsplash - Ramon Cordeiro](https://unsplash.com/photos/ZsHqFTWynv8)
- [What is the difference between DAO and Repository patterns?](https://stackoverflow.com/questions/8550124/what-is-the-difference-between-dao-and-repository-patterns)
