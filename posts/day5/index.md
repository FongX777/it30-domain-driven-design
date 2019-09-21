# 戰略設計： Bounded Context 連出 Context Mapping

![cover](https://images.unsplash.com/photo-1566364164658-7d0bfffbb96f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80)

相信有在做稍微大型一點系統或是 Microservice 的朋友都曾有一個體悟，就是系統間的依賴真的比義大利麵還要糊、放在口袋裡的耳機還要糾纏。

單個系統有了 Bounded Context 的邊界保護下安全發展，接下來要討論 Bounded Context 間的交流模式。同時如上一篇所提到，Bounded Context 不只是語言與程式的邊界，也有可能是團隊間的邊界，因此 Bounded Context 間的關係很多時候也關係到不同團隊間該如何看待彼此的合作關係。

主要有以下幾個模式：

- Shared Kernel
- Partnership
- Customer-Supplier
- Conformist
- Anti-corruption Layer
- Open Host Service/Published Language
- Separate Way
- Big Ball of Mud

## 主要模式

開始前先介紹在 DDD Context Mapping 中，表達相依性的方式是用 U (Upstream) 與 D (Downstream) 來表達， Downstream 依賴於 Upstream。這邊比起箭頭有一個優點，因為箭頭很容易誤會到底是依賴還是資料流。

![upstream/downstream](https://i.imgur.com/Us3dr3f.png)

以上圖中依賴關係為：

- B、C 依賴於 A
- C 依賴於 A

### Shared Kernel 共用內核

如果兩個 Bounded Context 共用同一個模組，那兩者間的關係就屬於 Shared Kernel。 常見於不同 Bounded Context 或團隊開發緊密相關的應用程式時，為了要在短時間完成任務，就會將部份共用的邏輯抽成 Shared Kernel。

這種做法有好有壞，但高度的相依性將不利於未來的擴展，所以可以考量漸漸轉為 Partnership 或是 Customer-Supplier。另外需要注意以下幾點：

- 將內核的邊界定義出來並最小化
- 任何更動都需要與另外一個團隊商量
- 修改核心時要通過兩個 Bounded Context 或團隊的測試。

![shared kernel](https://i.imgur.com/o0jrZPT.png)

### Partnership 合作關係

兩個 Bounded Context 要麼一起成功一起失敗，且兩邊需要共同協調制定開發計畫與專案管理，確保功能可以一起發布。

這種關係沒有 Upstream/Downstream 關係。

![Partnership](https://i.imgur.com/Z3N9Ndk.png)

### Customer-Supplier 客戶-供應商

當 Bounded Context 或團隊間有明顯的單向依賴關係(也就是 Upstream/Downstream 關係)時，上游方可以獨立於下游方完成開發，而下游方必須受限於上游方的開發計畫，這種關係就稱為 Customer-Supplier。

但與 Conformist 不同的是，Customer-Supplier 的關係裡上游方通常會顧及到下游方的需求。

這時可能會出現下游依賴於上游但又限制上限太多的情形發生，如果這是發生在團隊甚至是跨公司團隊之間，會讓開發效率低落。但上游方若完全不管下游方死活可能也會讓下游方難以進行開發。

有一種作法是，當兩方確認是上游關係時，將下游方視作上游的客戶，列出需求與預算，並可以共同制定 [Automated Acceptance Tests (自動化驗收測試)](https://www.jpattonassociates.com/secrets-automated-acceptance-tests/) 用來驗證預期的介面。當上游團隊把這些測試加入開發流程時，只要修改的程式碼通過測試就不必擔心對下游方產生副作用。(更多可以參考 Consumer Driven Contracts)

當然一個供應者可能擁有多個客戶，而某些比較大尾的客戶也可能影響供應者的決策，此時就要做好協調以及加強自動化測試。

![](https://i.imgur.com/LAiCzIr.png)

### Conformist 遵奉者

當 Bounded Context 或團隊間同樣有單向依賴關係但是上游方沒有任何動力要滿足下游方的需求時，我們就稱為 Conformist。
常見於大公司的兩個部門、跨公司合作的專案、系統內本身已經沒有人看得懂的 Legacy System。

一般遇到這種情況下，有三種選擇：

1. 如果依賴上游的成本過高，可以考慮放棄，進而轉為 Separate Way 的模式。
2. 如果依賴上游有一定價值但設計品質很差(不好的文件、封裝、抽象)，此時要考慮加上 ACL 作轉換。
3. 如果依賴上游有一定價值且設計不算差、風格也相容，那此時可以考慮使用 Conformist。

在 Conformist 的應用環境下，即使有讓不同語言滲透進來的風險，但同時可以大大簡化語言、資料轉換的複雜性。

雖然這是一個很不幸的情境，但及早認識到團隊間的 Conformist 關係可以讓下游方及早利用現有資源自力更生。

![](https://i.imgur.com/spRTjIH.png)

### Anti-corruption Layer 防腐層

Anti-corruption Layer 是一種在不同模型間轉換概念和操作的機制。

他有以下特點：

- 可以是單/雙向的。
- 可以作為一組服務。
- 可以利用 FACADE 模式隱藏複雜的轉換邏輯以免污染 Bounded Context。

作為一種模式，很常會把他跟 Customer-Supplier 與 Conformist 搞混，不過實務上也都會搭配出現。只是 Anti-corruption Layer 注重的不是依賴方向而是模型語言轉換的機制。

最常見的場景就是串接外部系統或是使用 Legacy System。很多人一看到 Legacy System 就想要趕快替換掉他，但事實是不要急著想著去替換 Legacy System，因為那可能是你可以領到薪水的最大原因。

更好的做法是在使用 Legacy System 時為你的模型的出入口裝上 Anti-corruption Layer，讓你的開發不受影響，甚至可以一點一滴的替換 Legacy System 的部分功能，達到即使不影響目前功能下也能開發新功能，還能在未來逐漸汰換 Legacy System。

當 Customer-Supplier 間無法順利轉換模型概念，就需要建立一個防腐層。

![https://ithelp.ithome.com.tw/upload/images/20190921/20111997bDChBKtftt.png](https://ithelp.ithome.com.tw/upload/images/20190921/20111997bDChBKtftt.png)

### Separate Way 另謀它路

畢竟任何系統間的依賴都是昂貴的，當兩個 Bounded Context 或團隊間的合作關係沒有帶來太多效益且成本過高時，就可以考慮斷開兩者的關係，讓雙方彼此毫無依賴。這種關係稱為 Separate Way。

簡單來說就是兩邊毫不相關拉。不過當兩邊及早發現這樣的關係時，就可以開始思考利用其他資源達到目的。

### Open Host Service/Published Language 開放主機服務/發布語言

也是實現合作關係的一種機制。上游定義一種協定 (protocol)，讓你的下游透過協定去使用你的服務，並公開這份協定，讓想用的人可以使用它。

常出現在一個上游必須與多個下游進行整合時，為每個下游都特製轉換層會讓成本過高也讓開發處處受限（一堆測試要通過）。

另外在使用上基本上都會搭配 Published Language 使用，兩者差異是， Open Host Service 定義協定，而 Published Language 就是協定傳送資料的語言格式，如 XML、JSON 或是 Protocol Buffer 等等。

![https://ithelp.ithome.com.tw/upload/images/20190921/20111997GpSvuOYrTg.png](https://ithelp.ithome.com.tw/upload/images/20190921/20111997GpSvuOYrTg.png)

### Big Ball of Mud 大泥球

大泥球泛指那些已經混雜成一大團的既有系統。我們會為他們繪製一個邊界，將他們歸納近 Big Ball of Mud 中。在邊界內，不要做太劇烈的改變；與邊界外的交流也需要謹慎，在串接 Big Ball of Mud 時可以考慮加上 Anti-corruption Layer 來做翻譯。

## 挑戰看看

保險公司案例：

一家保險公司可能需要以下幾個 Bounded Context:

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

大家可以試著畫畫看，畫完可以到底下找原文的作法：
題目來源：https://github.com/ContextMapper/context-mapper-examples/tree/master/src/main/resources/insurance-example

再次強調，沒有正確答案。

## Summary

Context Mapping 不但可以幫我們釐清 Bounded Context 間的關係，也可以幫助提升我們在團隊合作上的決策品質。
而在實現 Context Mapping 時，除了慎選串接的機制以外，也可以考慮加入持續整合的概念，確保每次的更動都安全無虞。

不知道這五天下來大家對 Strategic Design 是否有更多的了解？還是已經有些搞暈頭了？

明天將為大家做一個 Strategic Design 回顧，去除掉囉唆的定義，用例子來整合大家的理解！

## Resources

- [cover photo](https://unsplash.com/photos/ZIoi-47zV88)
- [ContextMapper/context-mapper-examples](https://github.com/ContextMapper/context-mapper-examples/tree/master/src/main/resources/insurance-example)
- [DDD: Recognising relationships between bounded contexts](https://markhneedham.com/blog/2009/03/30/ddd-recognising-relationships-between-bounded-contexts/)
  Strategic Domain Driven Design with Context Mapping
- [https://www.infoq.com/articles/ddd-contextmapping/?utm_source=Facebook_PicSee&fbclid=IwAR262EUJ7_4J3QV7tf0laEJGvHIvzfe7rMxx1xUF79Lte9bAg_OYirEGuVU](https://www.infoq.com/articles/ddd-contextmapping/?utm_source=Facebook_PicSee&fbclid=IwAR262EUJ7_4J3QV7tf0laEJGvHIvzfe7rMxx1xUF79Lte9bAg_OYirEGuVU)
- [https://www.slideshare.net/YiChengKuo1/implementing-domaindriven-design-study-group-chapter-3-context-maps](https://www.slideshare.net/YiChengKuo1/implementing-domaindriven-design-study-group-chapter-3-context-maps)
