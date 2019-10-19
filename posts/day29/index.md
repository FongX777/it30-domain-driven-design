# DDD 實戰：為 Legacy 引入 DDD - 下篇

今天繼續講剩下兩種策略：

- EXPOSING LEGACY ASSETS AS SERVICES 公開遺留系統成為服務
- EXPANDING A BUBBLE 擴展泡泡

## 3. EXPOSING LEGACY ASSETS AS SERVICES 公開遺留系統成為服務

對於一個可能存在一年甚至多年的 Legacy System 而言，任何想加上新功能的動作都是困難的。一般來說，Legacy System 常常會包辦系統大多數的業務行為，因此與其煞費苦心重寫它，不如把他的服務公開出來。

Legacy System 很難用，因此即使公開了 API，也需要用到上篇提到的 Bubble Context 來轉譯概念。但當越來越多新功能要依賴於這個 Legacy System，如果每次都要重新去理解 Legacy System 的箇中奧妙就太累人了！

因此，我們就可以套用 Open Host Service 的概念為 Legacy System 建立一個公開介面的 API，

### 好處

1. 其他 Bounded Context 可以直接使用 Legacy System 提供的服務而不用去理解裡面的內容。
2. 將功能介面與其他的功能解耦合出來，以逐漸淘汰部分 Legacy System。

## 4. EXPANDING A BUBBLE 擴展泡泡

### Model 與 ACL 一起成長

由於新功能需要來自 Legacy System 的支援。因此當你在設計 Model 時，同時也要思考 ACL 的設計。甚至有時候你也會需要先知道 ACL 會接收什麼資料來決定 Model 的設計。因此，最好在一開始就先計畫好兩者一起共同成長，避免未來的不一致。

### 只使用你需要的資料

在你的 ACL 中，過濾掉那些你不會需要的資料。

### Model 要負起新增資料的責任

如果來自 Legacy System 的概念足夠支援你新 Bounded Context，你也要仔細思考到底需不需要再將她轉譯。小心不要被完美主義給限制住了，但要小心當有人沒有將 Legacy System 資料轉成新 Bounded Context 所需要的 Model。如果沒有將 Model 建立成符合業務的語意與需求而直接套用 Legacy System 資料的概念，那不久後你的新 Bounded Context 也會變得跟 Legacy System 一樣難懂。
