# DDD 戰術設計：工廠模式

![](https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)

今天要介紹的工廠模式 (Factory Pattern)，詳細的內容我就不再贅述。本次我主要關注的是如何在 DDD 中使用工廠模式。

在 DDD 如果能夠適當地使用工廠方法，可以幫助我們在符合 Ubiquitous Language 與領域知識的狀況下，更快速與簡單地創建 Aggregate。

## 為什麼要使用工廠模式

一個 Aggregate 往往由多個物件所組成，加上一個物件可以能有多種類型，這樣所搭配出來的可能性將會讓 Aggregate 不好建立。因此我們可以考慮把建立複雜的物件或是 Aggregate 的職責分配給一個單獨的物件。該物件不會替代原本的業務邏輯，而是封裝複雜的建立過程，讓我們可以更容易取得 Aggregate。

當我們的 Aggregate 越多時，工廠方法的好處就越顯而易見。因為 Aggregate 越多，其中一個 Aggregate 內的物件可能要引用其他多個 Aggregate Root ID，這樣的複雜性可能會導致建立時搞混了 Aggregate Root ID 的參數位置，進而發生災難性的後果。

## 如何使用：Aggregate 產生 Aggregate

舉一個論壇為例，一個論壇 (`Forum`) 可以產生多個討論 (`Discussion`)，而一個討論可以加入多個回覆 (`Post`)。在一開始，你可能會把 `Forum` 建為一個大 Aggregate，裡面包含有 `Discussion`，而 `Discussion` 裡面包含有 `Post`。

![https://ithelp.ithome.com.tw/upload/images/20191004/20111997Ig49ULYbqK.png](https://ithelp.ithome.com.tw/upload/images/20191004/20111997Ig49ULYbqK.png)

接著，你考量到以下幾個使用案例：

1. 該網站可以有多個 `Forum`
2. 一個 `Forum` 可以有上千個 `Discussion`。
3. 一個 `Discussion` 可以有上千個 `Post`。
4. 可以會有多個人同時建立不同的 `Discussion`。
5. 可以會有多個人同時發出不同的 `Post`。

你開始覺得，當有一人在建立 `Forum` 會鎖住整個 Table，甚至影響某位使用者送出新的 `Post` 很不合理。因此把大 Aggregate 拆分為數個：

![https://ithelp.ithome.com.tw/upload/images/20191004/20111997wPs3oxLNVp.png](https://ithelp.ithome.com.tw/upload/images/20191004/20111997wPs3oxLNVp.png)

不過這時候你發現，要建立一個 `Discussion` 可能需要部分來自 `Forum` 的資料，甚至如果該 `Forum` 已經關閉，那就不能產生任何 `Discussion`，而 `Post` 的建立同樣需要一些 `Discussion` 的資料。因此我們再畫出以下關係：

![https://ithelp.ithome.com.tw/upload/images/20191004/201119974HlEwBq7lT.png](https://ithelp.ithome.com.tw/upload/images/20191004/201119974HlEwBq7lT.png)

上圖中虛線的就是工廠方法，可以透過上層 Aggregate 來產生下層 Aggregate，讓客戶端不必接觸過多實作細節，並且可以很明確的表示出兩個 Aggregate 間的關係。讓我們看一下 `Forum` 與 `Discussion` 間的程式碼會怎麼實作：

```typescript
// domain/model/forum/Fourm.ts
interface FourmProps {
  id: ForumId;
  ownerId: UserId;
  closed: boolean;
  description: string;
  subject: string;
}
class Forum extends Aggregate<ForumProps, ForumId> {
  startDiscussion(
    discussionId: DiscussionId,
    author: Author,
    subject: string
  ): Dicussion {
    // 還可以順便加入領域知識的判斷。
    if (this.closed) {
      throw new Error('Fourm has been closed.');
    }
    // 回傳 Discussion 物件
    return new Discussion({
      id: discussionId,
      forumId: this.id,
      ownerId: this.ownerId,
      author,
      subject
    });
  }
}

// domain/model/discussion/Discussion.ts
interface DiscussionProps {
  id: DiscussionId;
  forumId: ForumId;
  ownerId: UserId;
  author: Author;
  subject: string;
}

class Discussion extends Aggregate<DiscussionProps, DiscussionId> {}
```

由上面可以看到，使用工廠方法可以少傳兩個參數，而且那幾個參數也是很容易取得的參數。或許有人覺得兩個參數而已，但我認為這樣做讓函式的意圖更加明顯，同時也可以做到更完整的業務規則檢查。

## Summary

工廠方法我覺得帶來最大的好處是可以加強領域知識的注入，讓物件用起來更符合業務情境與語意。

## Reference

- [cover photo from unsplash - Christopher Burns](https://unsplash.com/photos/8KfCR12oeUM)
