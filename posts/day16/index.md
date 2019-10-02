# DDD 戰術設計：Aggregate 聚合設計

![](https://images.unsplash.com/photo-1444210971048-6130cf0c46cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80)

當我們的領域擁有越來越多的 Entity 與 Value Object，根據業務規則的需求，模型之間關聯性的複雜度可能會超出我們的想像。尤其是當你越想要在生命週期中維護完整性，你就越難管理他們的關聯。

一個物件的生命週期的變化大概上會如下圖 (Value Object 則只有建立與刪除)，可以看到一個物件的變化很多時候還會觸發連鎖反應。

![https://ithelp.ithome.com.tw/upload/images/20191002/20111997p4gLEmyDtq.png](https://ithelp.ithome.com.tw/upload/images/20191002/20111997p4gLEmyDtq.png)
(Ref: DDD Book)

今天的文章將會介紹 Aggregate 來為這些互相牽連的物件們畫立一個清晰的界線，減少互動的複雜性以及保護界線內規則的完整性，並試圖回答以下問題：

1. 如何處理模型之間複雜的關聯性?
2. 我們該如何在複雜的關係中找出一個邊界？
3. 如何把這個關聯性連同模型存入資料庫？
4. 使用 Repository 模式時是否要為每個 Entity 都建立一個 Repository?

首先，我們先由罪惡的源頭：「狀態更改」開始說起。

## Aggregate 模式：確保更改的一致性

我們都了解，在具有複雜關聯性的模型中，要想確保「物件更改的一致性」是很困難的，尤其是當事物之間的關聯性糾纏在一起。比如一張訂單由訂單品項、折扣、金流、物流、發票等要素組成，但一旦你修改了一個訂單品項，你必須連帶地重新計算折扣(滿額折扣)、金流(刷退重新付款)、物流(金額限制)、發票(廢除後重新開立)，甚至可能還會影響會員等級的升降。

因此，我們需要 Aggregate 的幫助來降低這些複雜性。**Agregate 是一群相關聯的物件的組合，讓我們可以把它作為一個狀態變更的單位**。而每個 Aggregate 都需要有一個 Entity 作為他的 Aggregate Root，**任何的改變與事件傳遞，都要先通過 Aggregate Root**，再傳到裡面的元件。

在引入 Aggregate 前，我們的模型設計會像是下圖，必須隨時面對不知道從哪裡來的狀態變更，還需要維持整體模糊的完整性。

![https://ithelp.ithome.com.tw/upload/images/20191002/20111997oBvOQAM28D.png](https://ithelp.ithome.com.tw/upload/images/20191002/20111997oBvOQAM28D.png)

讓我們看看若是我們將這些物件都放入 Aggregate 的邊界內，然後指定 `Order` 這個 Entity 作為 Aggregate Root，我們的模型會變成如何：

![https://ithelp.ithome.com.tw/upload/images/20191002/20111997CpU3Q8hRGE.png](https://ithelp.ithome.com.tw/upload/images/20191002/20111997CpU3Q8hRGE.png)

可以看到，不論是何種狀態變更，都必須先經過 Aggregate Root `Order` 才能進入跟裡面的物件做互動，而 Aggregate Root 不但可以很好地處理這項需求，也可以同時遵守「資料變化時必須保持一致的規則」，也就是俗稱的**固定規定 (Invariant)**。

讓我們來看看一個訂單概念可能會有多少的固定規則：

1. 訂單品項 (OrderItem) 的內容與數量可以被新增、減少或異動，但最終**總數量不能為 0**、最終**總額不能小於 0**。
2. 訂單金流有**最低**與**最高**訂單金額使用限制。
3. 訂單物流有**最低**與**最高**訂單金額使用限制，而且新增品項時也要考量某些商品搭配**特定物流**(如冷藏宅配)。
4. 台灣政府規定，若是信用卡付款，電子發票須加註**卡號後四碼**。
5. 訂單若是取消，則將**金流退款**、訂單品項相關的商品**加回庫存**。
6. 其他更多

讀者可以試著思考看看，如果沒有 Aggregate 的幫助，要如何靠一團鬆散的物件保證業務的正確性？更別提與其他的 Aggregate 做交流這件事情。假如今天訂單品項修改數量僅會單純地影響庫存變化，那你原先的物件關聯路徑會像這樣：`OrderItem.update()` → `Order.check()` → `Order.update()` → `Inventory.update()`，如果使用 Aggregate，那就會變成 `Order.updateItem()` → `Inventory.update()`，一下子就簡單許多。

### Aggregate 的設計原則

由以上的案例，我們就可以帶出幾個 Aggregate 的設計原則：

- Aggregate Root 的 Entity 必須要在 Bounded Context 中有唯一標示性，它的 ID 不能與其他 Aggregate Root 重複。
- Aggregate Root 負責檢查邊界內所有固定規則。
- Aggregate 外的物件不能引用除了 Aggregate Root 之外的任合內部物件。
- 根據上一條規則，只有 Aggregate Root **才能直接透過資料庫查詢**來獲取。內部的其他物件都要透過 Aggregate Root 才能取得。
- Aggregate 內部物件可以引用其他 Aggregate Root，但**僅能引用該 Aggregate Root 的 ID**。
- 刪除操作必須一次刪除 Aggregate 邊界內的所有物件
- 當提交對 Aggregate 內部的任何物件的修改時，整個 Aggregate 的固定規則都要被滿足，意指一次就要存整個 Aggregate 進去。

這邊可能會有人會有效能上的疑慮。寫入方面，將變更寫入資料庫要一次將整個 Aggregate 塞進去不但消耗效能且會一次鎖住 Aggregate 內的所有物件的資料表 (table)，聽起來很不實際。因此，我們後面會有相關的設計來縮小 Aggregate 的大小，而且事實上比起效能，大多時候「正確性」應該要先被優先考慮，再來才是對有需要的效能做優化。

再來是讀取方面，有可能我今天僅需要一個訂單列表僅包含「訂單編號」與「訂單狀態」兩個欄位，不需要後面跟著一坨拉庫的詳細品項、金物流、發票等等。同樣地，如果這真的造成很大的效能隱憂，到時候可以再考慮引入 CQRS 模型來對讀取做優化。在 CQRS 模型中，你的每次 Query 可以自行客製化內容，而不需要直接引用 Aggregate。

## 如何找出 Aggregate

找出 Aggregate 的方式有很多，其中之一就是透過 Event Storming 找出固定規則以及有相關連的物件，可以參考前面的篇漲。另外，我們還有一些方法可以幫助你。

### 第一步：數大便是美

設計 Aggregate 有一個觀念：

> Aggregate 拆越大，複雜度越低、效能越差；Aggregate 拆越小，複雜度越高、效能越好。

當你的 Aggregate 拆越小越多，你就要負責維持彼此間的**最終一致性**，所以任何的設計方法都有他的優缺點。因此設計的第一步就是：越大越好。

當然，並不是說只建立一個就好，舉商店來說，最大的聚合就是 `Shop` 這個物件，但如果你今天把所有其他的 `Order`、`Prodcut`、`Discount` 等等都放在 `Shop` 這個 Aggregate 裡，那就會發生一些不方便的事情。比如你只是想更改 `Shop` 的商店說明，你卻要鎖住所有的 Table，連訂單都不能建立，直到 `Shop` 更新完成。

當你先用這個方式，雖然不盡完美，但你可以先快速產出一個大概。

### 第二部：短小才能精幹

有了大 Aggregate 之後，開始可以透過更多的使用案例來對聚合做更多設計。特別注意**那些可能由兩個以上使用者同時修改一個 Aggregate 的情況**。

比如原先由於訂單是屬於會員的，而且訂單也關乎會員的購物金與等級，於是你把 `Order` 規劃到 `Member` 的 Aggregate 底下。但問題來了，有可能當會員在下訂單的同時，商家正在進行對會員寄送購物金的動作而讓會員下單失敗，這件事情是不能被接受的！因此我們可以把 `Order` 與 `Member` 分開成兩個 Aggregate，但是 `Order` 身上帶有 `MemberID` 來保持它對於 `Member` 的引用。

## Aggregate 實作

其實在實作方面，Aggregate 比較像是一個邊界而非一個實際的物件，所以我們僅會實作 `AggregateRoot` class 讓 Aggregate Root 去繼承。而實際上那也還是一個 Entity，因此表達性意義大於實際意義。不過之後會介紹到 Domain Event，若是想要實作這個模式的，我們會在之後對 Aggregate 做擴展。

```typescript
export abstract class AggregateRoot<
  Id extends EntityId<unknown>,
  Props
> extends Entity<Id, Props> {}
```

## Summary

如果說 Bounded Context 像是國界，阻擋外部勢力的不當入侵。那麼 Aggregate 就像是國界內的一個個小幫派，而幫派之間只能透過老大(Aggregate Root) 來溝通，幫派之內也只有老大 (Aggregate Root)可以指派小弟 (Aggregate 內其他物件) 做事情。

不過 Aggregate 可能是 DDD 最複雜的設計模式之一，下一篇我們將繼續探討 Aggregate 更多的設計守則吧！

## Reference

- [cover photo from unsplash, Kimson Doan](https://unsplash.com/photos/AZMmUy2qL6A)
