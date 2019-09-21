# Strategic Design Recap

## 電影院比喻

## Bounded Context 與 Subdomain 差別。

From PPPoDDD:

Subdomains, introduced in Chapter 3, “Focusing on the Core Domain,” represent the logical areas of a problem domain, typically reflecting the business capabilities of the business organizational structure. They are used to distinguish the areas of importance in an application, the core domain, from the less important areas, the supporting and generic domains. Subdomains exist to distill the problem space and break down complexity.

Domain models are built to fulfill the uses cases of each of the subdomains. Ideally there would be a one‐to‐one mapping between models and subdomains, but this is not always the case. Models are defined based on team structure, ambiguity in language, business process alignment, or physical deployment. Therefore a subdomain could contain more than a single model and a model could span more than a single subdomain. This is often the case within legacy environments.

Models need to be isolated and defined within an explicit context in order to stay pure and focused. As you’ve learned, this context is known as the bounded context. **Unlike a subdomain, a bounded context is a concrete technical implementation that enforces boundaries between models within an application.** Bounded contexts exist in the solution space and are represented as explicit domain models in a context.

常見一個問題： Subdomain 與 Bounded Context 差別在哪裡？
這件事可以說是 DDD 的玄學之一，至今都沒有一個令大家都信服的回答。有一派認為兩者很多時候是角度問題、無法一刀切乾淨，因此與其分那麼細，大家都當作 Bounded Context 討論就好了。

而我自己是認為還是可以分出兩者，將 Subdomain 視作一個籠統的大需求，千萬不要花太多時間在上面，找出核心、大致區分點到為止。而進到 Bounded Context 才會開始討論功能細節，這裡才是將使用案例、 Ubiquitous Language 登場的最佳時機，也是最耗神的地方。

舉例，電商而言，就是要可以「買東西」、「管庫存」，因此就會生出兩個 Subdomain ，並把「買東西」作為 Core Domain 。接著訂單管理、金物流、發票、庫存管理、資源管理等等功能就各自成立 Bounded Context 然後填入以上 Subdomain 中。當個別 Subdomain 過於巨大或複雜時再考慮拆分他。

## 解答

## Resources
