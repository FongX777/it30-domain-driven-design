# DDD 實戰：為 Legacy 引入 DDD - 上篇

當我們對戰略設計 (Strategic Design) 與戰術設計 (Tactical Design) 有了基本概念後，通常阻礙在人們導入 DDD 的第一道關卡 (也是最大的關卡)，就是 Legacy System。DDD 的理念很好、設計很符合需求，但不是每次都有機會從全新的草原專案 (greenfield project) 開始，而貿然地把 Legacy System 轉換成 DDD 的設計是不切實際的，在還沒感受到 DDD 的威力之前，就先修 Bug 修到吐血。

所以對於那些還不熟悉 DDD 的團隊或是 Legacy System 異動成本太高的情境， Eric Evans 在他 2013 的這篇 [GETTING STARTED WITH DDD WHEN SURROUNDED BY LEGACY SYSTEMS](https://bit.ly/2FZKT6I) 有提到四種面對 Legacy System 的策略。這四種策略分別為：

1. BUBBLE CONTEXT 泡泡上下文
2. AUTONOMOUS BUBBLE 高自治性泡泡
3. EXPOSING LEGACY ASSETS AS SERVICES 公開遺留系統成為服務
4. EXPANDING A BUBBLE 擴展泡泡

## 1. Bubble Context

Bubble Context 的概念很簡單，就是將你的新功能獨立成一個 Bubble Context (因為這是一個暫時的 Context，可能並非符合你真正需求的 Bounnded Context)，有自己的 Core Domain 以及 Application Service。但最重要的是，他需要**實作一個橋接與轉換 Legacy System 的 Anticorruption Layer (防腐層)**。

註：前面在 Context Mapping 有聊到 Anticorruption Layer 的概念。簡單來說就是一層轉換層將外部概念 Map 成內部概念。

因此，對於那些還在學習 DDD 或是尚未全面導入的團隊，第一種方法是一個不錯的起點。讓即使是一個小團隊也能使用 DDD 的模式持續為 Legacy System 加入新功能。此外，Bubble Context 也不會需要重新設計資料庫 Schema。

要理解這個設計，首先我們來看一個普通的 Context 的模樣：

![https://ithelp.ithome.com.tw/upload/images/20191014/20111997mNUI4sGKhp.png](https://ithelp.ithome.com.tw/upload/images/20191014/20111997mNUI4sGKhp.png)

接著想像你可能有很多個 Legacy System 都被劃分成一個個 Bounded Context。而 Bubble Context 並不會自己保存資料，而是透過 ACL 去取用其他 Bounded Context 的資料。

![https://ithelp.ithome.com.tw/upload/images/20191014/20111997MQyaOmtn0q.png](https://ithelp.ithome.com.tw/upload/images/20191014/20111997MQyaOmtn0q.png)

有了一層轉換層後，新功能的開發人員就可以專注在新功能的業務問題上，而不用與 Legacy System 的那團混亂奮鬥。同時，由於不用實作持久化的機制 (都 call 外部 API)，也可以暫時不用煩惱相關的問題。

不過，只要系統間有了依賴性，就會有相對的缺點。最大的缺點是耦合度。當處於下游的 Bubble Context 依賴於上游的 Legacy System 時，代表你要隨時跟著 Legacy System 的異動而修改。此外，Bubble Context 的存在是短暫的，隨著新概念的引入，那些 ACL 可能開始變得不合時宜，漸漸地， Bubble Context 又成為另一個 Legacy System。

但 Bubble Context 仍是一個相對成本小、易上手的作法。

## 2. Autonomous Bubble

要讓新的 Context 的邊界更加穩固，最快的作法就是斷開~~魂結~~相依性。在 Autonomous Bubble 與前者不同的是，**Autonomous Bubble 有自己的資料儲存機制 (i.e. 自己的資料庫)**。雖然這勢必增加額外的技術底層的複雜度以及資料無法即時從外部更新的疑慮，但也提高服務的穩定性以及測試性。

由下圖可以觀察到，Autonomous Bubble 會自己管理自己的持久化機制，同時也會設計一個 Coordinator 以非同步的方式從外部 Legacy System 同步資料進來，這種方式也稱為 Synchronizing Anticorruption Layer。

![https://ithelp.ithome.com.tw/upload/images/20191015/20111997wALFhinp5i.png](https://ithelp.ithome.com.tw/upload/images/20191015/20111997wALFhinp5i.png)

最常見的案例其實我們都不陌生，那些「夜晚的批次腳本 (Nightly Batch Script)」就是相對低技術需求的 Synchronizing ACL，可能你需要在一些沒有流量的時間點進行資料備份或是某些資料需要同步等等。不過傳統的腳本通常會有不必要的耦合，要不就是加入太多商業邏輯，要不就是跨越多個 ACL 造成不必要的複雜度。

因此，在 Synchronizing ACL 設計中，最好把資料複製的邏輯與翻譯的工作 (與商業邏輯)分開，以保持自治性。

### 使用 Events 與 Messaging 作為方法之一

如果你想要有更彈性的作法，可以參考使用 Events 與 Messaging 作為 Synchronizing ACL 的技術機制。而透過 DDD 的幫助，將領域中的事件明確地建立專屬的 Domain Event 讓訂閱者接收。當然，任何跨 Bounded Context 的訊息都需要經過一定的轉譯。

參考下圖可以注意到，這張圖的每個 Context 都多了一個 Event Queue 在裡面，負責非同步地去更新狀態。如此一來，新 Bounded Context 與 Legacy System 間的耦合降低了，除了減少依賴的不穩定性外，甚至也提供新 Bounded Context 獨立成新產品的可能性。

雖然需要自己存一份資料會有點費工，但若是今天有一個以前不存在的新概念要加入，實作 Bubble Context 就會遇到一個麻煩：要將這概念放到 Legacy System 中(即使完全不會用到)再傳給 Bubble Context。而有自己持久化機制的 Autonomous Bubble 則有更多選擇。

![https://ithelp.ithome.com.tw/upload/images/20191015/20111997rPjdG7R0gm.png](https://ithelp.ithome.com.tw/upload/images/20191015/20111997rPjdG7R0gm.png)
