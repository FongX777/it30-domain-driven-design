# Bounded Context 深度解析

Bounded Context 就像一個國家一樣，在台灣你說。
更直接一點，「爸爸」一詞只有在自己家 (context) 才成立。

## 🔍 如何辨識 Bounded Context

> This is design and art, not science.

### 同一概念拆分在不同 Bounded Context

## 🚫 Bounded Context 常見迷思

### 迷思一：一次就要分完

事實上大多數系統一開始可能只會有一個 Bounded Context 或是業務複雜度不足以分出多個 Bounded Context 。

### 迷思二：根據技術架構分 Bounded Context

### 迷思三：根據開發任務拆分 Bounded Context

### 迷思四：Bounded Context 與團隊合作分離

Conway Laws
By Conwey Law: 軟體組織的團隊邊界決定系統邊界 => Bounded Context 也成為了一個決定團隊邊界的好方式，對於跨國團隊更有利。

## 💣 Bounded Context 的強大威力

### 命名不用怕

### 身份認證

### 可以用來拆分 Microservice

### 可以用來分配團隊任務

## 📝 Summary

Bounded Context 原先就是從與領域專家溝通得來的知識所建構出的邊界，因此不難理解他會是一個語意的邊界！因此在思考 Bounded Context 時，請開發人員先屏棄技術細節的探究，以軟體的業務功能為優先。
Bounded Context 為系統間提供了絕佳的邊界，不管是否之後有沒有採用 Tactical Design ，對於成長中的軟體服務都是非常實用的。

當我們拆分出 Bounded Context 後，我們也需要理解如何連結使用他們。下一篇會來介紹幾個常見的 Bounded Context 合作模式，又稱 context mapping。

## Resources

- [Context is King: Finding Service Boundaries](https://dev.to/codeopinion/context-is-king-finding-service-boundaries-4mob)
