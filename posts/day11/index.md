# 軟體架構淺談

![cover](https://images.unsplash.com/photo-1431576901776-e539bd916ba2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80)

在 Strategic Design 前往 Tactical Design 的路上，我們可以開始思考要用哪一種架構來協助我們達到目的。不過請切記，架構並不是 DDD 的目的，而僅僅是為了達成 Strategic Design 的工具而已。本系列介紹的架構僅是提供大家一種設計方法，即使是其他的架構也可以與 DDD 配和。

本篇將會先從架構這個概念開始講起，然後聊一聊在什麼情境下你可以使用 Clean Architecture 的設計模式。在閱讀前，我要先聲明，每種架構都有其適合的情境，沒有一個架構是銀子彈，但當你多學會了一種設計模式，就像手中多了一副牌，你可以打或不打甚至出套組合牌，**學習架構是為了做出更好的決定**。

## 何謂軟體架構？

在開始定義架構前，可以請大家在心中問自己：你覺得軟體架構是什麼？每個軟體都會有架構嗎？

其實架構的定義很簡單：

> 軟體架構就是你所建造的系統的**形狀**。

架構就是軟體的形狀，因此任何軟體即使再簡單都有架構存在。而架構的功能就在於將系統拆分以及管理元件，以及元件之間的溝通。就好像做室內設計一樣，一間能讓人居住的房屋可能需要有臥房、客廳、廁所等等，而每個房間都有自己的功能與職責，你不會把烤箱放在廁所，即使這樣可以讓你一次解決多項生理需求。

目前常見到的軟體架構大概有這些類型：

- MVC
- MVP
- Layered Architecture
- Client Server
- Microservice
- Event-Driven Architecture
- Pipe-Filter
- MVVM
- ...其他族繁不及備載

想了解更多模式，你可以參考這篇 [10 Common Software Architectural Patterns in a nutshell](https://towardsdatascience.com/10-common-software-architectural-patterns-in-a-nutshell-a0b47a1e9013)

### 軟體架構的目的

有了這麼多架構做選擇，那麼架構的目的到底是什麼？可以看 [Clean Architecture](https://www.tenlong.com.tw/products/9789864342945?list_name=srh) 的這段敘述：

> The goal of software architecture is to minimize the human resources required to build and maintain the required system.
> 軟體架構的目的是最小化建置與維護「需求系統」所需要的人力資源。

直白地說，在不同的情境與需求下，使用架構的目的就是要讓工程師開發的更輕鬆拉！而這些工作不只包含開發 (development)，也關於部署 (deployment)、運行 (operation) 與維護 (maintainance)。

所以如果今天你是一個 2、3 人小團隊，那一個單純的、大一統 (monolithic) 的軟體結構可能會對於初期開發更有效率。但當專案成長或人數成長後，更有規劃的分層架構可能就會成為新的選項之一。

除了提升軟體開發的效率，軟體架構也可以透過**拖延**來提升你的決策品質。

### 好的架構可以幫你拖延決定！

在設計一個大型軟體時，免不了需要很多元件支援，比如資料庫、 UI 框架、通訊協定等等實作細節。這些細節雖然重要，但就像第一天所說，軟體的核心是**解決問題的能力**，你的使用者不會在乎你使用的是 Postgres 或是 MongoDB 。

因此好的架構可以將你做決定的時間拖延，讓你有更多時間研究與嘗試，提升你最後的決策品質。

舉收藏書本為例，當你買了一個三層式的書架，你可以很順利地將你想收藏的書籍放在你喜歡的層，但如果沒有了書架，你就必須向疊積木一般，你需要決定好底層才能疊上新的一層。這個過程你不但不會有足夠的時間做出決定，還會陷入動一髮牽全身的困境。

以最常見的 MVC 類的架構來說，就是因為將不同的關注點分離，所以搞 UI 的不用擔心要選用什麼資料庫。當你的團隊有更多時間可以調查與比較不同的資料庫選項的同時，專案的開發也不會停止，這就是架構最大的威力！

### 軟體架構與商業需求

學習架構前，必須要了解一個前提：

> 軟體的架構與功能需求沒有關係。

### 軟體架構是非功性需球 Non-Funcitonal Requirement

這邊先定義何謂「功能性需求」，可以查看 [wiki](https://en.wikipedia.org/wiki/Functional_requirement)，裡面提到：

> Functional requirement defines a function of a system or its component, where a function is described as a specification of behavior between outputs and inputs.  
> 功能性需求定義了一個系統中的函式(或元件)，這些函式被用來表達行為輸入與輸出的規格。

常見的功能性需求包含計算、資料處理以及其他系統該完成的工作。功能性需求在乎的是**系統達成的任務的能力**，而非功能性需求則是在乎**系統運作的方式的評估**，常見的比如效能、安全性、可靠性。

就從一個例子來看，「一個可以同時處理上萬人搶票的系統」的效能需求是功能性需求嗎？答案為不是，「買票」這件事情是功能性需求，但效能與可靠性則是非功能性。

這也就是為什麼 DDD 不等於 Clean Architecture，兩者關注的面向不同。DDD 的主要目的是將軟體的模型更貼近業務需求，架構只是為了達到目的的工具。

### 會尖叫的架構

雖然說架構與功能性無關。**但好的架構要能夠讓使用者看出系統的功能**。你只要光從資料夾結構由上往下看，就可以知道這是一個什麼系統。就像是車站有很多種外觀，但通常你可以從一些關鍵特徵就知道它的功能是什麼。

很多人一聽到架構都以為是非常高大尚的東西，只存在於高層次的領域，但架構也是一種設計，不管是高層次或低層次的結構都是同一個整體的一部份。

舉以下這個例子，你大概可以看出這是什麼系統嗎？

```
猜猜我是誰
├── catalog
├── inventory
└── order
    ├── domain
    │   └── model
    │       └── Order.ts
    ├── repository
    │   └── OrderRepository.ts
    └── useCase
        ├── createOrder.ts
        ├── getOrderList.ts
        └── updateOrder.ts
```

我想，很明顯的可以看出是跟電子商務或相關產業的系統。

### 設計的品質

之前上過 Clean Architecture 的課程，講過如何評量軟體設計的品質，就是「衡量滿足客戶需求的工作量」。意即

> 如果工作量很低，而且在整個軟體生命週期都保持很低，則該設計就是好設計。

其實如果只是要解決問題，那麼任何架構都可以做到。但好的架構能夠讓改變的成本維持在低處。如下圖，如果一開始挑一個簡單的架構上路，初期的確成本很低，但是軟體的真正挑戰要從交付後才開始，維護、修改的成本只會逐漸增高，直到最後整個系統動彈不得。

好的架構不代表改動不會有成本，而是成本相對的低。即使一開始需要投入更多的心力，比如原本一個檔案十行程式碼要被分在三個檔案三十行程式碼，但持續的付出。同樣地，像是 TDD、CI/CD、重構、Clean Code 等等都可以提升設計的品質。

![https://ithelp.ithome.com.tw/upload/images/20190927/20111997aIwvSEfBBk.png](https://ithelp.ithome.com.tw/upload/images/20190927/20111997aIwvSEfBBk.png)

## 進入分層式架構

以下介紹幾種常見的架構模式。這邊介紹的架構的共通點之一就是將軟體的關注點分離。

The model has the most unclear role out of all of the parts of MVC.
I think a large part of the confusion is that when people think of a Model, they think of an ORM (object-relational mapping) tool.

### MVC

Model View Controller 相信網路上已經有很多資源可以參考不必我贅述。這是一個可以分離 UI 顯示與資料處理職責的架構。

### Layered Architecture

而 Layered Architecture (分層式架構)

Layered Architecture 通常會指這樣的設計模式：

這比起 MVC 又有更多關注點分離，但這邊問大家一個問題：

> 你覺得架構中最重要的部分是哪個？

我想，商業邏輯層是整個軟體最核心的部分，但大家可以觀察得到，當最核心的部分依賴於其他部分時，代表他很容易受到別人的影響。比如說，當今天我換了一個資料庫，那麼核心邏輯也要跟著變...

> 越靠近 IO 的地方越容易變化。

這一點可說是經過時間淬煉得出的經驗，尤其是 UI，絕對不會只有第一版而已。前面有提過，DDD 需要能夠保護核心的商業邏輯不被外部的變化干擾，因此這邊我們將會使用**依賴反轉原則(DIP)**將目前的依賴關係修改一下：

假如這是原本的程式碼：

```

```

使用依賴反轉後，你可以發現兩個元件此時都是依賴一個介面。但要注意的是，這個介面要放在核心層，這樣一來才有真的做到依賴性的反轉。

## Clean Architecture 與 Onion Architecture 系列

套用了前面的依賴反轉原則，我們將架構近一步拓展成以下這個圖：

// Clean Architecture 圖片

可以觀察到一點：

> 商業邏輯在中間，越外層的離 IO 越近。

以前有讀過 Clean Architecture 但一直搞不懂在做什麼，也有很多人不知道中間的 entity 到底該怎麼做，直到遇見了 DDD ，大家才恍然大悟！

### Why Not Use

其實 Clean Architecture 就跟有潔癖一樣，當你一個檔案幾行 code 就能完成的事情，在 Clean Architecture 中你可能需要橫跨三、四個檔案，多寫上幾十行程式碼才能達成。對於一些**商業邏輯**不複雜的專案來說，應用 Clean Architecture 其實是很大的負擔。

就好比你要先刷卡欠債買新的 Iphone 11 pro ，還是按部就班存錢？老實說，不一定， Clean Architecture 不代表公司能賺更多的錢。不過當你擁有更多工具時，你做出取捨的決策品質也就更好。

### Why Use

- 易測試
- 關注點分離

## 三原則

### 1. 分層原則

### 2.相依性原則

### 3. 跨層原則

## Summary

下一篇將繼續介紹如何將 Clean Architecture 實作到程式碼當中。

## Resources

- [cover photo](https://unsplash.com/photos/l5Tzv1alcps)
- https://medium.com/@domagojk/patterns-for-designing-flexible-architecture-in-node-js-cqrs-es-onion-7eb10bbefe17
- https://blog.ndepend.com/hexagonal-architecture/
- https://github.com/qas/examples-nodejs-cqrs-es-swagger/blob/master/src/users/services/users.service.ts
