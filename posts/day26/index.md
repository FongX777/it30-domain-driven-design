# DDD 戰術設計：Module

這一篇的主旨很簡單，就是分享檔案架構的設計。設計的精神很簡單，一是滿足高內聚低耦合，二世符合通用語言。

## 依照 Bounded Context 拆分

當初我剛看完 Clean Architecture 的書，從此看系統都是一層層的架構，直到看了 DDD 我才發現，除了一層層架構外，上層還有一個 Bounded Context。而這個 Bounded Context 可以讓我們的系統依照業務需求去劃分，不但更貼近需求變化，也更好被理解。

所以首先，我們要先看我們的軟體有哪些 Bounded Context。比如一個電商可能有 `Catalog`、`Purchasing`、`Inventory` 等 Bounded Context。所以最上層的 Module
名稱會像是這樣：

```
src/
src/catalog/
src/purchasing/
src/inventory/
```

而這樣的命名規則與現代式分層架構是相容的，我們可以在每一個高層級 Module 內加入分層結構。

## 大原則

1. Module 應與領域概念協調。比如你可以在 `domain/model` 裡用 Aggregate 將 Domain Model 分類。
2. 根據領域概念 與 Ubiquitous Language 命名，而非根據類型。
3. 設計鬆耦合的 Module。
4. 當同層級的 Module 出現耦合時，應避免循環依賴。
5. 不要害怕重構你的 Module。如果領域概念會隨時間變化，那 Module 也需要與時俱進。
