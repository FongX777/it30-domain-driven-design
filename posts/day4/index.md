# 戰略設計：Bounded Context 深度解析

![](https://images.unsplash.com/photo-1483286603667-e00f31da5e77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1191&q=80)

前面提到：我們會以 Bounded Context 作為邊界，並且依據 Ubiquitous Language 對其中的 Domain Model 編寫軟體模型。讓 Domain Model 的屬性與其行為在 Context 內得到**完整的含義與一致的定義**。

但問題來了，我們該如何找出 Bounded Context？又有什麼注意事項呢？

本篇文章將為各位揭開 Bounded Context 神秘的面紗，並且聚焦在以下幾點：

- 如何辨識 Bounded Context
- Bounded Context 常見迷思
- Bounded Context 的威力
- Bounded Context 葫蘆裡到底有什麼藥

---

## 如何辨識 Bounded Context

Bounded Context 的好處是顯而易見的，但是該如何找出 Bounded Context 並不是一件容易的事情。好消息是，這並非科學問題，而更像是藝術與設計的問題，因此**沒有標準答案，純看當下的需求**，甚至當團隊對於 Domain Knowledge 更熟悉時再來調整也可以。

通常識別 Bounded Context 會由兩點下手：**語意(Linguistic)**與**業務能力(Business Capability)**。

![https://ithelp.ithome.com.tw/upload/images/20190921/20111997gubkP64zpc.png](https://ithelp.ithome.com.tw/upload/images/20190921/20111997gubkP64zpc.png)
(一個劃分好的 Bounded Context 示意圖)

_註：這邊的業務能力 (Business Capability) 意旨：一家企業能達成商業目標所需的能力、資源、專業。_

### 用語言定義的差別來識別

在 Bounded Context 中我們可以用 Ubiquitous Language 來命名某個概念的實體，而實體程式碼的資料與行為也必須反映出 Ubiquitous Language。因此 Bounded Context 本質上是**一個語意的邊界**。就像前一篇文章所提到的，同樣是 `Account`，在銀行、部落格、社交軟體中都有截然不同的定義。

當你需要界定一個實體的不同定義時，那你可能需要探索新的 Bounded Context。藉由將不同定義的實體配置到不同的 Bounded Context 中，你可以更有效地保護 Bounded Context 內語意的一致性。

與此同時，當專案需求有異動時，也需要重新檢視團隊新獲得的領域知識與現有的 Bounded Context 彼此之間的匹配程度。如果這個新知識符合某個 Bounded Context 中的 Ubiquitous Language 則加入；如果不符合，則需要建立新的 Bounded Context。

因此，在 DDD 中，如果有一個 Bounded Context 其名字為 Utility 並且它是用於處理雜項，就代表團隊需要對它做進一步的分析了。

總結以下三點：

1. 注意那些實體的定義相似或是經常一起出現的詞彙或句子
2. 注意那些擁有相似概念或相同名稱，但是它們在不同語境下有歧異的詞彙或句子
3. 當團隊發現正在重複地使用其他 Bounded Context 的語言時，請思考其必要性，或許根本不需要新的 Bounded Context。

### 注重業務能力勝過資料分類

在設計 Bounded Context 初期常出現一個迷思，那就是要依照「實體」(如顧客、訂單、商品)去決定 Bounded Context。再次強調，DDD 的目的不是為了建立資料庫模型而是**為系統的行為建立領域模型**。如此一來，才能夠讓建立出來的模型表達出系統的領域知識。

甚至還有一派主張 Bounded Context 推薦[用動詞做命名](https://www.youtube.com/watch?v=NXDCkpD74mE)來描述 Bounded Context 的行為。

很多專案一開始使用資料表(Table)的資料為依據做系統設計、甚至把業務邏輯與 ORM 框架綁在一起。這麼一來容易造成物件乘載太多的責任，比如說「顧客」是屬於「會員管理系統」還是屬於「購物系統」？

其實同樣是顧客，使用情境卻大不相同，如果單純用資料表為根據定義他，最後一定會長出一個肥大且難用的物件，且無法很好的滿足 Bounded Context 內的一致性。

舉個例子，依照業務能力 (business capabilities)我們需要有會員管理、商品目錄、訂單、物流、金流等等功能。而顧客的概念在不同 Bounded Context 中有不同的行為、職責甚至是不同的名稱，如下：

- [會員管理 Bounded Context] 會員 Member = 名字、個人資料、會員等級、會員紅利點數
- [瀏覽產品目錄 Bounded Context] 瀏覽者 viewer = 先前購買紀錄、忠誠度、可買商品、折扣
- [訂單 Bounded Context] 買家 Buyer = 名字、訂單記錄
- [物流 Bounded Context] 收貨人 Receiver = 名字、聯絡方式、地址、其他術語
- [金流 Bounded Context] 付款人 Payer = 名字、信用卡後四碼

事實上，拆分 Bounded Context 時，很常會把**同一實體概念拆分在不同功能的 Bounded Context 中**。

可以參照這篇的問答：[Who owns the Orders in a consumer-provider marketplace like platform?](https://softwareengineering.stackexchange.com/questions/366214/who-owns-the-orders-in-a-consumer-provider-marketplace-like-platform)

不過依照業務能力區分有時也會有問題，因為他可能無法符合 Subdomain 的邊界。(註：在理想中，每個 Bounded Context 不會超出或跨越多個 Subdomain。)

舉個例子，一個電商系統常會有前台後台之分(storefront vs admin)，如果以業務能力來分析，很容易分出「前台」、「後台」兩個 Bounded Context ，但事實真是如此嗎？以後端來說，把系統或是團隊切成前後台兩個 Bounded Context 或團隊似乎不是明智之舉，這容易導致溝通變複雜，因為兩者之間有很多概念其實是重疊的。

另外，業務能力有時也與組織架構有關，甚至最後讓 Bounded Context 被組織架構綁架。比如因為組織有銷售團隊、客服團隊所以就直接將這個架構映照到 Bounded Context 上。

### 對於資料的掌控度與依賴性

通常好的系統會要求保有 Autonomy (自治性)，意即，在相當程度上減少彼此的依賴。這個依賴不僅是邏輯上的依賴，同時也包含底層如資料存儲的依賴。 理想上，我們會希望每個系統擁有自己的資料庫，如此一來就能夠保證不被外部污染。

一個 Bounded Context 必須具有自己資料庫的完整擁有權。當一個資料庫不完全屬於這個 Bounded Context 時，必須考慮拆分出去。

譬如一開始一個單純的 `購物 Bounded Context` 僅需要讓使用者登入並購物，但之後加入了會員等級與關係制度：會員可以升級成 VIP 、VVIP ...等等，甚至可以升級成聯盟行銷夥伴。此時的 `購物 Bounded Context` 顯然就已經不適合了。因此，可以考慮切出出一個 `身份管理 Bounded Context` 來管理這些實體。當 `購物 Bounded Context` 需要相關權限驗證時，僅需和身份管理 Bounded Context 溝通即可。

### 根據現有團隊或專案結構

當然，理想很豐滿，現實是很骨感的。Bounded Context 的設計也要考量現實因素，其中之一就是組織架構。就如同 Conway Laws 所說：

> Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure.  
> 軟體組織的團隊邊界決定系統邊界。  
> — M. Conway

除了團隊組織，還需要考量既有的 Legacy System。若是這個 Legacy System 已經面目全非、難以維護，那麼常見的作法是將 Legacy System 獨立成一個 Bounded Context ，並建立多個 Adapter 去橋接外部新建立的 Bounded Context。

很多時候，團隊導入 Bounded Context 卻沒有獲得預期的成果。問題很可能就出在忽略組織架構的關係，尤其在越大的公司與團隊越是如此。忽略現實組織架構切分 Bounded Context 反而提高部門間的合作成本。根據這篇 [The Art of Discovering Bounded Contexts by Nick Tune](https://www.youtube.com/watch?v=ez9GWESKG4I) 講者所說，Bounded Context 最後其實是挑戰組織的分工，當組織越來越大時，若分工越貼近 Bounded Context 越容易管理，但大家都知道，人的問題往往比程式更複雜。

所以理想上盡量減少團隊間的依賴關係，以達到更高的自治性。

### Bounded Context 的大小

Bounded Context 沒有一定的大小，主要還是以語意與業務能力做判斷。在專案啟動時，商業邏輯相對簡單，通常不用太多 Bounded Context 就可以完成大部分的需求，且不破壞內部領域知識的一致性。

雖然沒有一定的大小，但也要小心不要在專案成長過程中讓外部概念滲透進去 Bounded Context 中。這尤其容易發生在整合外部系統(ex: 金物流) 時，團隊尚未消化完外部的知識就直接放進去某個 Bounded Context ，這導致日後團隊開發時，需要看多份文件(別人的也要看!)確認需求異動是否有額外的風險。

## Bounded Context 常見迷思

### 迷思一：一次就分析到位

事實上大多數系統一開始可能只會有一個 Bounded Context 或是業務複雜度不足以分出多個 Bounded Context 。

### 迷思二：根據技術、分層架構拆分 Bounded Context

比如說 Database、Infrastructure 分為一個 Bounded Context 就不太適合。 或是依照架構層去分如 Use Case 層、 Controller 層、 Domain 層或是外部框架...等等，都不適合。

### 迷思三：根據開發任務拆分 Bounded Context

今天假如有一個新的功能需求進來，不代表他就可以獨立開一個 Bounded Context 出來。 雖然有些人主張 Bounded Context 越小越敏捷(?)，但是當 Bounded Context 語意的一致性被打破時，就是留下技術債待未來解決。

### 迷思四：Bounded Context 與後端/技術團隊組織無關

By Conway Law: 軟體組織的團隊邊界決定系統邊界。

Bounded Context 也是一個決定團隊邊界的好方式，甚至可以應用到跨國團隊上。

## Bounded Context 的強大威力

### 概念不混淆、命名不用怕

Bounded Context 語意的邊界讓我們在調用服務、命名時可以清楚知道自己在做什麼。

有一個令我非常頭疼的名詞叫做 `User`，因為它的含義可以包山包海：他可以是管理員也可以是會員，甚至可以不用是實體用戶而是另一個系統。

當你用一個 `User` 打天下時，不同的概念混淆在一起，除了開發困難也容易產生安全疑慮如權限判斷錯誤。

### 分離業務功能：專注在自己的功能上

前面講到了 `User` 的權限問題，相信大家在開發時常會遇到一個問題：

> 到底權限判斷要在哪裡做？

當權限判斷成為一個重要的業務功能時，就可以分離出來。如此一來當你在逛商品、下訂單時，僅需要在一開始向權限判斷的 Bounded Context 認證成功，剩下就可以專注在自己的商業邏輯中。

就像是進去劇院，有兩種模式：

1. 售票員在入口處幫客戶查票後放行，相信每個客戶都能夠自己進去後找好位子。
2. 一樣入口查票，但客戶每走上一個階梯都會有人跳出來再查一次票。

相信大家都覺得第二個模式很蠢，但很多遭到不當重用(Re-Use)的程式就是這樣子運行的！ 當你今天依照 Bounded Context 將業務功能釐清之後，就會像模式一一樣自然。

那你說如果進去後還亂坐位子呢？...我想這是程式的 BUG，放到模式二也不會比較好，請快點修好。

### 可以用來拆分 Microservice

Bounded Context 的天然邊界就是完美的系統邊界，非常適合作為 Microservice 的劃分。可以參考 Kim 哥的經典演講：[2019 06-12-aws taipei summit-dev day-essential capabilities behind microservices](https://www.slideshare.net/kimKao/2019-0612aws-taipei-summitdeve-day2essential-capabilities-behind-microservices)

不過這邊需要釐清一點，**Bounded Context 可以是 Microservice，Microservice 不完全是 Bounded Context**。前面提到，Bounded Context 是一個業務能力的邊界，而 Microservice 的目的則是利用模組化的方式建構大型且複雜的系統。所以一個 Bounded Context 可以做成一個 Microservice，但也有可能從它身上分出多個 Microservice。因此一個 Microservice 的邊界不一定會等於 Bounded Context。

### 可以用來分配團隊任務

[Patterns, Principles, and Practices of Domain-Driven Design](https://www.tenlong.com.tw/products/9781118714706?list_name=srh)的作者之一 Nick Tune 在這部很棒的[演講](https://www.youtube.com/watch?v=ez9GWESKG4I)提到，Bounded Context 也很適合用來拆分團隊，尤其適合大組織甚至是跨國團隊。

想想看，如果你今天把團隊分為前端跟後端，一個在台北，一個在高雄，那出了一個訂單問題的 Bug 該不會還要搭高鐵來回吧？

## Bounded Context 葫蘆裡有什麼藥

只要符合 Ubiquitous Language，一個 Bounded Context 可以包含一個系統、一個應用程式或是一種業務服務(EX: DB Schema、UI)。

### 在 Tactical Design 中呈現

接著讓我們來看看，若是以 Tactical Design 中的各個設計模式 (Entity、Value Object、Aggregate、Domain Event)的 Domain Object 應用在 Bounded Context 會長怎樣：

以上面的電商為例，以下分成三個 Bounded Context，分別為 Catalog (商品目錄)、Purchase (購買)、Identity (身份管理)。

![https://ithelp.ithome.com.tw/upload/images/20190921/20111997mqmU8asR5L.png](https://ithelp.ithome.com.tw/upload/images/20190921/20111997mqmU8asR5L.png)

以及在專案結構會像這樣：

```
e-commerce
├── catalog
│   ├── applicationService
│   ├── domain
│   └── infrastructure
├── identity
│   ├── applicationService
│   ├── domain
│   └── infrastructure
└── purchase
    ├── applicationService
    ├── domain
    └── infrastructure
```

(以上是概略，想看詳細的請進來 [gist](https://gist.github.com/FongX777/9dbb5dce090092604d032fbaf05e7173#file-ddd-project-structure))

## Summary

Bounded Context 原先就是從與領域專家溝通得來的知識所建構出的邊界，因此不難理解他會是一個語意的邊界！因此在思考 Bounded Context 時，請開發人員先屏棄技術細節的探究，以業務能力為優先。 Bounded Context 為系統提供了絕佳的邊界，不管是否之後有沒有採用 Tactical Design ，對於成長中的系統都是非常實用的。

Bounded Context 的威力很大，但也要注意語言定義、業務能力以及現有團隊的組成。

當團隊拆分出 Bounded Context 後，團隊也需要理解如何連結使用他們。下一篇會來介紹幾個常見的 Bounded Context 合作模式，又稱 Context Mapping。

## Resources

- [cover photo](https://unsplash.com/photos/D6uxeDSylxo)
- [限界上下文的边界](https://zhuanlan.zhihu.com/p/31985410?fbclid=IwAR3Z6cZZtjkI-kLD_f8oJyonx3BlvqLBvu4_LCWn578oflQS_iicqJpSwKk)
- [Context is King: Finding Service Boundaries](https://dev.to/codeopinion/context-is-king-finding-service-boundaries-4mob)
- [Context is King: Finding Service Boundaries through Language](https://codeopinion.com/context-is-king-finding-service-boundaries-through-language/)
- [4+1 Architectural View Model](https://codeopinion.com/41-architectural-view-model/)
- [Focus on Service Capabilities, not Entities](https://codeopinion.com/focus-on-service-capabilities-not-entities/)
- [Autonomous Services](https://codeopinion.com/autonomous-services/)
- [Modelling Bounded Contexts with the Bounded Context Design Canvas: A Workshop Recipe](https://medium.com/nick-tune-tech-strategy-blog/modelling-bounded-contexts-with-the-bounded-context-design-canvas-a-workshop-recipe-1f123e592ab)
- [Who owns the Orders in a consumer-provider marketplace like platform?](https://softwareengineering.stackexchange.com/questions/366214/who-owns-the-orders-in-a-consumer-provider-marketplace-like-platform)
