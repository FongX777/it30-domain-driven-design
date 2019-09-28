# DDD 架構：六角形架構 Port-Adapter Architecture

![https://ithelp.ithome.com.tw/upload/images/20190929/20111997eNi5Tetxii.png](https://ithelp.ithome.com.tw/upload/images/20190929/20111997eNi5Tetxii.png)
([DDD, Hexagonal, Onion, Clean, CQRS, … How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/))

## 進入服務化的時代： Port-Adapter Architecture

### 著重在服務互相串接

### 可以用 Event 來彼此溝通

這邊的一個個六角形都可以當作一個 Bounded Context 來看待，而前面的 Event Storming 告訴了我們。

## Summary

下一篇將繼續介紹如何將 Clean Architecture 實作到程式碼當中。

## Resources

- https://medium.com/@domagojk/patterns-for-designing-flexible-architecture-in-node-js-cqrs-es-onion-7eb10bbefe17
- https://blog.ndepend.com/hexagonal-architecture/
- https://github.com/qas/examples-nodejs-cqrs-es-swagger/blob/master/src/users/services/users.service.ts
