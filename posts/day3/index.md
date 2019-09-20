# 戰略設計：運用 Domain, Subdomain 與 Bounded Context 打造藍圖

![cover](https://images.unsplash.com/photo-1470506926202-05d3fca84c9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)

我們在第一天有提到什麼是 domain，在 IDDD 中定義是：

> 每個組織都有自己獨特的業務範圍與做事方式，而在其中所做的活動都是 Domain 的範圍。

簡單來說就是 **(你在工作上用到的)問題 + 解法** 。

本篇就是來介紹介紹 DDD 如何定義這些問題與解法，包括理解 Domain、Subdomain 與 Bounded Context 。

## Domain 的一體兩面: Problem Space 與 Solution Space

在傳統開發流程 (如 waterfall) 會將問題與解法分開，商業團隊負責提出問題與規格，開發團隊負責解決，兩者就像是一個對照的關係。

![map](https://i.imgur.com/cvDBjwo.png)

不過當業務邏輯複雜度提升，在缺乏溝通與 Ubiquitous Language 的幫助下，商業團隊與開發團隊漸漸變成各說各話。如此一來，一旦商業團隊沒有表達出完整的知識內容或是缺乏從系統角度去思考 (ex: 考慮邊界條件)的話，往往就會在產品驗收時才發現許多當初沒想到的問題。

而面對突然跑出來的需求，工程師也只能利用現有架構東貼西補，甚至得加班解燃眉之急。

DDD 的做法與上述的方式不同，將 Problem Space (問題空間) 與 Solution Space (解決方案空間) 皆視作 Domain 的一部份，兩者都是商業團隊與開發團隊需要共同理解的。因此 DDD 要求開發人員對於整體商業功能的藍圖也要有基本的了解，才有助於在未來將業務知識帶入到程式碼中。

定義完 Domain 後，可以發現 Domain 一詞負載著太多含義。畢竟一個產品有許多面向，需要解決的問題也不只一種。直覺上，有些人覺得 Domain 會由一個全能的 Domain Model 完成所有的功能。但事實上這非常的困難且容易失敗。

為了要有效分析並實作出產品，除了將 Domain 分為 Problem Space 與 Solution Space 外，還會再進一步將兩者做拆解。 Problem Space (大問題) 會拆分出數個 Subdomain (小問題) ，其中 (通常) 一個是 Core domain；Solution Space 則是參考 Subdomain 以及產品功能建立 Bounded Context 以確立系統邊界，而我們的 Domain Model 這時才會在 Bounded Context 裡面進行開發。

可以參考下圖，當商業需求與系統實作脫鉤時，可以明顯看到兩者的不匹配，且難以應對未來需求的變化 (比如 CEO 說 `Business D` 外包吧)。

![](https://i.imgur.com/a6BDDUS.png)
(當商業需求與系統實作脫鉤、各做各的)

而當我們實作 Strategic Design 後，可以看到需求與實作緊密結合。如此一來，實作面就能緊緊跟隨商業世界的變化，提升競爭力。可以參考下圖呈現 Strategic Design 成果的分析圖：

![](https://i.imgur.com/2FPYcds.png)
(做好 Strategic Design 可以讓需求與實作緊密結合)

接著介紹一下這兩個空間。

### 先畫靶再射箭：Problem Space

一個產品可能存在多種需求，因此分析 Domain 的 Problem Space 的第一步，就是先切出 Subdomain。

可以把整個 domain 視作一個醫院。同樣是治病，但一個醫院需要多個部門 (Subdomain) 才能達到這個目標，甚至還會有許多非醫療直接相關的部門 (如行政)。釐清這些需求並滿足才能為所有來的病人對症下藥。

> 一次專注一個業務問題，只有當每個部分問題被解決了，整體問題才能解決。

Problem Space 的拆分是基於產品/專案的商業目標，這需要團隊與領域專家討論後才能夠決定。而拆分出的 Subdomain 可以依照優先等級、功能性與替代性分成三個類型:

- Core Domain 核心域
  - 整個產品最有價值 (最賺錢) 的部分，也是其核心競爭力。
  - 需要花費最大心力開發。
  - 如果 Core Domain 不是你最重要的部分，那代表你要回去再找找。
  - EX: AI 推薦購買商品需求
- Supporting Subdomain 支持子領域
  - 未提供核心競爭力，但支援核心所需功能
  - 通常市場上可能沒有現成方案
  - EX: 購物需求
- Generic Subdomain 通用子領域
  - 未提供核心競爭力，但整個系統都可能會用到它 (包含 Supporting Subdomain)
  - 市場上已經有很好的解決方案，所以通常會**使用現成工具或外包** (別重造輪子)
  - EX: 身份認證需求、金流串接

三者的關係可以以製做一把刀子來做比喻。一家生產刀子的工廠，其核心商業價值當然是刀鋒是否鋒利。因此刀鋒的部分是它的 Core Domain。有刀鋒也需要有刀背支撐著主要功能，但刀背又很難外包出去，因此可以將刀背視為 Supporting Subdomain。而 Generic Sub-Domain 類似於基礎設施，支援著以上兩者，通常就可以考慮外包。

![knife](https://i.imgur.com/i4ZqD4d.png)

需注意的是，雖然 Core Domain 是軟體的重心，但不代表其他的都不重要，**每個 Subdomain 都缺一不可**。只是我們傾向放更多時間資源 (如時間、人力) 在 Core Domain 上。

_注: Core Domain 也算是 Subdomain 的一種，不過因為原文就是如此稱呼，我也不另稱 Core Subdomain。_
_注: Core 與 Supporting 的定義都是相對而言。可能你需求的某個 Generic Subdomain (如 Paypal) 是別家公司的 Core Domain。_

### 用 Bounded Context 切分 Solution Space

Solution Space 是你**實作程式模型**的地方，為了要更好的劃分模型間的邊界，我們需要定義出 Bounded Context (限界上下文)。 Bounded Context 的原文定義是：

> The setting in which a word or a statement appears that determines its meaning.  
> 一個可以讓身處其中的單字或句子**獲得完整意義**的環境。

你可以把 Bounded Context 想像成國家的邊界一樣，你不能把不同國家的概念偷渡進來 (就像豬肉一樣)，不然溝通就會發生障礙。如同「元首」一詞，在美國這個 Context 就是總統，在日本的 Context 是總理大臣，在德國則是總理。

Solution Space 中包含**一個或多個 Bounded Context**，每個 Bounded Context 都可以視作一個特定的解決方案。

至於為什麼需要這個邊界呢？

在系統開發中常會見到開發團隊直接設計一個大系統，然後依照商業需求逐個將程式模型塞進這個大系統中。依本文前面所描述的，一個產品的需求有多種面向，即使是同一個名詞在不同的語境 (Context) 底下都會有不同的定義。

舉下圖為例，一個 Account 在銀行中是金錢帳戶、在社交軟體中是關於好友關係管理、在部落格系統則是文章資料管理。若是因為 Account 是同個名詞或是都存在同一個 table 中就通通應用上去，你就會得到一個巨大卻又雜亂的 Account。

![](https://i.imgur.com/Ehl14fC.png)

因此識別 Bounded Context 最重要的原則之一就是**以語意作為邊界**，讓其中的字彙只有身在 Bounded Context 才能得到完整的定義。因此每個 Bounded Context 都有自己的一套 Ubiquitous Language 在其中。

這也引出 DDD 在實作程式碼的重要精神：

> Think in context.
> 在脈絡中思考。

如此一來，你不會在開發 Blog Account 時還需要考慮或濾掉 Social Account 的資料，也不用擔心 Bank Account 的金額被影響。

有了 Bounded Context 後，我們就可以在其中開發我們的 Domain Model 也不用怕概念混淆。我會在後續文章中更加地詳細地介紹 Bounded Context，包括如何辨識、大小、實際樣貌等等。

_註：Domain Model 泛指那些用來解決 Domain 問題的解決方案。可以是程式碼，也可以是 UML 圖也可以是其他 Artifacts。而 Domain Object 主要是針對程式碼實作中 Domain layer 內的 class。_

## 舉個實際案例 - Ecommerce

舉電商做例子，一個電商可能需要以下：

- Product Catalog 商品目錄
- Order 訂單
- Payment 金流
- Shipping 物流
- Invoice 發票
- Inventory 庫存
- Membership 會員管理
- ...

在應用 Strategic Design 前，你有可能會實現畫出以下的圖形：

![](https://i.imgur.com/C9tunv4.png)
(source: [Implementing Domain-Driven Design](https://www.tenlong.com.tw/products/9787121224485))

圖中虛線的是 subedomain，實線是系統的邊界。可以看到幾點問題：

- E-commerce System 承載太多責任
- 軟體的重點沒有被找出來
- 難以修改或是加入新的功能

在加入 Strategic Design 釐清 Subdomain 主要有

- [Core Domain] Optimal Acquistion 優化購物體驗需求 (如推薦系統)
- [Supporting Subdomain] Purchasing 購買需求
- [Supporting Subdomain] Inventory 庫存管理需求
- [Generic Subdomain] Resource Planning 其他資源管理需求

並依此規劃 Bounded Context 作為系統邊界後，新的分析圖會長這樣：

![](https://i.imgur.com/ZvFjw5f.png)
(source: [Implementing Domain-Driven Design](https://www.tenlong.com.tw/products/9787121224485))

看起來是否清晰許多？

這邊補充一下，書中建議理想上**一個 Subdomain 對上一個 Bounded Context**，不過有些情況如左下角的庫存 Subdomain 中，由於 Mapping（地圖）是串接外部系統，Mapping 與 Inventory Context 的 Ubiquitous Language 並不相同，因此會被劃分到不同的 Bounded Context 中。

## Try Try 看 - 牛刀小試

根據以上的範例，你也可以拿出一張紙，來為自己目前工作的專案畫出 Strategic Design 的分析圖。或是試試看用以下這個題目來畫畫看：

題目：有一家企業在做線上影音串流服務，可以讓使用者在**付年費**後可以在線上無限制**觀賞影集**。最近他們開啟了一個新專案，可以藉由**搜集使用者觀影資訊**來訓練 AI 做到更精準的**影片推薦功能**，以提高用戶黏著度。

大家可以試著畫畫看，明天我會貼上我的看法。當然，這種設計層面的東西沒有標準答案，大家互相討論多多益善～

## Summary

經過本篇介紹，大家心中應該對於 Domain 中的 Problem Space 與 Solution Space 有更深的了解。
總而言之， Strategic Design 的重點第一步就是拆分。

在這邊講一下個人經驗，雖然這邊講得頭頭是道，但事實上在做決策時才發現非常困難。曾經嘗試與同事一起實作看看，結果大家放空了快半小時也不知道要怎麼切 Bounded Context。
因此下一段我除了更深入理解 Bounded Context 之外，同時也會中到如何判斷 Bounded Context 。

## Resources

- [Revisiting the Basics of Domain-Driven Design](https://vladikk.com/2018/01/26/revisiting-the-basics-of-ddd/)
- [2019-03-13-ddd taiwan-community-iddd-studygroup-2nd](https://www.slideshare.net/FongXuanLiou/20190313ddd-taiwancommunityidddstudygroup2nd)
