# 戰略設計：Bounded Context 深度解析

![](https://images.unsplash.com/photo-1483286603667-e00f31da5e77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1191&q=80)
_(source: https://unsplash.com/photos/D6uxeDSylxo)_

前面提到，我們會運用 Bounded Context 讓處在其中的 Domain Model 可以使用 Ubiquitous Language 來編寫程式模型，讓這些模型的屬性與行為在 Context 內得到完整的含義。

但問題來了，我們該如何找出 Bounded Context？又有什麼注意事項呢？

以下讓我來為各位揭開 Bounded Context 神秘的面紗，這篇會聚焦在以下幾點：

- 如何辨識 Bounded Context
- Bounded Context 常見迷思
- Bounded Context 的威力
- Bounded Context 葫蘆裡到底有什麼藥

---

## 如何辨識 Bounded Context

Bounded Context 的好處顯而易見，但如何找出 Bounded Context 並不是一件容易的事情。好消息是這不是科學問題，而更像是藝術與設計的問題，因此**沒有標準答案，純看當下的需求**，甚至當你之後對於 Domain Knowledge 更熟悉時再來調整也可以。

通常辨識 Bounded Context 會由兩點下手：語意與業務能力。

_註：這邊的業務能力意旨 Business Capabilities，可以是作為一家企業能獲取成功所需的能力、資源、專業。_

### 用語言意義的差別判別

在 Bounded Context 中我們可以用 Ubiquitous Language 來命名某個概念，而其中的程式也必須準確地反映出 Ubiquitous Language，因此 Bounded Context 本質上是一個**語意的邊界**。就像前一篇提到的，同樣是 Account，在銀行、部落格、社交軟體中都有非常不一樣的含義。

當你能夠藉由語意的描述一個概念的不同含義時，那你可能就要畫出新的 Bounded Context 的邊界。藉由將不同含義的概念分離出不同 Bounded Context，你可以更安全地保護界線內的語意一致性。

同時當專案功能有修改或新增時，也要回頭重新檢視新加入的語言與現有 Bounded Context 彼此間的契合度。如果這個語言符合某個 Bounded Context 裡面的 Ubiquitous Language 則加入，如果不行看是要切割 Bounded Context 或是建立新的也可以。

因此在 DDD 中，如果有一個 Bounded Context 叫做 Utility 來處理雜項，就代表你需要對他做進一步的分析了。

總結一下，依照語意你可以注意以下三點：

1. 注意那些概念相近或常一起出現的字彙或句子
2. 注意那些擁有相近概念或相同名稱但在不同情境下有歧異的字彙或句子
3. 當你發現你在重複使用其他 Bounded Context 的語言時請思考其必要性，或許根本不需要新的 Bounded Context？

### 注重業務能力勝過資料分類

在設計 Bounded Context 初期常出現一個迷思，那就是要依照「實際的東西」如顧客、訂單、商品去分 Bounded Context。我們再次強調，DDD 的目的不是為資料庫 table 建模型而是**為系統的行為轉建立程式模型**。如此一來建立的模型才能表達出商業需求的以及核心邏輯。

甚至還有一派主張 Bounded Context 最好[用動詞做命名](https://www.youtube.com/watch?v=NXDCkpD74mE)來描述行為。

很多專案一開始使用實體的物件做設計，這麼一來容易造成物件乘載太多的責任與重疊的功能，比如說「顧客」是屬於「會員管理系統」還是屬於「購物系統」？

其實同樣是顧客的資料使用情境卻大不相同，如果單純用資料的概念去定義，最後一定會長出一個肥大且難用的 Bounded Context。

舉個例子，依照業務能力 (business capabilities)我們需要有會員管理、商品目錄、訂單、物流、金流等等功能。而顧客得概念在不同 bounded context 中有不同的行為、職責甚至是不同的名稱，如下：

- [會員管理 Bounded Context] 會員 Member = 名字、個人資料、會員等級、會員紅利點數
- [瀏覽產品目錄 Bounded Context] 瀏覽者 viewer = 先前購買紀錄、忠誠度、可買商品、折扣
- [訂單 Bounded Context] 買家 Buyer = 名字、訂單記錄
- [物流 Bounded Context] 收貨人 Receiver = 名字、聯絡方式、地址、其他術語
- [金流 Bounded Context] 付款人 Payer = 名字、信用卡後四碼

事實上，拆分 Bounded Context 時，很常會把**同一概念拆分在不同功能的 Bounded Context**

可以參照這篇非常有用的問答：[Who owns the Orders in a consumer-provider marketplace like platform?](https://softwareengineering.stackexchange.com/questions/366214/who-owns-the-orders-in-a-consumer-provider-marketplace-like-platform)

不過依照業務能力區分有時也會有誤區，因為他可能無法完美得符合 Subdomain 的邊界。

舉個例子，一個電商系統常會有前台後台之分 (storefront vs admin) ，如果以系統商業能力來看，很容易分出「前台」、「後台」兩個 Bounded Context ，但事實真是如此嗎？我想以後端來說，把系統或是團隊切成前後台似乎不是很明智，因為兩者之間有很多概念是共用的，容易導致複雜的依賴性。

另外業務能力有時也與組織架構有關，甚至最後讓 Bounded Context 被組織架構綁架：因為組織有銷售團隊、客服團隊所以就將這個架構映照到 Bounded Context 上。

### 對於資料的掌控度與依賴性

通常好的系統會要求保有 Autonomy (自治性)，也就是在相當程度上減少彼此的依賴。這個依賴不僅是邏輯上的依賴，同時也包含底層如資料存儲的依賴。
理想上我們會希望每個系統保有自己的資料庫不被外部污染，因此資料的掌控度也可以做為 Bounded Context 的辨別依據。

一個 Bounded Context 必須擁有自己資料的完全掌控權。當一個資料不完全屬於這個 Bounded Context 時，就可以考慮拆分出去。

比如一開始一個單純的購物 Bounded Context 僅需要讓使用者登入並購物，但之後加入了會員等級與關係制度，一個會員可以升級成 VIP 、VVIP 等等甚至可以升級成聯盟行銷夥伴。此時購物 Bounded Context 顯然就不適合操作如此複雜的使用者資料，因此就可以考慮獨立初一個身份管理的 Bounded Context 專門管理這類資料。當購物 Bounded Context 需要相關權限驗證時，再跟身份管理 Bounded Context 要資料即可。

### 根據現有團隊或專案

當然，理想很豐滿，現實是很骨感的。Bounded Context 的設計也要考量現實因素，其中之一就是組織架構。就如同 Conway Laws 所說：

> Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure.
> 軟體組織的團隊邊界決定系統邊界。  
> — M. Conway

另外也需要考量到既有的 Legacy System。若是這個 Legacy System 已經是面目全非，那麼常見的作法是將 Legacy System 獨立成一個 Bounded Context ，並建立多個 Adapter 去連接外部新建立的 Bounded Context。

同時也要盡量減少團隊間的依賴關係，達到更高的自治性。

### Bounded Context 的大小

Bounded Context 沒有一定的大小，主要還是以語意與業務能力做判斷。在專案剛啟動時，商業邏輯相對簡單，通常不用太多 Bounded Context 就可以完成大部分的需求且不破壞內部領域概念的完整性。

雖然沒有一定的大小，但也要小心不要在專案成長過程中讓外部概念偷偷溜了進去。這尤其容易發生在串接外部系統(ex: 金物流) 時，未經思考就將外部的語言放進自己的 Bounded Context，導致日後你開發一份程式需要看兩份以上的文件(別人的也要看!)。

## Bounded Context 常見迷思

### 迷思一：一次就要分完

事實上大多數系統一開始可能只會有一個 Bounded Context 或是業務複雜度不足以分出多個 Bounded Context 。

### 迷思二：根據技術架構分 Bounded Context

比如說 Database、Infrastructure 分為一個 Bounded Context 就不太合適。
或是運用架構層去分如 Use Case 層、 Controller 層、 Domain 層或是外部框架等等都不合適。

### 迷思三：根據開發任務拆分 Bounded Context

今天假如有一個新的功能需求進來，不代表他就可以獨立開一個 Bounded Context 出來。
雖然有些人主張 Bounded Context 越小越敏捷(?)，但當 Bounded Context 語意的完整性被打破時，就是留下技術債待未來解決。

### 迷思四：Bounded Context 與後端/技術團隊組織無關

By Conwey Law: 軟體組織的團隊邊界決定系統邊界 => Bounded Context 也成為了一個決定團隊邊界的好方式，對於跨國團隊更有利。

## Bounded Context 的強大威力

### 概念不混淆、命名不用怕

有了 Bounded Context。

有一個我非常害怕的名詞叫做 `User`，因為他簡直包山包海。他可以是 Admin 也可以是一般使用者。甚至 `User` 一詞甚至可以不用是實體用戶而是另一家公司的系統。

當你用一個 User 打天下時，由於概念混淆在一起，甚至容易產生安全疑慮，錯誤判斷權限。

### 身份認證

前面講到了 `user` 的權限問題，相信大家多少都遇過權限判斷的難題。當你因為 Bounded Context 而分出一套系統時。

> 到底權限判斷要在哪裡做？

像是進去劇院，有兩種模式：

1. 售票員在入口處幫你查票後讓你進去，信任你自己進去後找好位子。
2. 一樣入口查票，但你每走上一個階梯都會有人跳出來再查票一次。

相信大家都覺得第二個模式很蠢，但很多遭到不當重用的程式就是這樣子跑的！
當你今天運用 Bounded Context 的概念將不同商業功能釐清後，自然就像模式一一樣輕鬆自在。

那你說如果進去後還亂坐位子呢？...我想這是程式的 BUG，放到模式二也不會比較好，請快點修好。

### 可以用來拆分 Microservice

Bounded Context 的天然邊界就是完美的系統邊界，非常適合作為 Microservice 的劃分。

可以參考 Kim 哥的經典演講：[2019 03-23-2nd-meetup-essential capabilities behind microservices](https://www.slideshare.net/kimKao/2019-03232ndmeetupessential-capabilities-behind-microservices-137920646)

不過這邊需要釐清一點，**Bounded Context 可以是 Microservice ，Microservice 不完全是 Bounded Context**。
前面提到，Bounded Context 是一個商業功能的邊界，而 Microservice 目的則是將程式功能抽出來。所以一個 Bounded Context 可以做成一個 Microservice，但也有可能從又分出多個 Microservice 。
因此一個 Microservice 的邊界不一定會等於 Bounded Context。

### 可以用來分配團隊任務

[Patterns, Principles, and Practices of Domain-Driven Design \*](https://www.tenlong.com.tw/products/9781118714706?list_name=srh)的作者之一 Nick Tune 在這部很棒的演講提到，Bounded Context 也很適合用來拆分團隊，尤其適合大組織甚至是跨國團隊。

想想看，如果你今天把團隊分為前端跟後端，一個在台北，一個在高雄，那出了一個訂單問題的 Bug 該不會還要搭高鐵來回吧？

## Bounded Context 葫蘆裡有什麼藥

基本上 Bounded Context 不只是語意邊界，有時也可以作為技術的邊界。比如一個 Database table 若是與 Domain Model 緊密關聯，那也可以把他的 Schema 放進 Bounded Context 中。此外若是 UI 符合 Bounded Context 的邊界，也同樣可以放進來，只是要注意 [Smart UI Pattern](https://www.fastman.com/design-patterns-smart-ui/)

此外，連你開放的 web interface 如 REST 等都可以放在 Bounded Context，**只要他能符合 Ubiquitous Language**。

總結來說，只要他符合 Ubiquitous Language，一個 Bounded Context 可以包含一個系統、一個應用程式或是一種業務服務。

### 在 Tactical Design 中呈現

接著讓我們來看看，若是以 Tactical Design 中的各個設計模式 (Entity、Value Object、Aggregate、Domain Event)的 Domain Object 應用在 Bounded Context 會長怎樣：

以上面的電商為例，以下分成三個 Bounded Context，分別為 Catalog (商品目錄)、Purchase (購買)、Identity (身份管理)。

![](https://i.imgur.com/IaMnfVN.png)

以及在專案結構會像這樣：

```
e-commerce
├── catalog
│   ├── applicationService
│   │   ├── AddProduct.ts
│   │   ├── DeleteProduct.ts
│   │   └── UpdateProduct.ts
│   ├── domain
│   │   ├── event
│   │   │   ├── ProductCreated.ts
│   │   │   └── ProductUpdated.ts
│   │   └── model
│   │       ├── Product.ts
│   │       └── Viewer.ts
│   └── infrastructure
├── identity
│   ├── applicationService
│   │   ├── MemberLogin.ts
│   │   ├── MemberLogout.ts
│   │   ├── MememberUpdate.ts
│   │   ├── RegisterMember.ts
│   │   └── UpdateContract.ts
│   ├── domain
│   │   ├── event
│   │   │   └── ContractUpdated.ts
│   │   └── model
│   │       ├── Admin.ts
│   │       └── Member.ts
│   └── infrastructure
└── purchase
    ├── applicationService
    │   └── PlaceOrder.ts
    ├── domain
    │   ├── event
    │   │   ├── OrderClosed.ts
    │   │   └── OrderPaid.ts
    │   └── model
    │       └── Order.ts
    └── infrastructure
```

## 📝 Summary

Bounded Context 原先就是從與領域專家溝通得來的知識所建構出的邊界，因此不難理解他會是一個語意的邊界！因此在思考 Bounded Context 時，請開發人員先屏棄技術細節的探究，以軟體的業務功能為優先。
Bounded Context 為系統間提供了絕佳的邊界，不管是否之後有沒有採用 Tactical Design ，對於成長中的軟體服務都是非常實用的。

當我們拆分出 Bounded Context 後，我們也需要理解如何連結使用他們。下一篇會來介紹幾個常見的 Bounded Context 合作模式，又稱 context mapping。

Bounded Context 的威力很大，但有時候投入的成本不一定匹配獲得的成果。很多時候是因為組織架構的關係，根據這篇[The Art of Discovering Bounded Contexts by Nick Tune](https://www.youtube.com/watch?v=ez9GWESKG4I) 講者所說，Bounded Context 最後其實是挑戰組織的分工，當組織越來越大時，若分工越貼近 Bounded Context 越容易管理，但大家都知道，人的問題往往比程式更複雜。

常見一個問題： Subdomain 與 Bounded Context 差別在哪裡？
這件事可以說是 DDD 的玄學之一，至今都沒有一個令大家都信服的回答。有一派認為兩者很多時候是角度問題、無法一刀切乾淨，因此與其分那麼細，大家都當作 Bounded Context 討論就好了。

而我自己是認為還是可以分出兩者，將 Subdomain 視作一個籠統的大需求，千萬不要花太多時間在上面，找出核心、大致區分點到為止。而進到 Bounded Context 才會開始討論功能細節，這裡才是將使用案例、 Ubiquitous Language 登場的最佳時機，也是最耗神的地方。

舉例，電商而言，就是要可以「買東西」、「管庫存」，因此就會生出兩個 Subdomain ，並把「買東西」作為 Core Domain 。接著訂單管理、金物流、發票、庫存管理、資源管理等等功能就各自成立 Bounded Context 然後填入以上 Subdomain 中。當個別 Subdomain 過於巨大或複雜時再考慮拆分他。

## Resources

- [Context is King: Finding Service Boundaries](https://dev.to/codeopinion/context-is-king-finding-service-boundaries-4mob)
- [Focus on Service Capabilities, not Entities](https://codeopinion.com/focus-on-service-capabilities-not-entities/)
- [Modelling Bounded Contexts with the Bounded Context Design Canvas: A Workshop Recipe](https://medium.com/nick-tune-tech-strategy-blog/modelling-bounded-contexts-with-the-bounded-context-design-canvas-a-workshop-recipe-1f123e592ab)
- [Who owns the Orders in a consumer-provider marketplace like platform?](https://softwareengineering.stackexchange.com/questions/366214/who-owns-the-orders-in-a-consumer-provider-marketplace-like-platform)
