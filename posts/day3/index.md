# 戰略設計：運用 Domain, Subdomain 與 Bounded Context 打造藍圖

![cover](https://images.unsplash.com/photo-1470506926202-05d3fca84c9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)

我們在第一天有提到什麼是 domain，在 IDDD 中定義是：

> 每個組織都有自己獨特的業務範圍與做事方式，而在其中所做的活動都是 domain 的範圍

簡單來說就是 **(你在工作上用到的)問題 + 解法** 。

本篇就是來介紹介紹 DDD 如何定義這些問題與解法，包括理解 Domain, Subdomain 與 Bounded Context 。

## Domain 的一體兩面: Problem Space 與 Solution Space

在傳統開發流程 (如 waterfall) 上，會將問題與解法分開，商業團隊負責提出問題與規格，開發團隊負責解決，兩者成為一個就像是對照的關係。

![map](https://i.imgur.com/cvDBjwo.png)

不過由於缺乏溝通以及 Ubiquitous Language 的幫助，常常變成各說各話，更糟的是如果商業團隊只透露到片面資訊，缺乏從系統角度去思考設計，那往往就是在驗收期時才發現很多當初沒發現的問題。甚至一個問題需要被多個系統才能完成。
最後還是得由工程師加班解燃眉之急。

DDD 的做法相反於傳統的觀念，將 Problem Space (問題空間) 與 Solution Space (解決方案空間) 都視作 Domain 的一部份，都是工程師與商業團隊需要共同理解的。因此 Domain-Driven Design 也要求開發人員對於整體商業功能的藍圖也要有基本的了解，才有助於在未來將業務知識注入進程式碼。

定義完 Domain 後，可以發現 Domain 一詞很容易負載太多含義，畢竟一個產品有許多面向，解決的問題也不只一個。直覺上，有些人覺得 Domain 會由一個 Domain Model 完成所有的功能。但事實上這非常的困難且容易失敗。

為了要有效分析並實作出產品，除了將 Domain 分為 Problem Space 與 Solution Space 外，還會再進一步將兩者做拆解。 Problem Space 會拆分出數個 Subdomain 以及(通常)一個 Core domain；Solution Space 則是參考 Subdomain 以及產品功能建立 Bounded Context，而我們的 Domain Model 就會在 Bounded Context 裡面進行開發。

接著介紹一下這兩個空間，大家可以先看一下最後的分析結果大概會長這樣：

![](https://i.imgur.com/2FPYcds.png)

### 先畫靶再射箭：Problem Space

一個產品可能存在多種需求，因此分析 Domain 的 Problem Space 的第一步，就是先切出 Subdomain。就像吃蛋糕一樣，沒有人可以一口吃下整塊蛋糕，一定是先切出一小塊一小塊慢慢享受。

> 一次專注一個業務問題，只有當每個部分問題被解決了，整體問題才能解決。

Problem Space 的拆分沒有一定的準則，主要是與領域專家討論後交給開發人員去決定。而拆分出的 subdomain 可以依照優先度與功能性分成三個類型:

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
  - 未提供核心競爭力，但被整個系統都可能會用到它
  - 也可能被 Supporting Subdomain 使用
  - 市場上已經有很好的解決方案，所以通常會**使用現成工具或外包** (別重造輪子)
  - EX: 身份認證需求、金流串接

三者的差別可以用做刀子當比喻。今天一家生產刀子的工廠，他的核心價值當然是刀鋒利不利，因此刀鋒部分是它的 Core Domain，接著有刀鋒也需要有刀背支撐著主要功能，因此可以將刀背視為 Supporting Subdomain。最後的 Generic Subdomain 就有點類似基礎設施，支援著以上兩者的功能，通常可以找外包解決。

需注意的是，雖然 Core Domain 是軟體的重心，但不代表其他的都不重要，**每個 Subdomain 都缺一不可**。只是我們傾向放更多時間資源 (如 Clean Architecture 、測試覆蓋率) 在 Core Domain 上。

![knife](https://i.imgur.com/i4ZqD4d.png)

P.S. Core Domain 也算是 Subdomain 的一種，不過因為原文就是如此稱呼，我也不另稱 Core Subdomain。
P.S. 即使某項需求落在你的 Generic Subdomain 中，但有可能是別家公司的 Core Subdomain。

### 用 Bounded Context 實現 Solution Space

Solution Space 包含一個或多個 Bounded Context (上下文邊界)。每個 Bounded Context 都可以視作一個特定的解決方案。

至於為什麼需要這個邊界呢？

一般開發來說，直覺上會直接設計一個大系統，然後依照需求一一把程式模型塞進這個系統中。但前面提到，一個產品的需求有多種面向，即使是同一個名詞在不同的情境 (context) 底下都會有不同的意義。

舉下圖為例，一個 Account 在銀行中是帳戶、在社交軟體中是關於好友關係管理、在部落格系統則是文章資料管理。若是因為 Account 是同個名詞或是都存在同一個 table 中就通通應用上去，你就會得到一個強大卻又雜亂的 Account 。

![](https://i.imgur.com/Ehl14fC.png)

因此 Bounded Context 有一個很重要的原則就是**以語意做邊界**。 Bounded Context 的功能在於讓身在其中的詞彙只有身在 Bounded Context 才能得到完整的含義。因此每個 Bounded Context 都有自己的一套 Ubiquitous Language 在其中。

這也引出 DDD 在實作程式碼的重要精神：

> Think in context

有了 Bounded Context 後，我們就可以在裡面開發我們的 Domain Model 並且可以在邊界中準確地開發我們的程式。
下一篇會再更詳細介紹 Bounded Context 的細節，包括如何辨識、大小、實際樣貌等等。

PS Domain Model 泛指那些用來解決 Domain 問題的解決方案，可以是程式碼，也可以是 UML 圖也可以是其他 Artifacts。

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

這邊補充一下，書中建議理想上一個 Subdomain 對上一個 Bounded Context，不過有些情況如左下角的庫存 Subdomain 中，由於 Mapping（地圖）是串接外部系統，Mapping 與 Inventory Context 的 Ubiquitous Language 並不相同，因此會被劃分到不同的 Bounded Context 中。

## Try Try 看 - 牛刀小試

根據以上的範例，你也可以拿出一張紙，來為自己目前工作的專案畫出 Strategic Design 的分析圖。或是你也可以從以下兩個題目來實驗看看：

題目：有一家線上影音產品，可以讓使用者在**付年費**後可以在線上無限制**觀賞影集**。最近他們開啟了一個新專案，可以藉由**搜集使用者觀影資訊**來訓練 AI 做到更精準的**影片推薦功能**，以提高用戶黏著度。

大家可以試著畫畫看，明天我會貼上我的看法。當然，這種設計層面的東西沒有標準答案，大家互相討論多多益善～

## Summary

經過本篇介紹，大家心中應該對於 Domain 中的 Problem Space 與 Solution Space 有更深的了解。
總而言之， Strategic Design 的重點第一步就是拆分。

在這邊講一下個人經驗，雖然這邊講得頭頭是道，但事實上在做決策時才發現非常困難。曾經嘗試與同事一起實作看看，結果大家放空了快半小時也不知道要怎麼切 Bounded Context。
因此下一段我除了更深入理解 Bounded Context 之外，同時也會中到如何判斷 Bounded Context 。

## Resources

- [Revisiting the Basics of Domain-Driven Design](https://vladikk.com/2018/01/26/revisiting-the-basics-of-ddd/)
- [2019-03-13-ddd taiwan-community-iddd-studygroup-2nd](https://www.slideshare.net/FongXuanLiou/20190313ddd-taiwancommunityidddstudygroup2nd)
