# DDD 架構： 整合 Clean Architecture

![](https://images.unsplash.com/photo-1547726391-52229b642470?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1455&q=80)

前面學會了分層架構與依賴反轉原則後，其實已經可以理解流行的 Clean Architecture！今天就來跟大家介紹 Clean Architecture 與 DDD 的結合。

本篇會先簡單介紹 Clean Architecture，然後在闡述他跟 DDD 之間的關聯。

## Clean Architecture 的規則

要實作出 Clean Architecture，需要完成三項規則：

1. 分層規則
2. 相依性規則
3. 跨層原則

### 原則 1: 分層規則

首先我們會將系統**依照重要順序以及離 IO 的遠近度**來做分層。

> 離 IO 越近的，代表越容易變化，因此放在最外層。

![https://ithelp.ithome.com.tw/upload/images/20190929/201119978c6JzESmtN.jpg](https://ithelp.ithome.com.tw/upload/images/20190929/201119978c6JzESmtN.jpg)

這樣的好處是，你可以將變與不變分離開來，舉個極端一點的例子，你不會希望你只是因為修改一個 button 的大小，就影響轉帳的商業流程吧？

| 層                 | 職責                                                                             | 例子                             |
| ------------------ | -------------------------------------------------------------------------------- | -------------------------------- |
| Entity             | 負責保管業務概念、業務狀態以及業務規則。本層是軟體的核心。不能依賴任何外部套件。 | 含有業務邏輯的 Class             |
| Use Case           | 定義軟體要完成的任務(使用案例)，並指揮 Entity 層的物件來實現業務邏輯的計算。     | 所有滿足使用者需求的使用案例     |
| Adapter 層         | 將內外的資料轉換成合適的格式輸出或輸入。                                         | Controller, Gateway, Presenters  |
| Framework & Driver | 為上面各層提供框架或技術能力                                                     | **任何框架**、Database、外部服務 |

只有四圈嗎？其實幾圈都取決於你的需求，但不管有幾層，都必須要遵守之後這個規則：**相依性規則**。

### 原則 2: 相依性規則

越裡面的軟體，其層次越高。**外圈是機制，內圈是策略**。Clean Architecture 書中有提到：

> 原始碼依賴關係只能指向內部，朝向更高層級的策略。

這邊需要嚴格遵守，**內圈不能出現任何外圈的知識**，包含變數、類別、函式。這邊有一個小訣竅來辨別：只要你在內圈看到來自外圈的 `import` 或是 `using` 等等引入就代表你違反了規定。

原因很簡單，一旦內圈知道了外圈的知識，那只要外圈的元件有更動，那內圈相關的元件就得跟著修改。在這邊註明一下，分層式架構又分為嚴格跟鬆散兩種，對於嚴格的來說，相依性是不能跨層的，但對於鬆散的來說，只要相依性保持向內，那麼跨幾層並未嚴格規定，這邊請讀者朋友們可以在設計時思考哪一種比較符合自己的情境。

以設計原則來說，我們都希望做到高內聚、低耦合。只是難免需要跨越邊界時，我們有一些規則可以使用。

註：高內聚低耦合可以用古代封建制度做比喻。在領地內，大家要互相幫助，跟鄰居借醬油、跟領主繳稅，互相依賴度很高，這就是高內聚；而領地跟領地之間除了領主以外，基本上彼此間盡量減少往來，這就類似低耦合。

### 原則 3: 跨層規則

使用 Clean Architecture 的目的之一是為了達到關注點分離，因此對於跨越邊境的使用情境我們也必須要有一套解決方法，免得兩者的耦合太深，反而又讓關注點模糊起來。

這邊先問大家一個問題：請問 Entity 層的 class 可以直接被 Use Case 層傳到 Adapter 層或之外的層嗎 (跨層傳遞)？這又會有什麼風險？

答案是，這是你的設計，沒有什麼人規定你不可以，但你必須要先了解這樣做的風險：假如今天你的 UI 直接使用 Entity 層的物件，那今天 UI 層需要一個新的欄位 (而且很常會變)，那就代表你的 Entity 層就必須跟著做修改，連鎖效應下，由裡向外都要跟著改動。除此之外，當你的外外層可以得到 Entity 完整物件的存取，又怎麼能保證不會被亂來呢？

因此，Clean Architecture 這邊推薦當你在做跨層資料輸入輸出時，最好只使用基本的資料結構（無行為）來傳遞，也就是你把你原先的物件重新包裝成一個純資料結構的物件後再送出。

回到上面那一張圖的右下角，可以看到裡面的 `Use Case Input Port` 與 `Use Case Output Port` 。

![https://ithelp.ithome.com.tw/upload/images/20190929/201119975JGH9f5RMQ.jpg](https://ithelp.ithome.com.tw/upload/images/20190929/201119975JGH9f5RMQ.jpg)

- Entity

```typescript
// domain/model/Product.ts
class Product {
  id: string;
  name: string;
  price: number;
  createdOn: Date;
}
```

- Use Case

```typescript
// useCase/product/AddProductUseCase.ts

// Input port
interface AddProductInput {
  name: string;
  price: number;
}
// Output port
interface ProductDto {
  name: string;
  price: number;
  createdOn: Date;
}
interface AddProductOutput {
  statusCode: number;
  message: string;
  product: ProductDto;
}
// Use Case
class AddProductUseCase {
  private productRepo: ProductRepository;
  constructor(productRepo: ProductRepository) {
    this.productRepo = productRepo;
  }

  execute(input: AddProductInput): AddProductOutput {
    const product = new Product({
      id: uuid.v4(),
      name: input.name,
      price: input.price,
      createdOn: new Date()
    });
    await this.productRepo.save(product);
    const productDto = {
      id: product.id,
      name: product.name;
      price: product.price,;
      createdOn: product.createdOn
    }
    const output = {
      statusCode: 200,
      message: 'created',
      product: productDto
    }
  }
}
```

- Controller

```typescript
// useCase/product/controller

class ProdcutController {
  private resp: Express.Reponse;
  constructor(resp: Express.Response) {
    this.resp = resp;
  }

  addProductController(input: { name: string; price: number }) {
    const productRepo = new ProductRepository();
    const useCase = new AddProductUseCase(productRepo);

    const output = useCase.execute(input);

    if (output.success === 200) {
      resp.status(200).send(output.product);
      return;
    }
    // ... other error handling
  }
}
```

註：若要照 `Use Caes Input Port` 與 `Use Case Output Port` 原圖畫的那種實作方式 (建立一堆 Interface)也不是做不到，但要考慮這種複雜性是否符合你的需求。
註：有人可能會很疑惑，外層的 UI 為什麼會影響內層的 Entity，不是都有前面的分層與相依性規則了嗎？但這些規則都是滿足「程式的需求」，而 UI 的改動是為了滿足「使用者的需求」，使用者不會在乎你分幾層。所以當你的 UI 與 Entity 共用物件型態時，在完成需求的情行下， Entity 就很容易受到 UI 細節的影響。

## Clean Architecture 的實作細節

以下提到一些實作的細節。

### 資料夾結構

我們會先由層

### Main Conponenet 的入口管理

我們會使用很多的 Dependency Injection 來管理我們的依賴性。對於一個大型軟體架構來說，經常要在不同的環境下運行，如本地端、單元測試、QA 測試端、CI 端、測試環境端、正視環境端等等，有時甚至不同的客戶會設置不同的環境變數或是套件。

因此我們需要在一切的源頭，也就是程式啟動的 `main` 函式管理並注入不同的環境或相依性。

## Clean Architecture 的好處

Clean Architecture 可以帶來以下好處：

- 獨立於框架
- 可測試
- 獨立於 UI
- 獨立於 Database
- 獨立於任何外部代理

## 與 DDD 結合

前面提過， DDD 並不限至於要在哪一種架構下開發，因為他只需要確保架構中有保留一個「核心層」來開發。不過由於現代軟體開發中，一個系統往往要跟多個系統一起合作。因此我們將採用 Hexagonal Architecture (六角形架構，又稱 Port-Adapter Architecture)，除了一樣將業務邏輯放在核心層，我們同時也強調架構的「開放性」。

如果你需要與任何外部系統（包含資料庫、訊息機制、第三方函式庫、第三方服務）做串接，你只要在 Infrastructure 層開啟一個 Adapter 去接相應的 Port。接到外部指令後再丟給 Application Service Layer 以及 Domain Layer 處理。

他的運作模式就像下圖：

![](https://herbertograca.files.wordpress.com/2018/11/080-explicit-architecture-svg.png)
(source: [DDD, Hexagonal, Onion, Clean, CQRS, … How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/?blogsub=confirming#fundamental-blocks-of-the-system))

| Clean Architecture 層 | 對應使用 Hexagonal Architecture 的 DDD 的層 |
| --------------------- | ------------------------------------------- |
| Entity                | Domain                                      |
| Use Case              | Application Service                         |
| Adapter               | Infrastructure                              |
| Framework & Driver    | External Service (IO)                       |

其實眼尖的朋友不難發現，Hexagonal Architecture 與 Clean Architecture 又或者是 Onion Architecture 本質上都是大同小異。不過這邊 Hexagonal Architecture 其實只是多強調了「與外部連接」的靈活性，將原先 2D 的架構圖升級到 3D 的架構間的交流。對於 DDD 而言，這種系統間的交流就像是前面提到的 Bounded Context Mapping，甚至可以導入 Event-Driven 的架構，讓 Event Storming 的成果顯示在架構上。

![https://ithelp.ithome.com.tw/upload/images/20190929/20111997h9GLLdfFTU.jpg](https://ithelp.ithome.com.tw/upload/images/20190929/20111997h9GLLdfFTU.jpg)
(source: IDDD)

## Summary

其實在很久以前，我就買了 Clean Architecture 來拜讀一番，但看了第一遍卻跟讀天書一樣。一層層的結構看似合理，但根本不知道要怎麼實作啊！直到一年後遇到了 DDD (讀書會讀了 IDDD 第四章)，回頭才對當初 Clean Architecture 的分層恍然大悟！除了各分層的功能以外，更重要的是 DDD Tactical Design 提供了一系列模式可以幫助你完成核心 Domain Layer 的建模 (modelling) 過程。

不然有段時間，Clean Architecture 的內層如何實踐一直沒有一個很好的作法，而 DDD 正好填補了這一缺漏。

這邊需要非常注意，這裡的 Entity Layere 與之後介紹的 DDD Entity 是完全不同的兩件事情。

## References

- [cover photo](https://unsplash.com/photos/AZZKpCpG338)
