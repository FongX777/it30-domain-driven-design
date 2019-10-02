# Event Storming Part 3 - 軟體設計

-> Aggregate 先不命名，先寫 Invariant
-> Bounded Context Canvas

![cover photo](https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)

今天來跟大家聊聊，該怎麼把 Event Storming 的成果進一步轉換為軟體設計吧！
這一個階段就不需要領域專家的協助，可以把相關負責的開發者聚起來一起討論！

本篇概要：

- Aggregate 將 Model 聚合起來
- Bounded Context 找出軟體的邊界
- 導入 DDD

## Aggregate 將 Model 聚合起來

經過昨天的努力，我們可以看到牆上最多的就是 Command 與 Event。而這些並不是單純的商業語言而已，他們都有可能成為你程式中一個個的 Model。比起從瑣碎的規格書中拼湊出 Model 設計，從確切的流程中找出來會更貼近需求！

Aggregate (聚合)的意思就是軟體中的 Model，只是他的顆粒度可大可小，一個 Aggregate 可以包含數個 Model。所以接下來這個階段，請大家拿出長方形、黃色的 Aggregate 貼在讓你覺得「這個 Aggregate Model 可以處理這個 Command 並發出這個 Event」的 Command 與 Event 之間。簡單來說，就是如果你覺得某個 Command 與 Event 針對同一個 Model 做操作，那就可以貼上去。

通常來說，會飆上 Aggregate 的都是你核心的 Model 元件，這對之後的程式碼設計很有幫助。

![https://ithelp.ithome.com.tw/upload/images/20190925/20111997LKR46X1xEJ.png](https://ithelp.ithome.com.tw/upload/images/20190925/20111997LKR46X1xEJ.png)

- Hold off on the Aggregate name until absolutely necessary. I usually create a dummy name such as `combobulator` and put it on the wall. Teams tend to try naming it without fully knowing it. Once you’ve walked through the flow several times you’ll know enough to name it!

### Aggregate 就像是一台 state machine

其實你可以把 Aggregate 想成是一個 [State Machine (有限狀態機)](https://zh.wikipedia.org/wiki/有限状态机)，一個 Model 會有很多的狀態，因此一種 Aggregate 可能會對應到多組 Command 與 Event。

![https://ithelp.ithome.com.tw/upload/images/20190925/20111997xL2XPhs6kr.png](https://ithelp.ithome.com.tw/upload/images/20190925/20111997xL2XPhs6kr.png)

### 將 Aggregate 再聚合

當你做完第一階段時你會發現，很多 Aggregate 本身不太合理，比如一個 OrderItem (訂單品項)有可能在一開始成為一個 Aggregate，但實務上，你每次修改 OrderItem 時，一定會跟他本身的 Order 做互動以及邏輯檢查，比如一個 Order 的 OrderItem 數量不能為 0 ，這種規則我們稱為 Invariant (不可變規則)。

因此，這時你可以把 OrderItem 都替換成 Order。這邊可以發現 Aggregate 可以做到在他的邊界裡的 Model 都能符合一致的商業邏輯規定。

### Aggregate Naming

有時候，Aggregate 的命名沒有那麼容易，他有可能很抽象，或是你找不到適合的名字。也有可能你不知道他該不該再跟更大的概念聚合。

可以思考：

- 他有什麼職責。
- 你的系統如何需要他？
- 如果我要把它寫成一個 class ，他需要做些什麼？

這邊有一個實用的方法供大家參考，也是 Alberto Brandolini 本人推薦的。那就是先放「空白的 Aggregate」，但在 Aggregate 中會寫上一些固定規則 (Invariant)，比如這個 Aggregate 的新增修改時會觸動的一些檢查，在過程中都不需提到 Aggregate 的名稱。

之後在依照這些還沒得到名字的 Aggregate 用上面的業務規則各自分類，此時你就會知道應該屬於誰了。

Only later ask them to group the business rules ‘as-they-would-with-code’. Developers usually get this well. They’ll naturally find good names for these Aggregates (of business rules).

### Aggregate 效能考量

## Bounded Context 找出軟體的邊界

有了 Aggregate 後，你可以拿出你的奇異筆將你覺得功能類似的地方圈起來，這個界線就有可能成為你的 Bounded Context。關於 Bounded Context 的敘述可以看前面的文章。

### 分出不同 Bounded Context 的類型

- Core
- Generic
- Supportive

https://philippe.bourgau.net/build-or-buy-software-identify-your-core-functional-areas-with-event-storming-and-ddd/

### 彼此依賴關係

## 導入 DDD

找出 Bounded Context 間的關鍵 Event ，那有可能成為你的 Domain Event 或 Intergation Event

[How to use Event Storming to introduce Domain Driven Design](https://philippe.bourgau.net/how-to-use-event-storming-to-introduce-domain-driven-design/)

## 📚Resources

- [cover photo](https://unsplash.com/photos/KE0nC8-58MQ)
- [Using Event Storming and DDD to prototype (micro)services and NFRs - 1](https://philippe.bourgau.net/using-event-storming-and-ddd-to-prototype-microservices-and-nfrs-1/)
- [Using Event Storming and DDD to prototype (micro)services and NFRs - 2](https://philippe.bourgau.net/using-event-storming-and-ddd-to-prototype-microservices-and-nfrs-2/)
- [How to use Event Storming to introduce Domain Driven Design](https://philippe.bourgau.net/how-to-use-event-storming-to-introduce-domain-driven-design/)
- [Rewrite vs Refactor? Get Insights from Event Storming and DDD](https://philippe.bourgau.net/rewrite-vs-refactor-get-insights-from-event-storming-and-ddd/)
- [How to use Event Storming and DDD for Evolutionary Architecture](https://philippe.bourgau.net/how-to-use-event-storming-and-ddd-for-evolutionary-architecture/)
