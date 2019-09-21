# Strategic Design Recap

花了很多的篇幅介紹 Subdomain 與 Bounded Context，本篇想藉由一個比喻跟案例來加深大家的理解！

本篇涵蓋：

- 用電影院做比喻
- 電子商務案例

## 電影院比喻

今天要蓋一家電影院，於是我們規劃需要電影院、售票處、餐飲處。

### Bounded Context 與 Subdomain 差別。

---

從 Patterns, Principles, and Practices of Domain-Driven Design (簡稱 PPPoDDD) 中有一段講得很好。

Subdomain 代表著一塊邏輯上的需求域，通常來說反映出企業組織架構的業務能力。他們被用來區別應用程式不同重要程度的部分如 Core Domain 以及稍微不重要的 Supporting Subdomain 。Subdomain 是用來提煉出問題空間的精華並解構其中的複雜。

Domain Model 則是被建立來滿足各個 Subdomain 的使用案例。理想上 Model 與 Subdomain 間會有一比一的對應關係，但是很難實現。Model 會受到組織架構、語言的模糊性、商業流程或是開發模式的影響。因此一個 Subdomain 可能會包含一個至多個 Model ，而一個 Model 也有可能跨越多個 Subdomain。這種事情很常見於 Legacy System 的環境中。

## Models 需要被隔離並在一個明確的(explicit)邊界內被定義，如此才能讓 Model 不受污染且專注。就像前面所說，這就是我們的 Bounded Context。不像是 Subdomain，一個 Bounded Context 是一個能保證 Model 間邊界的具體的技術實作。 Bounded Context 存在於 Subdomain 中並在其中明確的表達 Domain Models 的含義。

常見一個問題： Subdomain 與 Bounded Context 差別在哪裡？
這件事可以說是 DDD 的玄學之一，至今都沒有一個令大家都信服的回答。有一派認為兩者很多時候是角度問題、無法一刀切乾淨，因此與其分那麼細，大家都當作 Bounded Context 討論就好了。

而我自己是認為還是可以分出兩者，將 Subdomain 視作一個籠統的大需求，千萬不要花太多時間在上面，找出核心、大致區分點到為止。而進到 Bounded Context 才會開始討論功能細節，這裡才是將使用案例、 Ubiquitous Language 登場的最佳時機，也是最耗神的地方。

舉例，電商而言，就是要可以「買東西」、「管庫存」，因此就會生出兩個 Subdomain ，並把「買東西」作為 Core Domain 。接著訂單管理、金物流、發票、庫存管理、資源管理等等功能就各自成立 Bounded Context 然後填入以上 Subdomain 中。當個別 Subdomain 過於巨大或複雜時再考慮拆分他。

## 解答

## Resources
