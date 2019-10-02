# DDD 戰術設計： Entity 概念與實作

![](https://images.unsplash.com/photo-1567826722186-9ecdf689f122?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)

## Entity 給我定義定義

當我們與領域專家訪談需求時，總會有一些物件或概念常常出現，且需要有標誌來辨明其唯一性，如顧客、訂單、商品等等。這些物件不被他們的屬性所辨識(比如年齡、金額、類別)，而是由一個專屬的身份標誌 (Identity)來辨識。

這種時候，我們就需要 Entity 的幫助讓我們在不同的物件中找到我們要的那一個。Entity 最大的特徵就是有 Identity 的概念，所以常會搭配一個擁有唯一值的 ID 欄位。但這邊要澄清一個誤解，**不是有 ID 就是 Entity，重點是你在不在乎他生命週期的變化。**

讓我們看一下 Eric Evans 對於 Entity 的敘述：

> An Entity is an object defined not by its attributes, but a thread of continuity and identity, which spans the life of a system and can extend beyond it.  
> `Entity` 是一個不是由屬性所定義的物件。它表示了一條有連續性的身份標示線，這條線橫跨了系統的生命週期甚至更長。

這句話告訴我們，當一個物件的生命期開始被你追蹤時，你就需要為它建立身份標誌 (identity)，而這個物件我們就稱為 Entity。

舉一個例子，銀行帳戶就是一個明顯的代表，使用者需要追蹤銀行帳戶各種狀態 (餘額、互動紀錄)的變化，所以每一個帳戶都必須要有自己獨特的 ID 或是相關的代號來表達唯一性，才不會跟系統中其他的銀行帳戶搞混。

註：這裡的 Entity 是一個物件，或者說是一個 Class，跟 Clean Architecture 中的 Entity Layer 是不同的概念。

### Entity 的特徵

我們總結一下 Entity 的特徵：

1. Entity 最重要的是他的 ID。
2. 兩個 Entity 不論其他狀態，只要 ID 相同就是相同的物件。
3. 除了 ID，他們其他的狀態是可變的 (mutable)。
4. 他們可能擁有很長的壽命，甚至不會被刪除。
5. 一個 Entity 是可變的、長壽的，所以通常會有複雜的生命週期變化，如一套 CRUD 的操作。

在系統中，越多的 Entity 代表系統的變化越多、複雜性越高，所以除非必要，不然會盡量減少 Entity 的使用。因此要注意，即使一個概念「聽起來像是」一個 Entity，仍需要**視使用情況**來辨認他的資格，

以體育比賽的位子做舉例，如果今天賣的是對號座，那你的位子因為要追蹤使用狀況且每一個位子的標示 (幾排第幾個)，所以會成為 Entity。但如果今天賣的只是位子數量，拿到票就可入場，那這樣的位子可能就不會設定在 Entity。

### Typescript 程式碼來實作

實作上，我們會建立一個 abstract class 並且宣告 `Id` 與 `Props` 作為 Generic Types 讓繼承者靈活選擇自己要的型別。

```typescript
abstract class Entity<Id, Props> {
  readonly id: Id;
  protected props: Props;

  protected constructor(id: Id, props: Props) {
    this.id = id;
    this.props = props;
  }

  public abstract equals(obj?: Entity<Id, Props>): boolean;
}
```

- 使用 `props` 可以減少 constructor 賦值的麻煩，並且讓外界無法直接存取物件的屬性。
- `equals` 裡可以自定義相等的定義，通常是做 ID 的相等判斷。

對於其他語言如 C#、JAVA 來說，常見的做法是僅宣告 ID 作為 Generic Type，而如果是走 Functional Programming 形式的，為了追求不變性，可能就只定義一個基本的資料結構，然後靠其他 function 去操作，或是使用下一篇將介紹的 Value Object 模式。

## 如何產出 Entity Id

既然 Entity 最重要的屬性就是他的 ID，那我們就來探討一下生產 ID 的機制吧！

### 來自用戶的輸入

這是一個非常直接的做法，比如使用用戶的 email 或是身分證字號等等作為 ID，但也容易造成額外的成本。最大的成本就在於，你需要由用戶負責產生符合需求的身份認證資料非常困難。此時**的 ID 可能是唯一的，但卻有可能是不正確的**。

甚至，身分證字號也有[重複](http://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040040041003400-1060718)的可能性。

因此，我們可以將用戶輸入的資料作為 Entity 的屬性。這些屬性可以用來做搜尋用，但大多時候並不適合作為 Entity 的 ID。

### 使用持久化機制來產生

最常見的就是使用資料庫自動生成 ID，最常見的就是 SQL 對 ID 下 `AUTO_INCREMENT` 讓 ID 的值自動遞增。又或者也可以向資料庫索取一個 UUID (或 GUID) 作為 ID 的值。

這樣的做法好處是可以減少程式的複雜性，直接把產生的工作交給持久化機制處理。但也容易招致效能問題的疑慮(UUID/GUID 的產生)。而且當你無法從程式碼找出 ID 的生產機制時，也會增加程式碼的隱含性不利於閱讀。

另外，使用持久化機制時，也需要特別考量這個 ID 的生成應該要在該物件持久化 (ie 存入資料庫) 之前或是之後，以配合程式的需求。

註：這裡會使用「持久化」一詞是因為儲存資料的方式不止資料庫一種，故用更通稱的方式描述。

### 在程式中產生

在程式中產生 ID 是最常見的方法之一，這種方法好處是可以更容易掌握生產的時機，此外，更可以客製化你的 ID 格式，比如一筆訂單你可以用 `order-20190930-c764e787-8182` 作為 ID，如此一來，在 debug 時就不用被一堆天文數字般的 ID 搞得昏頭脹腦。所以以個人經驗來說，即使增加了一點複雜度，但我會最推薦這個方式。

當然，對於一些效能要求更高的情境，如果你對於 UUID 產生的效能不夠滿意，也可以事先產生好 ID 後快取起來，

至於該在程式中的何處產生？在 DDD 設計模式中，如果你的 Entity 剛好是 Aggregate Root (聚合跟，之後會詳談)時，其實很適合放在 Repository 中產生。就像下面的程式碼一樣（可以直接跳到 Application Service 層)

```typescript
// -------- Domain Layer ------------
// domain/model/person/index.ts
interface PersonProps {
  name: string;
}
class Person extends Entity<string, PersonProps> {
  constructor(id: string, props: PersonProps) {
    super(id, props);
  }

  changeName(name: string) {
    // ...
  }

  static createPerson(parmas: { id: string; name: string }): [string, Person] {
    // 名字長度不能小於 2
    if (name.length < '2') {
      return ['Name length should be less than 2'];
    }
    return [undefined, new Person(params.id, { name: params.name })];
  }

  public equals(obj?: Entity<string, PersonProps>): boolean {
    if (obj == null || obj === undefined) {
      return false;
    }

    const isEntity = (v: unknown): v is Entity<string, PersonProps> => {
      return v instanceof Person;
    };
    if (!isEntity(obj)) {
      return false;
    }
    return this.id === obj.id;
  }
}

// domain/model/person/PersonRepository.ts
interface PersonRepository {
  nextId(): string;
  fromId(id: string): Person;
  save(person: Person): void;
}

// -------- Application Service Layer ------------
// application/person/AddPerson.ts
class AddPerson {
  private personRepo: PersonRepository;
  constructor(personRepo: PersonRepository) {
    this.personRepo = personRepo;
  }
  execute(input: { name: string }) {
    const id = this.personRepo.nextId();
    const [err, person] = Person.create({ id, name: input.name });
    if (err) {
      // error handling
    }

    // 成功產生後，就存入持久化機制
    this.personRepo.save(person);

    // 回傳資料處理
    ...
  }
}

// -------- Infrastructure Layer ------------
// infrastructure/repository/person/SqlPersonRepository.ts
class SqlPersonRepository implements PersonRepository {
  // implementation details
}
```

### 由另一個 Bounded Context 提供

最後一種，也是最複雜的一種就是來自於另一個 Bounded Context 提供的 ID。這種可能出現在當你需要調用 API 的時候，得到對方的資料後存取下來。這種方式的複雜點在於，你不只要考慮本地端的 Entity，也需要考慮外部 Bounded Context 的改變情況，雖然可以透過訂閱另一個 Bounded Context 的方式做到，但仍舊十分麻煩。

所以通常與外部 Bounded Context 調用 API 時，都會更傾向使用下一篇會提到的 Value Object 做物件的傳遞。

## 設計一個 Entity

有了 Entity ID 產生的機制，我們來聊聊如何設計一個 Entity。

設計一個 Entity 可以透過以下步驟：

1. 找出關鍵資料。將一些能用於搜尋的屬性留在身上，其他可以考慮設計 Value Object。
2. 找出或設計出 Entity 的 ID
3. 找出關鍵行為與對應的業務規則，然後照著 Ubiquitous Language 命名後使用。

比如我要有一個 `User` class，他主要有名字與地址兩項屬性，且都可以更改。但有一個前提，在改名字時，他需要是「有效」的狀態(非停權戶)。
另外，名字最短不能少於兩個字，而地址需要包含城市、鎮、路、詳細資料四個欄位。

```typescript
interface AddressProps {
  city: string;
  county: string;
  street: string;
  detail: string;
}
class Address extends ValueObject<AddressProps> {}

interface UserProps {
  name: string;
  active: boolean;
  address: Address;
}

class User extends Entity<string, UserProps> {
  changeName(name: string): void {
    // 名字長度不能小於 2
    if (name.length < '2') {
      // error handling
    } else {
      this.props.name = name;
    }
  }
  changeAddress(address: Address): void {
    this.address = this.address.update(address);
  }

  static createUser(parmas: {
    id: string;
    name: string;
    address: Address;
  }): [string, User] {
    // 名字長度不能小於 2
    if (name.length < '2') {
      return ['Name length should be less than 2'];
    }

    return [
      undefined,
      new User(params.id, {
        name: params.name,
        active: true,
        address: params.address
      })
    ];
  }

  public equals(obj?: Entity<string, UserProps>): boolean {
    // ...
  }
}
```

## Summary

Entity 可以說是我們系統模型中的主角，就像看連載漫畫時的主角一樣，我們會跟著劇情的發展追蹤主角的成長與變化。所以接下來我們就來介紹配角 Value Object，看看他可以如何襯托主角。甚至到最後你可能還會覺得沒有主角也沒有關係(?。

## Reference

- [cover photo](https://unsplash.com/photos/RDufjtg6JpQ)
- https://www.sitepoint.com/ddd-for-rails-developers-part-2-entities-and-values/
