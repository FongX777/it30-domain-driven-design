# DDD 戰術設計：Application Service

有了前面篇章對於 Entity、Value Object 以及 Aggregate 的介紹，我們已經裝備好建構 Domain 層的武器庫，接著來介紹分層式架構的第二層，應用程式層，又被稱為使用案例層。

在這一層，你可以很清楚的看到整個應用程式需要完成的任務有哪些，甚至你可以將這一層可以作為你寫程式的起點。

在使用應用需要注意幾件事情：

1. Application Service 層可以操作 Domain Model 去完成業務需求，並把計算與業務邏輯交給 Domain Model。
2. Application Service 層專注在系統的使用案例，並不在乎與外部系統的 IO 互動細節。那些細節將交給外面一層處理。

本系列會用 3 篇來介紹，一方面介紹 Application Service 的應用，另一方面也會示範如何將 TDD 與 BDD 的概融入現代式分層式架構 (嚴格來說，是 Clean Architecture) 之中。

## Application Service 的工作範圍

讓我們再次複習一下在 DDD 中使用的現代式分層式架構圖：

![https://ithelp.ithome.com.tw/upload/images/20191006/20111997mf5v8N9vOL.png](https://ithelp.ithome.com.tw/upload/images/20191006/20111997mf5v8N9vOL.png)

從上圖我們可以看到，Application Service 擔任著居中的角色，因此我們要先來釐清到底哪些是 Application Service 該做的，哪些是他不該做的。

// TODO: 提供尖叫架構資料夾圖是

```
screaming_architecture
├── catalog
├── inventory
└── order
    ├── application
    │   ├── createOrder.ts
    │   ├── getOrderList.ts
    │   └── updateOrder.ts
    ├── domain
    │   └── model
    │       └── Order.ts
    └── repository
        └── OrderRepository.ts
```

而設計 Application Service 時，我將採用 [Clean Architecture](https://www.tenlong.com.tw/products/9789864342945) 所介紹的「尖叫的架構 (Screaming Architecture)」的風格。他的精神就是「當你看完專案的資料夾結構後，你就可以大概知道這個系統的功能了」。因此，我會把**每個使用案例都單獨建立一個檔案**，並且每一個檔案都有一個共通的規範：

1. 有一個簡單資料結構的 Input (或稱 Request Model)
2. 有一個簡單資料結構的 Output (或稱 Response Model)
3. 有一個 Class 以使用案例做命名
4. 呈上，那個 Class 必須實作 `execute(input): output` method，吃進 Input 吐出 Output。
5. 使用這個 Application Service 的客戶端只能  使用 `execute` ˊ 這個 method。

於是我們可以先定義一個 Generic Interface 給 Application Service：

```typescript
interface ApplicationService<Input, Output> {
  execute(input: Input): Promise<Output>;
}
```

接著依照 Generic Interface 建立一個 Application Service:

```typescript
// applicationService/order/registerMember.ts

interface RegisterMemberInput {
  name: string;
  email: string;
  password: string;
}

// 要傳出去的 Data Transfer Object
interface MemberDto {
  name: string;
  email: string;
}

interface RegisterMemberOutput {
  success: boolean;
  member?: MemberDto;
  errorMessage?: string;
}

class RegisterMember
  implements ApplicationService<RegisterMemberInput, RegisterMemberOutput> {
  private memberRepo: MemberRepository;
  constructor(memberRepo: MemberRepository) {
    this.memberRepo = memberRepo;
  }

  async execute(input: RegisterMemberInput): RegisterMemberOutput {
    try {
      // delegate business logic to domain model
      const [error: string|undefinedd, member: Member] = Member.registerMember(input);

      if (error) {
        // handle domain errors
        return {
          success: false,
          errorMessage: error,
          member: undefined
        }
      }

      await this.memberRepo.add(member);

      const dto = {
        name: member.name,
        email: member.email
      };

      return {
        success: true,
        member: dto,
        errorMessage: undefined
      };
    } catch (error) {
      return {
        success: false,
        member: undefined,
        errorMessage: 'Unexpected Error'
      }
    }
  }
}
```

由以上的程式碼可以觀察到，這段程式碼不涉及業務邏輯如檢查使用者名稱長度、密碼規則等等。另外，對於外部是要用 REST 還是 RPC ，Application Service 一概不管，只將他認為需要的資料往外傳，這樣一來，我們 Application Service 的重用性就大大提升，不管未來外部介面要用什麼技術實現，都不會影響內部的實作。

不過有人可能會問，若是已註冊為例，以上的程式碼缺少了「檢查使用者 Email 重複」的邏輯，那這一段應該放在 Application Service 嗎？如果不是，放在 Domain Model 又會違反內層不該使用外部技術的規定。

通常這種情形，我們會放在 Domain Service 之中，我會在後面的環節在介紹。

### DTO 模式的優與劣

在 Clean Architecture 篇時有提過，若是把

// TODO: Double Dispatch Pattern

註：其實這類架構不論是 Onion、Clean 還是 Port-Adapter Architecture 都沒有一個統稱的名字，實際使用起來也是很彈性，所以我就先以現代式分層式架構來統稱他們。若是這樣的命名有問題也請多指教。
