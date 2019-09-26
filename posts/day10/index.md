# 事件風暴輕鬆學 Part 4 - 可以做的更好

- Keep the key / legend in view for groups new to Event Storming. You’ll lose your voice trying to explain each part repeatedly!
- Open with a simple, relatable example. This is especially important for those who do not speak English natively. I tend to use something people are familiar with, such as an online shop.
- Divide and conquer for the initial spine of the Events and let the madness begin!
- Hold off on the Aggregate name until absolutely necessary. I usually create a dummy name such as `combobulator` and put it on the wall. Teams tend to try naming it without fully knowing it. Once you’ve walked through the flow several times you’ll know enough to name it!
- Highlight and visualise assumptions you want to test and ensure they’re carried across to the backlog and tested accordingly. Without needing to add a new colour to the ES, I simply highlight with a dot sticker to denote this is an experiment that needs to be conducted.
- Hold the techies back initially as you’ll end up in the weeds of implementation too soon. This can be draining for non techies and will alter the engagement from the wider group as a result. Watch out for the Dungeon Master as per Alberto Brandolini’s article.
- If you have not got enough wall space use some foam boards as “fake walls” or roll out the modelling paper along some tables joined together.
- ES is a colour puzzle, but some people may not be able to differentiate between the bright colours. Add a simple icon to the corner of each Post-It and to the key so it is clear for colour blind people what each Post-It represents
- The physical modelling space and using tools everyone can interact with (Sharpies & Post-Its) creates a safe space for people to engage with the ES and challenge ideas people present. No tech skills or fancy licensed tooling needs to be purchased to engage in ES. I like to fold Post-Its that are removed and drop them to the ground underneath. The pile that forms represents the misconceptions that have been corrected.
- Space out the spine of your ES or you’ll spend a lot of time moving things along making room for the gaps in knowledge. Never start in the corner with it!
- Mark Pivot Events on the ES and, in big groups divide, and conquer around these boundaries to speed up the process. Ensure you stop and inspect to replay the narrative to all groups at regular time intervals. Rotate to different parts of the Event Storm so all the knowledge can be added when working on it this way
- Map the commands to User Stories when value slicing into a product backlog. When doing this, squash commands that logically fall into one feature. For traceability, a simple id code could be added to the Commands and then imported into whatever tool is used to store the User Stories in the backlog.
- As a facilitator, you have to keep the audience focused. To do this, ask lots of questions to tease out gaps on the narrative. Be sure to include people who may be over powered by loud group members. Just because someone is quiet does not mean they have no valuable input. Some questions I like ask are “How would it behave if something goes wrong?” or “Does this always happen or sometimes happen?”. Reversing the narrative can also be beneficial, “What must happen before this event occurs?”.

## 失敗的 Event Storming

- 追求完美。每個問題都想要解決。
- 從理解領域專家的想法變成功能發想大會。
- 大家都只聽領域專家講話（像教室一樣），而很少溝通交流。有時候連領域專家自己都會有所疏漏，甚至無法釐清所有人心中的誤解。
- 在探索期都花在太多時間跟領域專家問問題：問問題（尤其是稍微複雜一點的）常常會吸引大家的目光，導致會議變成大家聽兩人的對答。
- 當技術人員開始發瘋，開始狂聊技術細節如快取、資料庫等等。
- 一開始就分組界線分明的各自負責自己的。
- 當非技術人員開始發瘋，開始變成 Brain Storming。請記住， Event Storming 目的是讓團隊加速溝通流程而非發想新功能，那些請在事前的會議或使用者訪談中完成。
- 大家都坐下來時
- 只有一兩人在說話時
- 懂很多的人不願意交流，認為都在文件裡面了啊。事實上， Event Storming 很大的重點是為了開發者的知識理解。畢竟看 Spec 非常無聊且吸收很糟。
-

## 血和淚的教訓

- Domain Expert 必須要有自我意識
  - BDD Feature files
- Facilitator 必須獨立

- Context != Microservice。Context 是語言邊界，Microservice 是部署單位。

## 加入 User Story Mapping

https://philippe.bourgau.net/how-to-max-out-ddd-big-picture-event-storming-with-other-workshops/

### Facilitator 職責

一開始多鼓勵大家。鼓勵 ice breaker 第一個出來。

一開始很難遵守「過去式」因此要嚴格檢查所有 Event。

Registration, Enrolment or User Acquisition 等太抽象。

尤其在剛開始的時候很難，你可以不必當聰明的人，問一些很明顯的問題、貼一些明顯可能有問題的 Event，讓大家不要害怕「不完美」。畢竟我們在乎的是溝通的過程，而非參加藝術展覽。

- 一開始不必將全套 Event Storming 介紹完才開始，可以講一些些，透過實作的方式最快。

### Domain expert 職責

需要事前

## Summary

Bounded Context Canvas

## 📚Resources

- [DDD: Recognising relationships between bounded contexts](https://markhneedham.com/blog/2009/03/30/ddd-recognising-relationships-between-bounded-contexts/)
  Strategic Domain Driven Design with Context Mapping
- [https://www.infoq.com/articles/ddd-contextmapping/?utm_source=Facebook_PicSee&fbclid=IwAR262EUJ7_4J3QV7tf0laEJGvHIvzfe7rMxx1xUF79Lte9bAg_OYirEGuVU](https://www.infoq.com/articles/ddd-contextmapping/?utm_source=Facebook_PicSee&fbclid=IwAR262EUJ7_4J3QV7tf0laEJGvHIvzfe7rMxx1xUF79Lte9bAg_OYirEGuVU)
- [https://www.slideshare.net/YiChengKuo1/implementing-domaindriven-design-study-group-chapter-3-context-maps](https://www.slideshare.net/YiChengKuo1/implementing-domaindriven-design-study-group-chapter-3-context-maps)
