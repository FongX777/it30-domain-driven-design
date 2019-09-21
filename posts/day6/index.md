# 戰略設計：重點回顧以及案例說明

![](https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)

花了很多的篇幅介紹 Subdomain 與 Bounded Context，本篇想藉由一個比喻跟案例來加深大家的理解！

本篇涵蓋：

- 用電影院做比喻
- 電子商務案例

## 重點回顧

回顧前，你可以先拿出紙筆、打開編輯器或是面對你家的貓，開始回答以下十題。

讀者們可以先看完問題後先自己思考，再往下看我的答案。

> 1. 請說明 Domain 是什麼？

Domain 是你工作所面對的問題與解法。分為 Problem Space 與 Solution Space 兩個空間。

> 2. 請說明 Ubiquitous Language 的定義與好處以及如何產出？

當團隊內對於領域內的概念有清晰且一致的用詞時，代表團隊正在使用 Ubiquitous Language。
它可以提升開發團隊與領域專家的溝通品質，甚至可以應用在溝通時、文件中、程式裡。

Ubiquitous Language 會經由與領域專家甚至是與客戶反復溝通捕捉使用案例所得出。同時 Ubiquitous Language 也需要不斷的錘鍊以符合需求的改變。

> 3. 請問 Problem Space 與 Solution Space 是什麼？

Problem Space 代表著領域要解決的問題，而我們需要進一步分解它成數個 Subdomain，並依照優先度與外包程度分為： Core Domain、Supporting Subdomain、Generic Subdomain。

Solution Space 代表領域的解決方案，我們會在裡面開發多個 Domain Models 來解決問題。而 Domain Models 需要被隔離在 Bounded Context 中以保證 Model 與 Ubiquitous Language 的一致性。

> 4. 請說明 Core Domain、Supporting Subdomain、Generic Subdomain 的定義與差異。

Core Domain 代表整個系統最有價值且不能被輕易取代的部分，通常企業需要花費最多心力在上面。  
Supporting Subdomain 雖然不是系統最有價值的部分但仍支援核心完成任務。  
Generic Subdomain 同樣也不是最有價值的部分，且通常市場上已有成熟的解決方案，通常可以外包出去。  
最後，這三者有優先程度但**都很重要！**缺乏任何一個系統都會失敗。

> 5. 承上題，請為你目前的工作領域來繪製簡單的 Problem Space。並找出其中的 Core Domain。

動手試試看，或是參考下面的電影院比喻。

> 6. 請說明 Subdomain 與 Bounded Context 間的差別。

> 7. 請說明 Bounded Context 的意義以及對於程式碼的影響。以及如何找出來？

Bounded Context 為解決方案的 Domain Models 建立了一個語意的邊界，讓在其中的 Domain Models 在資料與行為上都能符合 Ubiquitous Language 以及業務需求。

對於找出 Bounded Context，主要以**語意**與**業務能力**來重點。可以從找出那些使用相近概念的名詞與在不同情境下的會有歧異的名詞下手，同時也可以藉由分析系統功能的步驟來解析出 Bounded Context。

> 8. 請說出 Context Mapping 的所有模式以及大致的功能。

- Shared Kernel： 共用程式碼。
- Partnership： 雙方雙向合作。
- Anti-corruption Layer：為下游方建立一層資料轉換層以消化來自上游的資料。
- Open Host Service/Published Language: 在上游方建立一個開放的 API 讓想使用的下游方使用。
- Separate Way： 兩者沒有直接的合作關係。
- Big Ball of Mud：將一團混亂的大系統畫下邊界，在邊界內不要躁進改變，在邊界外要做好 ACL 轉換。
- Customer-Supplier：有上下游關係但上游方對下游方仍保有一定責任。
- Conformist：有上下游關係但上游方對於下游方沒有責任。

> 9. 承 5. 把 Bounded Context 以及 Context Mapping 也一併畫出來

動手試試看，或是參考下面的電影院比喻。

> 10. 請說出你心中的其他疑問，然後在下方留言，我會找時間一一回覆。

## 電影院比喻

剛開始接觸 DDD 時，因為 Strategic Design 不會碰到實際的程式碼，所以花了很久的時間才搞懂 Domain、Subdomain、Ubiquitous Language、Bounded Context 的意義與差別。

所以我想用一個現實生活的簡單比喻來為大家說明：蓋一家電影院吧！

領域專家變成電影院的出資方，我們則是變成建築工人。一開始先進入需求訪談

出資方說：

```markdown
我希望能夠成立一家電影院，這個電影院必須要有**售票亭**可以售票給顧客。售票時，員工要檢查**顧客的身分證、時間、電影、座位**等等。然後因應 APP 的風潮，所以我們想要跟第**三方訂票軟體**合作，利用線上預約現場售票處取票。當然，電影院一定要有**放映廳**，要進去放映廳前會有員工**檢查消費者的票**是否符合目前播放的電影。再來， 客人在售票處買電影票時也可以添加**食物套餐**，然後你可以憑票去**飲食部**換取你的食物，飲食部需要與售票處獨立出來，因為飲食部還需要**管理食物的庫存**...
```

