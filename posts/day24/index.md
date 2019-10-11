# DDD 戰術設計：Domain Event 領域中的重要事件

![](https://images.unsplash.com/photo-1447069387593-a5de0862481e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)

DDD 的一系列的戰術設計環節可以避免我們設計出貧血模型，所以我們可以很輕鬆的使用 Domain Model 的 Method 如 `User.saveProfile`、`Order.close` 封裝資料處理的細節。不過當你在跟領域專家訪談時，聽到「當」的時候該怎麼解決呢？比如商家為了因應最近的購物節而決定加入新的條件。

```markdown
在購物月期間，**當**客人將第三筆訂單(不限金額)結案時，將客人升級為 VIP 等級。
```

在這個新的需求出現後，工程師發現要把新的商業邏輯(而且有時限)加入現有的系統十分困難，不但跨 Aggregate (訂單、客人）甚至容易影響到現有功能。這時候就可以考慮使用 Domain Event。**任何時候聽到「當」這個關鍵字時，就代表有一個「事件」可以被我們處理**，我們可以把這個 Domain Event 獨立地建立出來，讓所有關心這個事件的人訂閱它。如此一來，不但維持了程式間的邊界，也維持了各自的自治性，同時也可以保證 Aggregate 間的最終一致性。

## 何謂領域事件

在 Event Storming 時，我們曾經提過，事件就是「領域專家在乎的事件」。

> 將領域中所發生的活動當作一系列的離散事件來建立 Model。每個事件都用 Domain Object 來表示 ...領域事件是 Domain Model 組成的一部份，表示**領域中所發生的事情**。
> [from Eric Evans]

既然領域事件在領域層之中，那他由 Aggregate 發出與接收就是一件很自然的事情。至於如何搜集領域中的事件呢？當你從領域專家口中聽到以下關鍵字時，就要特別注意：

- "當...:"
- "如果發生...:"
- "當 ... 的時候，請通知我:"
- "發生 ... 時:"

不過有時候，你無法期待領域專家可以明確地表達出所有的領域，尤其是那些跨 Bounded Context 的事件，甚至需要不同團隊或是不同的領域專家一起討論才能發現。而那些跨 Bounded Context 的事件在實作上也可能需要有另外的消息處理機制 (e.g. Message Queue)來處理。

你可以由下圖來理解一個 Domain Event 的使用流程：

![https://ithelp.ithome.com.tw/upload/images/20191010/20111997E3HqN0uWQL.png](https://ithelp.ithome.com.tw/upload/images/20191010/20111997E3HqN0uWQL.png)

我們可以歸納出一個大致的流程：

1. Aggregate 建立一個 Event
2. Aggregate 使用 Event Publisher 將 Event 發布出去
3. 可能會有三種訂閱方接收到這個 Event
   - 事件儲存訂閱方：將收到的 Event 儲存起來 (可用於實作 Event Sourcing)
   - 簡單訂閱方：在同一個 Bounded Context 的訂閱方，可以用一般的 Observer 模式來實作。
   - 跨系統訂閱方：此項事件會需要被另一個系統或是 Bounded Context 所關注，所以收到 Event 後會轉發到 Message Queue 機制 (Infrastructure 層) 後再轉發 Event 出去給訂閱方。

## 實作 Domain Event

我們就用上面的購物月活動來嘗試實作 Domain Event 吧！再讓我們重溫一次需求：

```markdown
在**購物月**期間，**當**客人將第三筆訂單(不限金額)**結案**時，將客人升級為 **VIP 等級**。
```

在建立 Domain Event 時，同樣也要根據 Bounded Context 內的 Ubiquitous Language 來建立 Model。對於上面的例子，我們可以做出這樣的分析與命名：

- Command: `Close Order`
- Aggregate: `Order`
- Output Event: `OrderClosed`

在 Domain Event 的命名上，由於是一個「事件」，所以傾向用過去式來命名。此外，命名的規則與長度是自由的，以符合 Ubiquitous Language 為準則，你也可以用 `OrderClosedByNormalShopper` 等等來表達出更多的細節。

有了事件名稱後，我們來看看一個通用的 Domain Event 會有哪些特徵：

```typescript
interface DomainEvent {
  readonly Date occuredAt;
  readonly name: string;
  readonly version: number;
}
```

第一，一個 Event 會需要時間戳記；第二，我們的 Event 可能會隨著需求變更而修改資料內容，因此一個 `version` 可以幫助我們在推上新版本 Event 時，可以讓那些還在外面流通的舊版本 Event 被正確的處理。

至於一個 Domain Event 是否需要有一個全局唯一的 ID，則是看使用場景，如果這個 Domain Event 僅在同一個 Bounded Context 內活動，那就不太需要，但是如果它會被跨 Bounded Context 的傳送，那就一定要加上 ID。

```typescript
// xxBoundedContext/domain/model/order/events/OrderClosed.ts
class OrderClosed implements DomainEvent {
  readonly Date occuredAt;
  readonly version: number;
  readonly orderId: string;
  readonly shopperId: string;
  constructor(props: { orderId: string, shopperId: string }) {
    this.name = 'OrderClosed';
    this.occuredAt = new Date();
    this.version = 1;
    this.orderId = orderId;
    this.shopperId = shopperId;
  }
}
```

建立完 Domain Event 後，接著就是比較有趣的部分：到底該怎麼處理這個 Domain Event？最常見的方法是在 Application Service 裡建立好訂閱方後再去操作 Domain Model，然後在 Domain Model 的行為中產生 Domain Event 讓外面的訂閱方接收與處理。不過在細節上可以依照 Event 處理方式與時機點分為以下幾種方式：

註：由於我認為用過去式來表達 Event 十分清楚，因此我在命名上不會在後面再加上 `Event` 的後綴詞。

### 方法 1: Callback 處理法

最簡單的方法就是傳入一個 Callback 給 Domain Model 去處理，讓我們看一下 Application Service 的程式碼：

```typescript
// xxBoundedContext/application/order/CloseOrder.ts
interface CloseOrderInput {
  orderId: OrderId;
}

interface CloseOrderOutput {
  // ...
}

class CloseOrder
  implements ApplicationService<CloseOrderInput, CloseOrderOutput> {
  private orderRepo: OrderRepository;
  private userRepo: UserRepository;

  constructor(orderRepo: OrderRepository, userRepo: UserRepository) {
    this.orderRepo = orderRepo;
    this.userRepo = userRepo;
  }

  async execute(input: CloseOrderInput): CloseOrderOutput {
    const order: Order = await this.orderRepo.ofId(input.orderId);

    if (order === undefined) {
      // handling errro;
      return {
        /* error */
      };
    }

    order.addOrderClosedHandler(this.onOrderClosed.bind(this));
    order.close();
    await this.orderRepo.save(order);

    return {
      /* success */
    };
  }

  private onOrderClosed(event: OrderClosed) {
    // 檢查是否是第三個結案訂單以及升級服務
    // 或是將 Event 發送到外部 message queue
  }
}
```

讓我們看一下 `Order` Domain Model 的內部：

```typescript
// xxBoundedContext/domain/model/order/Order.ts
import { OrderClosed } from './events/OrderClosed.ts';

type OrderClosedHandler = (event: OrderClosed) => void;
class Order extends AggregateRoot<OrderId, OrderProps> {
  private orderClosedHandlers: OrderClosedHandler[];
  addOrderClosedHandler(handler: OrderClosedHandler) {
    this.orderClosedHandlers.push(handler);
  }

  close() {
    // 做一些檢查...

    this.props.status = OrderStatus.CLOSED;
    const event = new OrderClosed({
      orderId: this.id.toVal(),
      shopperId: this.props.shopperId.toVal()
    });
    this.orderClosedHandlers.forEach(handler => handler(event));
  }
}
```

一個 Domain Event 很容易就能被 Callback 方法解決。不過這有一個問題在於，一個事件不只一個訂閱方也可能不只一種 Domain Event， Callback 的方法可能不利於更複雜的情境。因此我們將介紹另一種處理機制：簡單的 Domain Event Publisher。

### 方法 2: Domain Events Publisher 立即發出

在 IDDD 書中，作者自己建立一了一個簡單的 Publisher & Subscriber 機制： Static 的 `DomainEventPublisher`。由於是 Singleton 模式，每一個 Domain Model 都可以直接引用 `DomainEventPublisher` 唯一實例然後發出 Domain Event。

```typescript
import { DomainEvent } from './DomainEvent';
import { EntityId } from '../EntityId';
import { AggregateRoot } from '../AggregateRoot';

type DomainEventHandler<T> = (event: T) => void;

export class DomainEventPublisher {
  private static instance: DomainEventPublisher;
  private handlersMap: {
    [index: string]: Array<DomainEventHandler<DomainEvent>>; // a event can have many subscribers
  };

  private constructor() {
    this.handlersMap = {};
  }

  // singleton 模式
  static getInstance(): DomainEventPublisher {
    if (!DomainEventPublisher.instance) {
      DomainEventPublisher.instance = new DomainEventPublisher();
    }
    return DomainEventPublisher.instance;
  }

  register<T extends DomainEvent>(
    eventName: string,
    eventHandler: DomainEventHandler<T>
  ): void {
    if (!this.handlersMap.hasOwnProperty(eventName)) {
      // 目前沒有該 event 訂閱方則加進去
      this.handlersMap[eventName] = [
        eventHandler as DomainEventHandler<DomainEvent>
      ];
    } else {
      // 有的話加在後面
      this.handlersMap[eventName].push(eventHandler as DomainEventHandler<
        DomainEvent
      >);
    }
  }

  clearHandlers(eventName): void {
    this.handlersMap[eventName] = [];
  }

  // 公開的 publish 方法
  publish(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name;
    if (this.handlersMap.hasOwnProperty(eventClassName)) {
      const handlers: Array<DomainEventHandler<DomainEvent>> = this.handlersMap[
        eventClassName
      ];
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  publishAll(events: DomainEvent[]): void {
    for (const event of events) {
      this.publish(event);
    }
  }
}
```

有了一個簡單的 `DomainEventPublisher`，接著來修改 Application Service：

```typescript
// xxBoundedContext/application/order/CloseOrder.ts
class CloseOrder
  implements ApplicationService<CloseOrderInput, CloseOrderOutput> {
  private orderRepo: OrderRepository;
  private userRepo: UserRepository;

  // constructor...

  async execute(input: CloseOrderInput): CloseOrderOutput {
    const order: Order = await this.orderRepo.ofId(input.orderId);

    if (order === undefined) {
      // handling errro;
      return {
        /* error */
      };
    }

    DomainEventPublisher.instance().register(
      OrderClosed.name,
      this.onOrderClosed.bind(this)
    );
    order.close();
    await this.orderRepo.save(order);

    return {
      /* success */
    };
  }

  private onOrderClosed(event: OrderClosed) {
    // 檢查是否是第三個結案訂單以及升級服務
    // 或是將 Event 發送到外部 message queue
  }
}
```

讓我們看一下 `Order` Domain Model 的內部：

```typescript
// xxBoundedContext/domain/model/order/Order.ts
import { OrderClosed } from './events/OrderClosed.ts';

class Order extends AggregateRoot<OrderId, OrderProps> {
  close() {
    // 做一些檢查...
    this.props.status = OrderStatus.CLOSED;
    const event = new OrderClosed({
      orderId: this.id.toVal(),
      shopperId: this.props.shopperId.toVal()
    });
    DomainEventPublisher.publish(event);
  }
}
```

是否覺得清爽很多？

### 方法 3: Domain Events 先存再發

加入了 Static `DomainEventPublisher` 雖然讓事件處理的細節移出了 Domain Model，不過這樣的模式仍有一些問題：有副作用且不好測試。

與其直接使用 `DomainEventPublisher` 立即發出事件，或許我們也可以先將**事件都記錄起來**，且可以自由決定是要在 Transaction 前或後執行這些 Event。

於是我們可以改造我們的 Aggregate Root，讓裡面可以存放 Domain Event：

```typescript
import { Entity } from './Entity';
import { EntityId } from './EntityId';
import { DomainEvent } from './event/DomainEvent';

export abstract class AggregateRoot<
  Id extends EntityId<unknown>,
  Props
> extends Entity<Id, Props> {
  private domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  protected addDomainEvents(domainEvents: DomainEvent[]): void {
    this.domainEvents.push(...domainEvents);
  }

  clearEvents(): void {
    this.domainEvents = [];
  }
}
```

讓我們來看看修改過的 `Order` Domain Model:

```typescript
// xxBoundedContext/domain/model/order/Order.ts
import { OrderClosed } from './events/OrderClosed.ts';

class Order extends AggregateRoot<OrderId, OrderProps> {
  close() {
    // 做一些檢查...
    this.props.status = OrderStatus.CLOSED;
    const event = new OrderClosed({
      orderId: this.id.toVal(),
      shopperId: this.props.shopperId.toVal()
    });
    this.addDomainEvent(event);
  }
}
```

如此一來， `Order` 在測試 `close` 時，就不需要額外考慮 `DomainEventPublisher` 的副作用，而且僅需要檢查 `domainEvents` 這個 Array 裡面的參數。

最後讓我們來看 Application Service 會變成怎樣：

```typescript
class CloseOrder
  implements ApplicationService<CloseOrderInput, CloseOrderOutput> {
  // constructor...

  async execute(input: CloseOrderInput): CloseOrderOutput {
    const order: Order = await this.orderRepo.ofId(input.orderId);

    if (order === undefined) {
      // handling errro;
      return {
        /* error */
      };
    }

    DomainEventPublisher.instance().register(
      OrderClosed.name,
      this.onOrderClosed.bind(this)
    );
    order.close();
    // 在 Application Service 再決定發出 Domain Events
    DomainEventPublisher.instance().publishAll(order.domainEvents);
    await this.orderRepo.save(order);

    return {
      /* success */
    };
  }
}
```

註：也有另一種實作方式是把 Events 存在 Entity 上。

## Summary

在一開始學習 Domain Event 時感到困惑是很正常的，因為這跟我們平時直線式的程式執行邏輯不太一樣。因此，相較於其他學習資源，我把 Domain Event 放到後面一點再講，等大家都了解 Aggregate、Application Service 後講 Domain Event 以及實作會更有感覺！

我並非要求大家一定要使用 Domain Event，因為它有一定的複雜度。不過應用 Domain Event 可以提高系統各個邊界內的自治性，在未來也可以應用 Event-Driven 的設計拆分出微服務。

## Reference

- [cover photo from unsplash from Joanna Kosinska](https://unsplash.com/photos/B6yDtYs2IgY)
- [A better domain event pattern](https://lostechies.com/jimmybogard/2014/05/13/a-better-domain-events-pattern/)
- [Domain Event vs Integration Event](https://devblogs.microsoft.com/cesardelatorre/domain-events-vs-integration-events-in-domain-driven-design-and-microservices-architectures/)
- [Handling Domain Event](https://piotrgankiewicz.com/2016/08/01/handling-domain-events/)
- [Strengthening Your Domain - Domain Events](https://lostechies.com/jimmybogard/2010/04/08/strengthening-your-domain-domain-events/)
- [領域事件：設計和實作](https://docs.microsoft.com/zh-tw/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation)
