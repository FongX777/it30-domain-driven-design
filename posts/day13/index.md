# DDD 架構： 整合 Clean Architecture

前面學會了分層架構與依賴反轉原則後，其實已經可以理解最近流行的 Clean Architecture！因此今天就來跟大家介紹 Clean Architecture 與 DDD 的結合。

本篇會先簡單介紹 Clean Architecture，然後在闡述他跟 DDD 之間的關聯。

## Clean Architecture 的規則

### 原則 1: 分層規則

- Entity 層
- Use Case 層
- Port-Adapter 層
- Framework & Driver 層

只有四圈嗎？其實幾圈都取決於你的需求，但不管有幾層，都必須要遵守之後這個規則：**相依性規則**。

### 原則 2: 相依性規則

越裡面的軟體，其層次越高。**外圈是機制，內圈是策略**。

> 原始碼依賴關係只能指向內部，朝向更高層級的策略。

這邊需要嚴格遵守，**內圈不能出現任何外圈的知識**，包含變數、類別、函式。這邊有一個小訣竅來辨別：只要你在內圈看到來自外圈的 `import` 或是 `using` 等等引入就代表你違反了規定。

原因很簡單，一旦內圈知道了外圈的知識，那只要外圈的元件有更動，那內圈相關的元件就得跟著修改。

![https://ithelp.ithome.com.tw/upload/images/20190929/201119978c6JzESmtN.jpg](https://ithelp.ithome.com.tw/upload/images/20190929/201119978c6JzESmtN.jpg)

以設計原則來說，我們都希望做到高內聚、低耦合。只是難免需要跨越邊界時，我們有一些規則可以使用。

註：高內聚低耦合可以用古代封建制度做比喻。在領地內，大家要互相幫助，跟鄰居借醬油、跟領主繳稅，互相依賴度很高，這就是高內聚；而領地跟領地之間除了領主以外，基本上彼此間盡量減少往來，這就類似低耦合。

### 原則 3: 跨層規則

回到上面那一張圖的右下角，可以看一下。

![https://ithelp.ithome.com.tw/upload/images/20190929/201119975JGH9f5RMQ.jpg](https://ithelp.ithome.com.tw/upload/images/20190929/201119975JGH9f5RMQ.jpg)

DTO 的概念。

- Entity

```typescript
```

- Use Case

```typescript
```

- Controller

```typescript
```

## Clean Architecture 的實作程式碼

### 資料夾結構分析

### Main Conponenet 的入口管理

- 環境
- 相依性注入

## Clean Architecture 的好處

### 從一個 CRUD 來看 Clean Architecture

以建立一件商品來做例子好了。

### 應用 TDD 與 BDD

1. 先撰寫測試 ``
2. 寫 Use Case 然後失敗
3. 發現需要 Entity，於是寫 Entity 測試
4. Entity 撰寫
5. 發現需要 Repository，於是先寫 Repository 測試
6. 撰寫 Repository
7. 回頭撰寫 Use Case

### 特徵

- 獨立於框架
- 可測試
- 獨立於 UI
- 獨立於 Database
- 獨立於任何外部代理

之後會有一張專門介紹如何應用！

## 與 DDD 結合

- Entity 層 -> Domain 層
- Use Case 層 -> Application Service
- Port-Adapter 層
- Framework & Driver 層

重點在於 Entity 與 Use Case 的地方，會有一系列的模式來 cover !

## Summary

其實在很久以前，我就買了 Clean Architecture 來拜讀一番，但看了第一遍卻跟讀天書一樣。一層層的結構看似合理，但根本不知道要怎麼實作啊！直到一年後遇到了 DDD (讀書會讀了 IDDD 第四章)，回頭才對當初 Clean Architecture 的分層恍然大悟！

不然有段時間，Clean Architecture 的內層如何實踐一直沒有一個很好的作法，而 DDD 正好填補了這一缺漏。

這邊需要非常注意，這裡的 Entity Layere 與之後介紹的 DDD Entity 是完全不同的兩件事情。

下一篇將繼續介紹如何將 Clean Architecture 實作到程式碼當中。

## Resources

- https://medium.com/@domagojk/patterns-for-designing-flexible-architecture-in-node-js-cqrs-es-onion-7eb10bbefe17
- https://blog.ndepend.com/hexagonal-architecture/
- https://github.com/qas/examples-nodejs-cqrs-es-swagger/blob/master/src/users/services/users.service.ts