如果你看完覺得很冗長，我說，這才是真實世界的情境！你可以發現就連領域專家本人在講話時可能都沒有統一他的語言，一個名詞有多種說法(ex: 顧客、客人、消費者)。所以當你套用 DDD 時，為了要建立 Ubiquitous Language 與 Bounded Context ，你就會開始注意這些語言細節，也開始要求領域專家與開發團隊都要用 Ubiquitous Language 溝通。

比如，「客人」、「售票亭」、「飲食部」、「放映廳」、「員工」等名稱要統一。

接著在你來我往的需求訪談後，我們可以發現領域專家有三個主要需求：**電影、售票、食物**。其中放映廳是這家電影院的主要競爭力 (Core Domain)，而售票與食物部分並未全部外包出去，因此算是 Supporting Subdomain。

![https://ithelp.ithome.com.tw/upload/images/20190922/20111997jsryhibfwu.png](https://ithelp.ithome.com.tw/upload/images/20190922/20111997jsryhibfwu.png)
(找出 Subdomains)

接著，我們從上述的需求訪談裡面列出了幾項關鍵使用案例：

- 售票亭可以售票給客人，客人可以選擇電影、時刻、座位以及是否添加套餐。
- 售票亭員工售票前，要檢查客人的身分證以符合電影分級。
- 客人可以用 APP 線上預約訂票與餐點，然後到現場售票亭取票。
- 客人進入放映廳前，放映廳員工要在門口查票，確認好電影時刻與座位後才能放客人進去。
- 客人要到飲食部憑票才能兌換到食物，飲食部員工要依電影票上的餐點品項製作餐點。
- 當飲食部任何食物庫存低於 50% 時，要通知庫存管理部補貨。早上通知下午補貨，下午通知隔天早上補貨。

有了以上的關鍵使用案例，我們可以描繪出以下 Bounded Context：

- Box Office Context 售票處
- Online Booking 線上訂票
- Concession Stand Context 飲食部
- Inventory Context 庫存管理
- Auditorium Context 放映廳

![https://ithelp.ithome.com.tw/upload/images/20190922/20111997sI6xhTNkua.png](https://ithelp.ithome.com.tw/upload/images/20190922/20111997sI6xhTNkua.png)
(建立 Bounded Context 並定義依賴關係)

差個曲，如果哪一天出資方決定要將售票服務或是餐飲服務整個外包出去時，該 Subdomain 可能就會成為 Generic Subdomain。

接者當你開始在 Bounded Context 中開發 Domain Model 時，可以發現一件有趣的事情：一個電影票券在不同的 Bounded Context 中有不一樣的行爲。可以參考下圖：

![https://ithelp.ithome.com.tw/upload/images/20190922/20111997geXEaXinxi.png](https://ithelp.ithome.com.tw/upload/images/20190922/20111997geXEaXinxi.png)
(一個 Ticket 各自表述)

## Resources

- [cover](https://unsplash.com/photos/J39X2xX_8CQ)
- [Domain-Driven Design \*](https://www.tenlong.com.tw/products/9789864343874?list_name=c-domain-driven-design) 俗稱小藍書，看了會有很多收穫但稍嫌抽象。可以買一本供奉著。
- [Implementing Domain-Driven Design \*](https://www.tenlong.com.tw/products/9787121224485) 小紅書，也是本系列主要參考對象，以 JAVA 實現，雖然年代稍久，但實作面很強的一本書，很建議與本篇一起閱讀。
- [Domain-Driven Design Distilled \*](https://www.tenlong.com.tw/products/9780134434421) 可以當小紅書前傳來看，很適合傳教或推坑使用。
- [Patterns, Principles, and Practices of Domain-Driven Design \*](https://www.tenlong.com.tw/products/9781118714706?list_name=srh) 另一本很推薦的書，尤其適合熟悉 C# 的朋友入手。很建議與上面那本搭配閱讀。

這邊想引用 Patterns, Principles, and Practices of Domain-Driven Design (簡稱 3PoDDD) 裡面對於 Subdomain 與 Bounded Context 差別的論述，以下我用中文翻譯：

> Subdomain 代表著一塊邏輯上的需求域，通常來說反映出企業組織架構的業務能力。他們被用來區別應用程式不同重要程度的部分如 Core Domain 以及稍微不重要的 Supporting Subdomain 。Subdomain 是用來提煉出問題空間的精華並解構其中的複雜。

> Domain Model 則是被建立來滿足各個 Subdomain 的使用案例。理想上 Model 與 Subdomain 間會有一比一的對應關係，但是很難實現。Model 會受到組織架構、語言的模糊性、商業流程或是開發模式的影響。因此一個 Subdomain 可能會包含一個至多個 Model ，而一個 Model 也有可能跨越多個 Subdomain。這種事情很常見於 Legacy System 的環境中。

> Models 需要被隔離並在一個明確的(explicit)邊界內被定義，如此才能讓 Model 不受污染且專注。就像前面所說，這就是我們的 Bounded Context。不像是 Subdomain，一個 Bounded Context 是一個能保證 Model 間邊界的具體的技術實作。 Bounded Context 存在於 Subdomain 中並在其中明確的表達 Domain Models 的含義。
