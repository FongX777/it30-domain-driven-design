# 戰略設計：來聊聊 Bounded Context 的世間情 -- Context Mapping

![cover](https://images.unsplash.com/photo-1566364164658-7d0bfffbb96f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80)

相信有在大型系統底下開發或是開發 Microservice 的朋友們都曾有一個體悟，就是系統間的依賴真的比義大利麵還要糊、放在口袋裡的耳機還要糾纏。

一般來說，決定一個專案的成敗不只在於技術的複雜度，也取決於與其他團隊合作的模式。前面提到 Bounded Context 可能不只是語言與程式的邊界，也有可能是團隊間的邊界，因此 Bounded Context 間的關係很多時候也關係到不同團隊間該如何看待彼此的合作關係。

有幾點原因讓我們需要 Context Mapping:

- 逐漸複雜的 Domain Knowledge 讓 Bounded Context 需要重新調整
- 組織架構的複雜度提升
- 團隊數量及規模都在成長中
- 分散甚至跨時區的團隊合作
- 與外部系統整合
- 與 Legacy System 系統整合

接著我會介紹 Bounded Context 的主要互動模式，並舉個例子，最後再出個題目讓大家做做看！

## 主要模式

這邊我們會分有幾種模式：

- Shared Kernel
- Partnership
- Anti-corruption Layer
- Open Host Service/Published Language
- Separate Way
- Big Ball of Mud
- Customer-Supplier
- Conformist

開始前先介紹在 DDD Context Mapping 中，表達相依性的方式是用 U (Upstream) 與 D (Downstream) 來表達， Downstream 依賴於 Upstream。這邊比起箭頭有一個優點，因為箭頭很容易誤會到底是依賴還是資料流。

![upstream/downstream](https://i.imgur.com/Us3dr3f.png)

以上圖中依賴關係為：

- B、C 依賴於 A
- C 依賴於 A

### Shared Kernel 共用內核

如果兩個 Bounded Context 共用同一個模組，那兩者間的關係就屬於 Shared Kernel。當兩個團隊在開發同一個應用程式，並且各自的 Bounded Context 共享一塊重複的領域知識的話，為了加快開發的腳步，就會將部份共用的邏輯抽成 Shared Kernel。

這種做法有好有壞，好處是快速產出，壞處是高度的相依性將不利於未來的擴展，因此需要注意以下幾點：

- 將內核的邊界定義出來並最小化
- 任何更動都需要與另外一個團隊商量
- 修改核心時最好要通過兩個 Bounded Context 的測試。

![shared kernel](https://i.imgur.com/o0jrZPT.png)

**可能案例**：你的 `購物 Context` 可能跟 `營收分析 Context` 都需要有 `Order` Model，而把 Ordere Model 重複的散落在兩處並沒有得到太多的好處，因此可以考慮 Shared Kernel。

### Partnership 合作關係

兩個 Bounded Context 要麼一起成功一起失敗，且兩邊需要共同協調制定開發計畫與專案管理，確保功能可以一起發布。

這種關係沒有上下游關係。

![Partnership](https://i.imgur.com/Z3N9Ndk.png)

### Anti-corruption Layer 防腐層

Anti-corruption Layer (簡稱 ACL) 是一種在不同模型間轉換概念與資料的機制。為了要避免你 Bounded Context 的 domain model 概念受到來自外部的污染，你可以藉由 ACL 來建立一層隔離層，利用介面來將外部概念轉換成內部 Domain Model 能理解的概念。

他有以下特點：

- 可以是單/雙向的。
- 可以作為一組服務。
- 可以利用 FACADE 模式隱藏複雜的轉換邏輯以免污染 Bounded Context。
- 僅包含轉換邏輯，不包含商業邏輯

作為一種模式，很常會把他跟 Customer-Supplier 與 Conformist 搞混，不過實務上也都會搭配出現。只是 Anti-corruption Layer 注重的不是依賴方向而是模型語言轉換的機制。

最常見的場景就是整合第三方系統或是 Legacy System。很多人一看到 Legacy System 就想要趕快替換掉他，但是請不要急著想著去替換 Legacy System，因為這條路充滿困難與失敗，而且 Legacy System 通常反而是系統目前最賺錢的部分。

更好的做法是在使用 Legacy System 時為你的 Bounded Context 的包上一層 ACL，讓你的開發不受影響，甚至可以一點一滴的替換 Legacy System 的功能，達到即使不影響目前功能下也能開發新功能，達到重構的效果！

![https://ithelp.ithome.com.tw/upload/images/20190921/20111997bDChBKtftt.png](https://ithelp.ithome.com.tw/upload/images/20190921/20111997bDChBKtftt.png)

**可能案例**：基本上當你要整合多個外部系統比如一次要整合紅綠藍三家金流時，你會發現光是「信用卡後四碼」一詞每一家定義都不一樣，有 `card4no`、`pan`、`card_number` ，這些你都不能直接硬塞進 Bounded Context 中，一定要經過翻譯才行。

### Separate Way 另謀它路

畢竟任何系統間的依賴都是昂貴的，當兩個 Bounded Context 或團隊間因為技術、溝通或政治因素導致合作成本過高時，就可以考慮斷開兩者的依賴關係。這種關係稱為 Separate Way。

當兩邊及早發現這樣的關係時，就可以開始思考利用其他資源達到目的。

但請注意，這並不代表兩者毫無關係，仍有可能透過 UI 或是手動的模式來進行整合。

**可能案例**: 通常訂單都會與物流合作，消費者可能也希望在自己的訂單頁面可以追蹤物流的進度。但有時候可能第三方物流系統難以整合進自己的 `訂單 Context` 中，但又不想破壞消費者體驗。於是可能在界面上放上[第三方物流進度查詢頁面](http://postserv.post.gov.tw/pstmail/main_mail.html)的連結讓消費者可以點進去查詢。

### Open Host Service/Published Language 開放主機服務/發布語言

也是實現合作關係的一種機制。上游定義一種協定 (protocol)，讓你的下游透過協定去使用你的服務，並公開這份協定，讓想用的人可以使用它。

常出現在一個上游必須與多個下游進行整合時，如果每個下游都要特製轉換層會讓成本過高（一堆測試要通過）的話，倒不如在上游寫一個 Open Host Service 讓下游們減少 ACL 的負擔。

另外在使用上基本上都會搭配 Published Language 使用，兩者差異是， Open Host Service 定義協定，而 Published Language 就是協定傳送資料的語言格式，如 XML、JSON 或是 Protocol Buffer 等等。

![https://ithelp.ithome.com.tw/upload/images/20190921/20111997GpSvuOYrTg.png](https://ithelp.ithome.com.tw/upload/images/20190921/20111997GpSvuOYrTg.png)

### Big Ball of Mud 大泥球

大泥球泛指那些已經混雜成一大團的既有系統。我們會為他們繪製一個邊界，將他們歸納近 Big Ball of Mud 中。在邊界內，不要做太劇烈的改變；與邊界外的交流也需要謹慎，在串接 Big Ball of Mud 時可以考慮加上 ACL 來做翻譯。

### Customer-Supplier 客戶-供應商

當 Bounded Context 或團隊間有上下游關係(單向依賴)時，上游方可以獨立於下游方完成開發，而下游方必須受限於上游方的開發計畫。這種關係就稱為 Customer-Supplier。

但與 Conformist 不同的是，Customer-Supplier 的關係裡上游方通常會顧及到下游方的需求。而當上游方開會或做決策時，下游方也需要被通知甚至一起參加會議。

這時可能會出現下游方被上游方卡死的情況。如果這是發生在團隊甚至是跨公司團隊之間，會讓開發效率低落。同時上游方也有可能因為處處顧忌下游方而無法順利開發。

有一種解決方法是，上游方要將下游方視作他的客戶，下游方則是要列出需求與預算。雙方可以共同制定 [Automated Acceptance Tests (自動化驗收測試)](https://www.jpattonassociates.com/secrets-automated-acceptance-tests/) 用來驗證預期的介面。當上游團隊把這些測試加入開發流程時，只要修改的程式碼通過測試就不必擔心對下游方產生副作用。(更多可以參考 Consumer Driven Contracts)

當然一個供應者可能擁有多個客戶，而某些比較大尾的客戶也可能影響供應者的決策，此時就要做好協調以及加強自動化測試。

![](https://i.imgur.com/LAiCzIr.png)

不過當 Customer-Supplier 間無法順利轉換模型概念時，就可能還需要在下游方建立 ACL。

**常見案例**: 基本上你自己系統內的兩個合作的子系統如果改動成本較小，那就可以適用 Customer-Supplier。

### Conformist 遵奉者

同樣在 Bounded Context 或團隊間有上下游關係時出現。，但此時上游方沒有任何動力要滿足下游方的需求，這種關係我們就稱下游方為 Conformist。

常見於大公司的兩個部門、跨公司合作的專案、系統內本身已經沒有人看得懂的 Legacy System。一般來說，遇到外部系統的整合成本太高時，你會有三種選擇：

1. 如果依賴上游方的**成本過高**，可以考慮放棄，進而轉為 Separate Way 的模式。
2. 如果依賴上游方有一定價值但**設計品質很差**(不好的文件、封裝、抽象)，可以考慮加上 ACL 。
3. 如果依賴上游方有一定價值且**設計不算差、風格也相容**，那此時可以考慮使用 Conformist。

在 Conformist 的應用環境下，壞處是在開發上 Model 會受制於上游，但好處是同時可以大大簡化語言、資料轉換的複雜性。

雖然 Conformist 讓下游十分無力，但及早認識到團隊間的 Conformist 關係可以讓下游方及早檢視現有資源、自力更生。

![](https://i.imgur.com/spRTjIH.png)

## 舉個例子：昨天的 Ecommerce Bounded Context

以下是一些關鍵案例：

1. 購物車結帳時要**判斷會員等級**，若是 VIP 則會有相應的折扣。
2. **瀏覽商品**時，部分商品只能**被部分等級的客人看到**。比如說大量香菸組合包只能被菁英會員瀏覽。
3. 購物車結帳時需要從商品目錄**取得商品資訊**來計算價錢。
4. 購物時需要透過**第三方支付**來處理金流。
5. 需要整合**第三方物流**讓客人知道物流進度。
6. **營收分析系統**需要與購物系統共享資料。

透過關鍵案例，以下是一種可能的 Context Mapping：

![https://ithelp.ithome.com.tw/upload/images/20190921/20111997O7BeiJBDtt.png](https://ithelp.ithome.com.tw/upload/images/20190921/20111997O7BeiJBDtt.png)

## 挑戰看看 - 保險公司案例

一家保險公司需要以下幾個 Bounded Context:

- Customer Management 客戶管理  
  客戶管理系統要管理所有保險公司客戶的資料。因此，他通常在與其他 Bounded Context 關係中的中心。

- Customer Self-Service Management 客戶自助服務  
  這個 Bounded Context 是一個 Web 應用程式，可以讓客戶登入並修改基本資料如地址。

- Policy Management 保單管理  
  保單管理 Bounded Context 管理客戶所簽的保險契約與保單。他會與 Risk Management 一起合作取得客戶的風險數據來計算費率。此外，他也需要與 Debt Collection 共享內核。

- Debt Collection 應收帳款  
  此 Bounded Context 依據相對應的契約與保單來計算保險公司的財務收入。

- Risk Management 風險管理  
  此 Bounded Context 與 Policy Management 密切合作，且計算出的風險資訊會影響保險契約與保單。

- Printing Context 列印功能  
  代表一個外部系統讓許多內部的 Bounded Context 可以透過 API 來使用。他處理那些需要列印的文件如債務 (Debt)、保單等等。

畫完後，可以點[這邊](https://ithelp.ithome.com.tw/upload/images/20190921/20111997f1h08q5xiL.png)取得原文提供的解法。
題目來源：https://github.com/ContextMapper/context-mapper-examples/tree/master/src/main/resources/insurance-example

再次強調，設計沒有正確答案。

## Summary

Context Mapping 不但可以幫我們釐清 Bounded Context 間的關係，也可以幫助提升我們在團隊合作上的決策品質。
而在實現 Context Mapping 時，除了慎選串接的機制以外，也可以考慮加入持續整合的概念，確保每次的更動都安全無虞。

這邊要針對一個容易誤解的問題做釐清，就是，**不是凡事系統串接都要加上 ACL**，有時候 Partnership 或是 Customer-Supplier 的 Bounded Context 間的交流並不影響本身的一致與完整性。又或者 Conformist 的 Bounded Context 認為上游的語言能夠被自身消化。請記得，**任何 ACL 的轉換都是一項成本，有時候他也並不便宜**。

不知道這五天下來大家對 Strategic Design 是否有更多的了解？還是已經有些搞暈頭了？

明天將為大家做一個 Strategic Design 回顧，去除掉囉唆的定義，用例子來整合大家的理解！

## Resources

- [cover photo](https://unsplash.com/photos/ZIoi-47zV88)
- [ContextMapper/context-mapper-examples](https://github.com/ContextMapper/context-mapper-examples/tree/master/src/main/resources/insurance-example)
- [DDD: Recognising relationships between bounded contexts](https://markhneedham.com/blog/2009/03/30/ddd-recognising-relationships-between-bounded-contexts/)
- [Strategic Domain Driven Design with Context Mapping](https://www.infoq.com/articles/ddd-contextmapping/?utm_source=Facebook_PicSee&fbclid=IwAR262EUJ7_4J3QV7tf0laEJGvHIvzfe7rMxx1xUF79Lte9bAg_OYirEGuVU)
- [Implementing Domain-Driven Design (Study Group) Chapter 3 - Context Maps](https://www.slideshare.net/YiChengKuo1/implementing-domaindriven-design-study-group-chapter-3-context-maps)
- [PPPoDDD]()
- [Domain-Driven Design]()
