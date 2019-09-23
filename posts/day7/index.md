# Event Storming Part 1 - 簡介與事前準備

![cover](https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)

現代軟體的開發難度越來越高，關鍵點之一就是**逐漸複雜的商業邏輯**。傳統的流水線開發法疏遠了商業團隊與開發團隊間的距離，開發人員只能照著模糊又瑣碎的需求書摸石頭過河，最後專案無法如期交付，團隊間的隔閡也跟著擴大。

事實上，產品越複雜，它所需要的**領域知識往往是跨團隊的**，沒有任何單一團隊可以掌握它的全貌。但要媒合不同背景知識的人做有效地溝通非常的困難，很多人在導入 DDD Strategic Design 時，就是因為沒有與領域專家做好有效的溝通因而事倍功半。

幸好在 2013 年，一位義大利人 [Alberto Brandolini](https://medium.com/@ziobrando) 為了有效與領域專家溝通因而發明了 Event Storming 工作坊。

接下來我將用四篇文來為各位介紹這項溝通流程神器，分為「事前準備」、「展開風暴」、「進入軟體設計」以及「可以做得更好的部分」。這幾篇我會盡量用詞精簡，讓尚未看過前面篇的朋友們可以快速理解。

這邊先聲明，**使用事件風暴不代表一定要採用 DDD，只要你有意想促進團隊的溝通與領域知識的理解**， Event Storming 永遠都是你的選項之一！

本篇涵蓋內容：

- Event Storming 概覽
- Event Storming 應用場景
- Event Storming 事前準備

另外，事先說明一下在本系列中，如果我是指「某個便利貼」我會用英文如 Event、Command 來敘述，如果只是單純敘述事情我會用中文如事件來描述。

---

## Event Storming 概覽

Event Storming 是一個透過**高度互動**的方式，將企業或系統的**商業流程視覺化**，最終協助建立**軟體模型**的工作坊。簡單來說就是探索功能、找出盲點、建立共識。

跑完後，與會者們都將會獲得：

- 對於商業流程的**共同理解**，包含名詞使用、責任範圍、使用者體驗等。
- 一份整體流程的**概覽圖 (Big Picture)**，事後也可以數位化製成文件。
- 可以找出商業流程中的核心價值、風險與機會。
- 一個導入 DDD 的好起點。

整個過程中會用便利貼來視覺化流程，**不會有艱深的技術詞彙或商業報表**，只會有團隊學習與多元觀點的對話。實際跑起來會像是這樣：

![](https://i.imgur.com/Diaa1Mr.gif)

### 適合的對象

如果你的工作流程出現以下症狀，請儘早服用 Event Storming：

- 需求書瑣碎、難以理解、沒有明確架構。
- 討論時常陷入細節的爭論，或是過多的技術詞彙讓主題失焦。
- 開發到一半還在理解功能在幹嘛。
- 等到上線了才發現一堆 Bug。

## Event Storming 應用場景

使用的場講點從巨觀到微觀：

- **Big Picture 綜觀全局** ── 釐清混亂的商業流程，凸顯出合作關係、邊界、責任歸屬與不同利益相關者的觀點。
  - 邀請任何有興趣的人、不用限制討論範圍
  - 找出瓶頸、核心價值甚至是新的解決方案
  - 主要以 Event、System、Question 為主。
  - 適合新創或小團隊(人少、技術債少)
- **Process Modelling 流程展示** ── 討論特定功能流程，以確保沒有理解錯誤。
  - 有明確範圍
  - 在細節中找出流程的 Bug。
  - 會用到 Event、Actor、Command、System、Policy、Read Model。
- **Software Design 軟體設計** ── 利用前面的產出進一步設計軟體
  - 加入 Aggregate、Bounded Context 建立模型邊界。
  - 對於用詞更加精準

此外， Event Storming 也可以讓新進員工快速上手領域知識。想知道更仔細的，可以看這部 [GOTO 2018 • 50.000 Orange Stickies Later • Alberto Brandolini](https://www.youtube.com/watch?v=NGXl1D-KwRI)。

## 事前準備

一場好的 Event Storming，人事時地物缺一不可。

### 場地設置

- 找到一面**限制最少的表面**來進行活動。
  不管是牆面、窗邊甚至用多面移動白板組成都可以。你無法預測最後的產出有多少，所以盡你所能，不要因為空間而限制活動的品質。
- 在表面上**貼上大型畫紙捲**方便收納產出以及進行另一場 Event Storming。
- 以**最大化活動空間**。將現場的雜物移開，不過可以留下一張小桌子放道具。
- 一定要**將椅子移走**。經驗中，只要有人坐下，就會開始沈默，最後自我放逐。
- (建議)一面白板或海報寫上**名詞定義清單**。這場會議中的對話都要遵照清單上的用詞。
- 提供幾張有圖示標明 (Legend) 的海報紙。可以參考以下圖示：

便利貼種類與互動模式：  
![legend](https://ithelp.ithome.com.tw/upload/images/20190923/20111997GZdzTXl6ko.png)
(source: https://leanpub.com/introducing_eventstorming)

甚至你可以更詳細地將各種便利貼用法都介紹出來：
![](https://miro.medium.com/max/6036/1*3C1KOlB_P5X_11nZcBpP5w.jpeg)
(source: https://medium.com/@springdo/a-facilitators-recipe-for-event-storming-941dcb38db0d)

當你準備好場地，大概就會長這樣子。

![setup](https://ithelp.ithome.com.tw/upload/images/20190922/20111997r03c73v5wu.png)
(source: https://leanpub.com/introducing_eventstorming)

### 邀請對的人

這是最重要的元素。一場 Event Storming 會需要以下角色：

- **主持人 Facilitator**:  
  建議一定要有一名參與者負責主持會議進行、推動議程討論。要嚴格注意時間與流程。最好不要跟 Domain Expert 重複。
- **領域專家(們) Domain expert(s)**:  
  專案的主要推動者，或是擁有足夠領域知識的人，建議最好有一定的決定權，在陷入泥沼時才可以做出決定。如果是新創領域，可以事先做好使用者訪談或是找使用者來參加。可以不只一名。
- **其他利益相關者 Other Stackholder**:  
  可能是參與專案的工程師、設計師，也可能任何能提供專業意見的人士如業務、商業分析師甚至是主管。

通常一場會議 6-8 人就可以進行一場精彩的 Event Storming，至於超過 10 人以個人經驗來說場面就會開始混亂起來(除非主持人經驗豐富)。

### 火力展示你的道具

你需要「非常多」的便利貼。千萬不要因為省錢就少買某個顏色，因為每個顏色都有各自的意義，無法互相替代。你會需要以下顏色的便利貼：

- 橘色(正方形)：Event 事件
- 藍色(正方形)：Command 命令
- 黃色(小張長方形):Actor 角色
- 紫色 (長方形): Policy/Process 商業政策/流程
- 粉紅色(長方形)：System 外部系統
- 紅色(正方形):Question 疑問/盲點
- 綠色(正方形)：Read Model 資料讀取模型
- 白色(大張正方形)：Uset Interface 使用者介面

以上顏色皆可以自行調整，不過 Event 還是熟悉的橘色最對味。接著還有其他道具：

- 簽字筆。每個人至少一支。
- 一隻粗一點的奇異筆。
- (推薦)計時器。可以幫助時間控管。
- (選用)投影設備。方便讓領域專家解說需求。

可以參考這張[購物清單](https://www.amazon.co.uk/registry/wishlist/2AWT7JZNMLAW6/ref=cm_sw_r_cp_ep_ws_N0ISBbQBYDFFD)

### 滿滿的能量

Event Storming 超級耗費心力，可以喝杯咖啡後再上路。或是在周圍放些小點心供與會者取用。

### 線上替代方案

如果你想要愛地球減少浪費，或是時間跟人都擠不出來，可以考慮使用線上版工具 [Miro](https://miro.com/app/dashboard/)。

![https://ithelp.ithome.com.tw/upload/images/20190923/20111997aljnGJqOEr.png](https://ithelp.ithome.com.tw/upload/images/20190923/20111997aljnGJqOEr.png)
(Miro 使用示意圖)

## Summary

Event Storming 是一個知識交流、打破穀倉效應 (silo effect) 的絕佳場所。同時對於團隊來說是一個非常好的「階段式學習」過程。過程中不但可以提早發現盲點，也能讓未來開發專注在核心功能上。最重要的事，他可以讓原本各自為政的團隊有機會聚在一起達成共識。從商業層面來看， Event Storming 讓我們綜覽全局來辨識出問題的癥結點，並專注在核心競爭力上；從開發層面來看，Event Storming 提供了一個有效的建構軟體方向，讓開發更有自信且減少貧血模型的使用。

除此之外，使用 Event Storming 除了提升開會的效率，更重要的是**帶來個人的成長**。一名開發者的價值並不僅僅在於會用多少技術，也與工作領域的熟悉程度有高度相關。當你對於某項產業的理解越深刻，加上技術能力，你就越難被取代。甚至，你可以從技術人員升為顧問，一同參與重要的商業決策。

## Resources

以下都是非常好的學習資源，每篇都值得一讀：

- [A facilitators recipe for Event Storming](https://medium.com/@springdo/a-facilitators-recipe-for-event-storming-941dcb38db0d)
- [50.000 orange stickies later](https://www.slideshare.net/ziobrando/50000-orange-stickies-later?from_action=save)
- [事件風暴-領域建模](https://www.slideshare.net/ssusercab70d/ss-125442613)
- [Modelling Reactive Systems with Event Storming and Domain-Driven Design](https://blog.redelastic.com/corporate-arts-crafts-modelling-reactive-systems-with-event-storming-73c6236f5dd7)
- [Event Storming For Rapid Domain Learning](https://keyholesoftware.com/2017/08/07/event-storming-for-rapid-domain-learning/?fbclid=IwAR00X5bn-6GWyldhdnexjY69IBm5lybZdnTWm3rzhLIO1iPXZiTxsRJerB8)
- [cheatsheet](https://eventnotes.io/pdf/cheatsheet-process-modeling.pdf)
- [A step by step guide to Event Storming – our experience](https://www.boldare.com/blog/event-storming-guide/)
- [YOW! West 2016 Paul Rayner - EventStorming #YOWWest](https://www.youtube.com/watch?v=bXm8Cznyb_s)

- [Detailed Agenda of a DDD Big Picture Event Storming - Part 1](https://philippe.bourgau.net/detailed-agenda-of-a-ddd-big-picture-event-storming-part-1/)
- [Detailed Agenda of a DDD Big Picture Event Storming - Part 2](https://philippe.bourgau.net/detailed-agenda-of-a-ddd-big-picture-event-storming-part-2/)
- [Detailed Agenda of a DDD Big Picture Event Storming - Part 3](https://philippe.bourgau.net/detailed-agenda-of-a-ddd-big-picture-event-storming-part-3/)

- [cover photo](https://unsplash.com/photos/5Mh8iz9vqpY)
- [DDD: Recognising relationships between bounded contexts](https://markhneedham.com/blog/2009/03/30/ddd-recognising-relationships-between-bounded-contexts/)
  Strategic Domain Driven Design with Context Mapping
- [https://www.infoq.com/articles/ddd-contextmapping/?utm_source=Facebook_PicSee&fbclid=IwAR262EUJ7_4J3QV7tf0laEJGvHIvzfe7rMxx1xUF79Lte9bAg_OYirEGuVU](https://www.infoq.com/articles/ddd-contextmapping/?utm_source=Facebook_PicSee&fbclid=IwAR262EUJ7_4J3QV7tf0laEJGvHIvzfe7rMxx1xUF79Lte9bAg_OYirEGuVU)
- [https://www.slideshare.net/YiChengKuo1/implementing-domaindriven-design-study-group-chapter-3-context-maps](https://www.slideshare.net/YiChengKuo1/implementing-domaindriven-design-study-group-chapter-3-context-maps)
