# 用 Domain, Subdomain 與 Bounded Context 鳥瞰系統

我們在第一天有提到什麼是 domain ， 在 IDDD 中定義是：

> 每個組織都有自己獨特的業務範圍與做事方式，而在其中所做的活動都是 domain 的範圍

簡單來說就是 **(你在工作上用到的)問題 + 解法** 。

本篇就是來介紹介紹 DDD 如何定義這些問題與解法。

## Domain 的一體兩面: Problem Space 與 Solution Space

在傳統開發流程 (如 waterfall) 上，會將問題與解法分開，商業團隊負責問題 (Problem Space)，開發團隊負責解法 (Solution Space)，兩者成為一個 Mapping 關係。只是這種做法常常會遇到問題缺漏或是解法缺漏，最後就是靠工程師加班解決。很多方法論如敏捷開發、TDD、BDD 就是希望能夠讓這個 Mapping 越詳盡與正確越好，而 DDD 則是直接將兩者都劃分到 Domain 之下，拓展工程師的視線範圍，把商業需求的語言 (problem space) 都放置到程式碼 (solution space)中。

![Pasted image](https://dynalist.io/u/rEGOkcRbG9YnZUBneAGruNAi)

所以你也可以把 Domain-Driven Design 當作 Business Problem Driven Design

接著介紹一下這兩個空間，可以參考這張圖片作為大綱：
![Pasted image](https://dynalist.io/u/nz6c5ZVhSEibMUu093L-ke6D)

### Problem Space - Subdomain

當我們賦予 Domain 廣義的意義後，也可以理解到現代軟體的複雜性有多高。這個 domain 代表著我們的職責不只是對程式碼負責，也要理解業務含義。只是這個 domain 承載太多含義，可以是整個業務系統、某個核心功能、某個基礎設施功能...

**因此我們要先切出 subdomain 才能繼續往前進**，就像切蛋糕一樣，沒有人可以一口吃下整塊蛋糕，一定是先切出一小塊一小塊慢慢享受。
開發軟體時，理想上我們只需要開發一個系統解決一個問題。但實際上，一個軟體可能存在多種需求，因此需要將軟體需求拆分出細項。

**一次專注一個業務問題，只有當每個部分業務問題解決好了，總問題才能解決。**

Problem Space 的拆分沒有一定的準則，主要是與領域專家討論後交給開發人員去決定。而拆分出的 subdomain 可以依照優先度與功能性分成三個類型:

- Core Subdomain
- Supporting Subdomain
- Generic Subdomain

### Solution Space - Bounded Context

Bounded Context 有一個很重要的原則就是**以語意做邊界**。 Bounded Context 的功能在於讓身在其中的詞彙只有身在 Bounded Context 才能得到完整的含義。因此每個 Bounded Context 都有自己的一套 Ubiquitous Language 在其中。

比如說以 Account 來說，在銀行的 context 下， Bank Account 就明顯不同於社交軟體 Facebook 的 Facebook Account 。

這也引出 Strategic Design 的精神：

> Think in context

這邊我想再提一下 domain model 這個容易跟 domain 搞混的名詞，在我的認知中，兩者是不在同一個層級的，他的層級甚至在 bounded context 之下。
可以說， bounded context 代表 domain 的 solution space 的邊界，而 domain model 就是個邊界裡面運作的模型 (可以是程式碼也可以是 UML)，加上 domain 做前綴是強調這個模型具有強大的業務表達能力。

在拆分 Bounded Context 時也很適合運用 DRY 原則，不重複 bounded context 功能。

## Real Life Examples - Ecommerce

舉電商做例子，一個電商可能需要以下：

## Summary

經過本篇介紹，大家心中應該對於 problem space 與 solution space 有更深的了解。而 DDD 會將兩者切分出一份份。
在每個 bounded context 下穩固業務含義，讓開發的過程中迅速進入狀況。

在這邊講一下個人經驗，雖然這邊講得頭頭是道，但事實上在做決策時才發現非常困難。曾經嘗試與同事一起實作看看，結果大家放空了快半小時也不知道要幹嘛。
因此下一段我除了更深入理解 Bounded Context 之外，同時也會中到如何判斷 Bounded Context 。

## Resources
