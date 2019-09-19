# DDD 學習路徑與資源分享

![cover](https://images.unsplash.com/photo-1471958680802-1345a694ba6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1132&q=80)

經過昨天的傳教文章，今天來為各位簡單介紹 DDD 學習路線以及這系列文章會涵蓋的範圍。
並在文末附上我評估對 DDD 感興趣的朋友有幫助的學習資源。

## Learning Roadmap

DDD 主要分為兩大部分，分別為：

- 戰略設計 (Strategic Design) ：與領域專家探索完領域知識後，為了有效分析與實作，將領域拆分問題成數個子領域 (Subdomain) 並定義解決方案的邊界 (Bounded Context) 與關係 (Context Map)。
- 戰術設計 (Tactical Design) ：又稱 Model-Driven Design。利用 DDD 在戰術設計中提供的設計模式來實現戰略設計所分析的成果。

下張圖展示 DDD 模式的全貌:
![img](https://i.imgur.com/UklC1Ek.jpg)
圖 1. DDD 設計全貌圖
(source: [Domain-Driven Design Reference](https://domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf))

### Strategic Design 戰略設計

![img](https://i.imgur.com/U2h7vYy.jpg)

DDD 的戰略設計其目的在於協助我們捕捉和獲得**領域知識**(Domain Knowledge)，並且將其拆分成適當的大小以利後續分析處理，同時也讓我們能夠理解軟體的核心價值。戰略包括以下要點：

- 團隊與領域專家溝通及合作**捕捉領域知識**並且建構**通用語言**(Ubiquitous Language)。
- 依照所理解的問題域 (Problem Space) 以及解決方案域 (Solution Space) 的資訊建立領域 (Domain)。
- 將領域 (Domain) 切成若干個子領域 (Subdomain) ，並且定義每一個子領域的優先等級。
- 在子領域中遵循通用語言 (Ubiquitous Language) 將解決方案切分出一個個語意的邊界：**限界上下文** (Bounded Context)(註: 這個之後會詳談)。
- 定義不同限界上下文之間的互動模式 -- **上下文地圖**(Context Mapping)。

歷史小補充: 在 DDD 剛推出時，因為戰略部分非常抽象，所以很多人只學習可以立即導入程式碼中的戰術設計，而這種只使用戰術模式的 DDD 實踐方式又稱為 DDDLite。不過隨著程式碼逐漸增長，大家逐漸意識到沒有做好戰略設計，即使加入再多的戰術程式碼都是脆弱的。因為有了戰略打穩地基，團隊有了充足的領域知識與通用語言做後盾，才能準確設計系統的邊界以符合業務需求。

### Tactical Design 戰術設計

戰術設計幫助我們運用一些成熟的設計模式 (Design Pattern) 將戰略分析的成果以程式碼實現。有以下 Design Pattern 供使用：

![](https://i.imgur.com/4SaZvwd.jpg)

- 實體 (Entity)：  
  有一個屬性作為識別之用 (id)。 Entity 的狀態會在其生命週期中持續追蹤其變化。
- 值物件 (Value Object)：  
  無 identity 概念、狀態不可變更的物件 (object)，用於描述某個事物的特徵。
- 聚合 (Aggregate)：  
  由相關業務目標的物件 (包含 Entity 與 Value Object) 所組成，一個聚合即為一個交易(Transaction)的邊界。並且會在其中選擇一個實體 作為聚合根 (Aggregate Root) ，所有與外界的溝通都必須交由聚合根來負責。

以上三個由於負責領域的業務邏輯，因此又被稱為領域物件 (Domain Model)。

- 倉儲 (Repository)：  
  這是一個保存領域物件的狀態的設計模式，可以轉接資料庫、 ORM 或檔案系統。一般使用上會考慮一個聚合對上一個倉儲。
- 工廠 (Factory)：  
  同 GoF 的工廠樣式，在 DDD 中用於處理聚合生成較為複雜的情境。
- 領域事件 (Domain Event)：
  某件領域專家在乎的事件，通常用於聚合間的溝通。
- 領域服務 (Domain Service)：當有某個業務邏輯職責**無法被歸類**到任何一個領域物件上時，會將以領域服務承載這個職責。處於應用服務與領域物件之間。
- 應用服務 (Application Service)：等同於系統的使用案例，主要負責技術細節並呼叫領域物件或領域服務處理業務邏輯。

如果以上看得霧煞煞，可以看以下這張精美(簡)版：
![](https://raw.githubusercontent.com/FongX777/it30-domain-driven-design/master/posts/day2/ddd-roadmap.png)
(完整放大版點此[連結](https://bit.ly/2lXdZvj))

## 鐵人賽目錄

以上說了那麼多，以下會跟大家介紹本次鐵人賽會涵蓋到的部分。戰略部分會依照以下順序展開：

- 領域,子領域,限界上下文 (Domain & Sub Domain & Bounded Context)
- 上下文映射樣式 (Context Mapping Patterns)
- 事件風暴 (Event Storming)

進入戰術設計前，我會先介紹一些現代的架構來支援戰術與戰略的實現以做到「關注點分離」：

- 分層架構 (Layered Architecture)
- 洋蔥/整潔架構 (Onion/Clean Architecture)
- 接口-轉接器架構 (Port-Adapter Architecture)
- 限界上下文整合 (Bounded Context Integration)

接著再進入大家期待的程式實作戰術設計：

- 實體 (Entity)
- 值物件 (Value Object)
- 聚合 (Aggregate)
- 工廠 (Factory)
- 應用服務 (Application Service) (w/ BDD integration)
- 倉儲 (Repository)
- 模組設計 (Module)
- 領域服務 (Domain Service)
- 領域事件 (Domain Event)
- CQRS & Event Sourcing (不一定)

最後有時間的話會找幾個簡單的 project 跟大家一起實作。

## 本系列風格說明

由於 DDD 大部分資源都以英文為主，且中文翻譯又容易有歧異，所以為了希望大家未來能無縫接軌英語資源，在專有名詞使用上，我都盡量以英文呈現 (如 Bounded Context, Subdomain 等等) 。因此會出現大量「晶晶體」也請多見諒。

本系列我主要是參考 [Implementing Domain-Driven Design](https://www.tenlong.com.tw/products/9787121224485) (簡稱 IDDD) 為主，此書實作內容非常豐富。不過不太建議新手直接拿來啃，最好是搭配本系列一起服用 XD

同時偶爾參考元祖書 [Domain-Driven Design](https://www.tenlong.com.tw/products/9789864343874?list_name=c-domain-driven-design) 與另一本好書 [Patterns, Principles, and Practices of Domain-Driven Design](https://www.tenlong.com.tw/products/9781118714706?list_name=srh) 還有一堆網路文章與影片。

在程式語言實作方面，由於我熟悉的語言如 NodeJS 、 Python 等都不是純粹的物件導向語言，所以我就選用 TypeScript 主要程式語言來開發範例程式碼。如果你是用 JAVA 、 C# 、 PHP 等的朋友們...我只能說恭喜拉！網路上超多程式碼資源 (尤其是 C#) ，可以從本系列理解概念後再上網找範例程式碼。

為了讓大家能快速上手 DDD 的概念，實踐方面我盡量都會寫出範例程式碼，但因為 30 天的極限挑戰下，若有錯誤也請各位不吝指出，我會立即修正，謝謝。

## 資源分享

非免費資源我會在後面標注星號：

### 書籍

- [Domain-Driven Design \*](https://www.tenlong.com.tw/products/9789864343874?list_name=c-domain-driven-design) 俗稱小藍書，看了會有很多收穫但稍嫌抽象。可以買一本供奉著。
- [Implementing Domain-Driven Design \*](https://www.tenlong.com.tw/products/9787121224485) 小紅書，也是本系列主要參考對象，以 JAVA 實現，雖然年代稍久，但實作面很強的一本書，很建議與本篇一起閱讀。
- [Domain-Driven Design Distilled \*](https://www.tenlong.com.tw/products/9780134434421) 可以當小紅書前傳來看，很適合傳教或推坑使用。
- [Patterns, Principles, and Practices of Domain-Driven Design \*](https://www.tenlong.com.tw/products/9781118714706?list_name=srh) 另一本很推薦的書，尤其適合熟悉 C# 的朋友入手。很建議與上面那本搭配閱讀。
- [DDD Reference](http://domainlanguage.com/ddd/reference/) DDD 專有名詞對照書。
- [Domain Driven Design Quickly](https://www.infoq.com/minibooks/domain-driven-design-quickly/) 小藍書精簡版。 [簡中版](https://www.infoq.cn/article/domain-driven-design-quickly?fbclid=IwAR1evqEP9h3Kj04tU5N0_oUPydmJmsuNahKUKqwz3TKgL84izTfxY9g39ks)
- [GETTING STARTED WITH DDD WHEN SURROUNDED BY LEGACY SYSTEMS](http://domainlanguage.com/wp-content/uploads/2016/04/GettingStartedWithDDDWhenSurroundedByLegacySystemsV1.pdf) 可參考與 DDD 如何應用進 Legacy System。
- [Domain-Driven Design: The First 15 Years](https://leanpub.com/ddd_first_15_years) DDD 歐洲社群精選幾篇文章後出版了此書，適合有一定經驗的讀者閱讀。

### 文章

- [Martin Fowler - DDD series](https://martinfowler.com/tags/domain%20driven%20design.html) 看來連馬丁花都是 DDD 的粉絲呢～
- [InfoQ Domain-Driven-Design](https://www.infoq.com/domaindrivendesign/) 裡面蠻多簡中與英文的資源
- [ThoughtWorks](https://www.thoughtworks.com) [簡中](https://info.thoughtworks.com/CN-Company-Introduction.html) 裡面也有許多高質量文章
- [Microsoft .NET DDD Guide](https://docs.microsoft.com/zh-tw/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/)
- [khalilstemmler](https://khalilstemmler.com/articles/categories/domain-driven-design/) 蠻多 TypeScript 實作。
- [Udi Dahan ](http://udidahan.com/articles/)
- [LosTechies.com](https://lostechies.com/jimmybogard/2010/02/04/strengthening-your-domain-a-primer/)
- [知乎 DDD ](https://www.zhihu.com/topic/19826540/hot)

更多資源可以上 [Awesome DDD](https://github.com/heynickc/awesome-ddd) 查看～

### 線上課程

- [Domain-Driven Design Europe Youtube Channel](https://www.youtube.com/channel/UC3PGn-hQdbtRiqxZK9XBGqQ) 非常推薦！裡面有很多演講影片可以拿來配飯吃。
- [PLURASIGHT - Domain-Driven Design: Working with Legacy Projects \*](https://www.pluralsight.com/courses/domain-driven-design-legacy-projects)
- [PLURASIGHT - Domain-Driven Design in Practic \*](https://www.pluralsight.com/courses/domain-driven-design-in-practice)

### 最強社群

現在就加入 [Domain-Driven Design Taiwan](https://www.facebook.com/groups/dddtaiwan/) ，隨時更新活動與新知！
最近才剛辦完耗時半年的 Implementing Domain-Driven Design 的讀書會，如果對讀書會有興趣請密切關注！

也可以到 [ddd-tw/ddd-events](https://github.com/ddd-tw/ddd-events) 翻翻過去活動留下來的資源。

最後感謝社群夥伴 Kim, Arther, Tim, James 為這篇提供許多精闢的建議。
