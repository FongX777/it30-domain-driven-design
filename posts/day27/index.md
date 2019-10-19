# DDD 戰術設計：Bounded Context Integration

對於同一個 Bounded Context 的 Aggregate 間的合作，我們會在 Application Service 調用 Domain Events 或是直接引用。而至於 Bounded Context 間的溝通，情況又複雜了一些。首先要先判斷兩者的上下游關係，再來就是決定交流的機制。關於上下游關係，可以參考之前的 [戰略設計：來聊聊 Bounded Context 的世間情 -- Context Mapping](https://ithelp.ithome.com.tw/articles/10218591)。而機制方面就是我們今天的介紹主軸。

對於交流機制，大致上可以分為三種：

1. 若是兩者採 Shared Kernel (共享內核)，則共用程式碼。
2. 開放 API (RPC、REST、GraphQL...)。
3. Message Queue 處理機制

讓我們一一來看各自的優缺點。

## 共享程式碼

對於任何分散式系統都要有一個警訊在心中：「任何可能會失敗的地方都一定會失敗」，因此多一個系統與對外處理機制都要額外考慮失敗的處理方式 (e.g. 網路斷線)。此外任何介面的轉接與轉譯都需要成本，對於那些早期想快速開發多個 Bounded Context 而言，如果成本太大，那不如使用 Shared Kernel 模式。

使用上，畫出一個共用模組的邊界後，直接在程式中引入進來這個模組。

## 開放 API

如果你把 Bounded Context 作為切分系統邊界的開端，那麼設計一個開放 API 就是一個直覺的開端。

在 API 設計方法中，最常見的有 RPC 與 REST 兩種。RPC 設計簡單，適合輕量級的應用，不過因為可能跟 Application 耦合太深而不易擴展。另外 REST 設計則比較容易與 Application 鬆開耦合。

使用上，我們會在 Infrastructure 層定義一層 Anticorruption Layer (防腐層)，將外部概念翻譯成內部需要的形式。然後在 Application Service 調用這個 Anticorruption Layer 去 call 其他 Bounded Context 所提供的 API，

## Message Queue

雖然開放 API 很方便直覺，但同步地執行每一項外部 API 對於一些高流量系統可能會遇到效能的瓶頸。此外，當各個 Bounded Context 的邏輯越來越複雜，可能一個事件如「訂單成立」就會產生多個 Bounded Context 連鎖反應如會員、收益分析、預測系統等等。這些動作其實可以被 async (異步) 地去處理，也不會影響使用者的體驗。

因此 Bounded Context 間的互動就類似下圖，而拋出去的 Intergration Event (跨系統間的 Event 我們稱 Integration Event)可以放在 Message Queue 中，讓對於該事件有興趣的 Bounded Context/系統自己去訂閱。當訂閱方 Bounded Context 接收到 Event 時，就可以在自己的 Application Service 中完成相對應的任務。

![https://ithelp.ithome.com.tw/upload/images/20191013/20111997DvoX5Rx735.jpg](https://ithelp.ithome.com.tw/upload/images/20191013/20111997DvoX5Rx735.jpg)
(source: IDDD)
