# DDD 30 days

###### tags: `DDD`, `it30`

## Background

複雜多變的業務邏輯、不斷成長的需求、日新月異的技術...
程式的目的就是完成人們的需求，但過去的工廠流水線已經不符合大勢所趨，大家需要更多的自動化或是
面對更多的挑戰如 GDPR...


相信大家就算沒玩過也看過別人打電動如小朋友齊打交之類的。

小時候還要特別拿筆記本出來抄寫招式的組合按鍵如「上跳攻 = 火球術」、「ABACCCAB = 昇龍拳」等等

現在想一想那些規定實在有夠煩瑣，但誰叫遊戲那麼好玩、朋友間那麼流行呢？

現在開始寫了程式，發現寫出來的東西好像跟「ABACCCAB」差不多：

```
Role person  = new Person();
person.attack();
person.jump();
person.move();
gam
```

只是現在看到了這種程式碼，不管是其他人寫的或是幾個月前的自己寫的，都會想去撞牆...這到底在幹嘛??

為什麼不寫成這樣:

```
Role person = new Person();
person.dragonFist();
```

這樣不是更好懂嗎？我們第一步想要理解的是這段程式碼的意圖而非背後瑣碎的細節。但後來發現這種「機械式」而非「業務式」的設計來自於一種習慣：

> 開發人員與業務需求人員的隔閡

我管你是不是昇龍拳還是龍泉啤酒，你給我什麼 spec 我就產出什麼 code ，你打算做到什麼事情我不需要關心。

這在以前 waterfall 的開發流程下，因為軟體大多只為了滿足特定需求，不太會有變更的需求（想想 office 系列只需每幾年出個全新版就可以騙一堆錢了）。

![img](https://images.techhive.com/images/idge/imported/article/itw/2012/08/08/loc-600x460_0-100485825-orig.jpg)

BUT ，現在這套行不通了，隨著軟體需求越來越複雜。更重要的是競爭激烈下，新需求不但要與時俱進，甚至有時還會整個業務核心轉向 (ex: Mongo DB)。即使有完整的測試覆蓋率的習慣，在開發人員不了解業務意圖下，任何的業務需求變更都將是一個噩夢。


## What is it?

那如果我命名都很謹慎且意圖明顯呢？這當然有助於理解程式碼，但變數與函式命名的再好，也是自成一國，與業務需求仍有一段差距。那麼，何不直接把業務語言直接放進程式碼中呢？

> 什麼！？那不就代表我必須離開電腦先跟業務人員開一堆會嗎？

沒錯，乍聽之下增加了開發人員不少的負擔，但只要想到那一變再變或是永遠看不懂、做不完的 spec ，這些努力都會得到回報的！

想想看，今天你看到這段程式碼的感受是：

```
cup.put_filter_cone();
cup.put_filter_paper();
filter_cone.put_coffee_ground();
filter_cone.brew();
wait();
barista.remove_filter_cone();
```

```
barista.brew(coffeeMaterial);
```

可以發現，即使不會寫程式碼的人都可以看懂了。當你今天想要改變任何業務邏輯以增加商業競爭力如送上咖啡時講一個笑話給客人聽，你馬上就知道要加在哪裡而不會破壞整體的邏輯！

有些人第一反應是，這不過是把程式步驟封裝起來，不但增加要寫的程式碼，而且如何避免過多的封裝與抽象化不會造成反效果呢？

沒錯，所以我們才需要 DDD 的精神：「知識的交流」，透過與商業團隊的交流，精準捕捉到每個使用案例的步驟，再藉由案例中使用的語言實踐到程式碼之中。一來增加程式可讀性，二來也避免了 YAGNI (You Aren't Gonna Need It) 

> 使用 DDD 前，改 code 就像是在玩七龍珠，玩名偵探柯南，蒐集到全部才能完成任務。



戰略與戰術部分。
* Strategic Design 戰略設計：利用 Use Case 捕捉業務模型描繪出 Subdomain ，並依此建立 Bounded Context 。
* Tactical Design 戰術設計：又稱 Model-Driven Design ，透過 Strategic Design 建立好的邊界與語言，透過一系列的 pattern 化為程式碼，保護業務核心的穩定性。

### Strategic Design

#### 1. Subdomain
  * core subdomain
  * supplentary subdomain
  * generic subdomain
  
#### 2. Bounded Context
  * Ubiquitous Language 
  
#### 3. Difference between subdomain & bounded context


#### 4. Event Storming

蒐集 event 、獲得共識的 workshop

Caveat:

### Tactical Design

Patterns:
* Entity
* Value
* Aggregate
* Repository
* Factory
* Domain Event
* Domain Service
* Application Service

## Why We Need?

### Benefits

1. 促進跨團隊的溝通
2. 更精準的捕捉 Use Case
3. 安全保護業務邏輯，不會因技術細節 (如 db 、框架、基礎設施)而影響
4. 開發時更靈活彈性、重用程式更方便，不會被繁複的業務邏輯卡住
5. 更好的模組化 = 更容易測試 (完美搭配 TDD)
6. 出現 Bug 時更快找到原因 (已經將關注點分離，查出哪邊出問題很快)
7. 少加班，發大財

不過以下並非好處：

1. 幫助找到對的商業模式
2. 建立 MVP 驗證商業模型



## How to Get Started?


## Common Questions

### 不過是多些封裝而已，還增加開發負擔？

### 我只是個小/新創團隊


很多人會把 DDD 看似繁重的設計當成敏捷開發的絆腳石。老實說，若是團隊中沒有任何 DDD 經驗的人，
這的確會是個艱難的開始。此外，對於尚未找到穩定盈利商業模式的團隊來說，過度投資在技術的風險也太大，
難保不會隔天就整團換掉。

在這邊

> 一開始開發雖然最重要，但只佔整個開發週期的一點點


不過也是有社群的朋友分享過即使是小專案，他也會利用 DDD 的部分 pattern 來快速建立模型，所以這部分其實見仁見智，對於 DDD 相當熟悉的人其實反而能在開發上更快速、正確的開發。




---

## Learning Roadmap

* Strategic Design
  * A simple intro - Thinking in Language
  * Subdomains & Bounded Context
  * Bounded Context More
  * Context Mapping Patterns
  * Event Storming
  * Event Storming Contd.
* Architecture Design
  * Layered Architecture
  * Onion/Clean Architecture
  * Port-Adapter Architecture
  * Communication with other Bounded Contect
  * TDD w/ use case
* Tactical Design
  * Entity
  * Value Object
  * Aggregate & Factory
  * Application Service
  * Domain Service
  * Repository
* Hands-On Project
  * Install TypeScript and Set up Convention
  * A simple project: TODO List
  * A simple project: a hotel booking site
  * CQRS
  * CQRS on project
  * Event Sourcing
  * Event Sourcing on project
  * Actor Model
* Working with Legacy
  * [GETTING STARTED WITH DDD WHEN SURROUNDED BY LEGACY SYSTEMS](http://domainlanguage.com/wp-content/uploads/2016/04/GettingStartedWithDDDWhenSurroundedByLegacySystemsV1.pdf)
  * How to introduce into your team?
  

---
