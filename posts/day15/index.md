# DDD 戰術設計：Value Object 概念與實作

![](https://images.unsplash.com/photo-1549461520-fb80f766c147?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1190&q=80)

前一篇提到，Entity 就像是我們故事中的主角，接著，我們來介紹配角：Value Object。學 DDD 時，當你一學會 Entity，你就會把所有東西都當作 Entity。但當你了解 Value Object 後，你就會開始覺得萬物皆 Value Object，甚至悔恨怎麼這麼晚才認識他。

另外，Value Object 的概念也非常適合用於 Functional Programming 中。甚至，我們應該盡量使用 Value Object 而非 Entity。

## 認識 Value Object

與 Entity 相反，當一個物件**沒有概念上的標識 (conceptual identity)**，**而你只關心它的屬性時**，這個物件就可以建立成 Value Object。所以值物件可以是 `3`, `1.5`, `"1234"`, `Date(2019-10-1)`、姓名、貨幣、地址，甚至是更複雜的物件等等。不過在實作上，我們會會特別指稱那些被包成物件的稱作 Value Object。

最常見的例子就是設計金錢的類別，你會使用一個包含有「元」+ 「幣值」的 Value Object 來表達金錢的概念，而非將兩個屬性散落在兩處，因為只有「元」的話，你不知道是美金還是台幣，而只有「幣值」也會有同意的疑慮。

此外，Value Object 的屬性都是為了要**描述某一個事物的特徵**。比如以上面的金錢做舉例，你在乎的是這些錢「描述」了你的資產總額，而不在乎錢是的流水編號、幾年印刷製成等等。

> 我們只關心 Value Objects 是什麼 (what)，而不關心他們是誰。

讓我們來更深入認識 Value Objects 的幾項特徵，分別有**描述性**、**不變性**、**概念整體性**、**替換性**、**相等性**、**無副作用**。

### 特徵 1: 它度量或描述了領域中的某項概念

一間房子有戶籍地址作為標示，所以在系統中你把它當作一個 Entity，但房子擁有屋齡、顏色，這些東西並不是實際的東西，而是對房子本身的度量。屋齡描述了這間房子建成後到現在的時間，而顏色是對於他外觀的描述。

而這個度量的特性會在下一個特徵中更加明顯。

註：度量是指對於一個物體或是事件的某個性質給予一個數字。

### 特徵 2: 不變性 (Immutability)

**一個 Value Object 在創建後就不能再改變了**，不過作為某個物件上的描述性屬性，**他可以被替換掉**。繼續用房子做例子，一間房子作為 Entity，他的屬性「顏色」這個 Value Object 可以被替換掉，如從「藍色的」房子變成「紅色的」房子，但你不會說「藍色」變成了「紅色」。

實作上，我們會用 `house.color = new Color('Red')` 來代替 `house.color.set('Red')` 的作法。如果你覺得這個例子過於簡單，
所以帶來的效益不大，那就讓我們看看下一個特徵：概念整體性。

### 特徵 3: 將相關屬性組成一個「概念整體 (Conceptual Whole)」

先解釋什麼叫做「概念整體 (Conceptual Whole)」，這就像前面提到的金錢的例子，你必須要將相關的概念整合起來，才能**完整且正確地**描述一件事情。

想想看，當你今天要去銀行換匯時，你想拿 300 台幣換 10 美金。這時候你有可能遇到：

1. 行員拿一支簽字筆在你的台幣上寫「變成 10 美金」
2. 行員會收下你的 300 台幣，然後直接拿出 10 美金**替換**給你。

如果你覺得第一種可能性很好笑，那你可以想想很多程式都是這樣寫的。一旦你不顧概念整體性、直接修改內部狀態，你就會難以保證業務正確性。所以當你看到這個設計：

```typescript
class Product {
  name: string;
  amount: number;
  currency: string;
}
```

應該將相關的概念 `amount` 與 `currency` 合成一個 Value Object 如下：

```typescript
class Product {
  name: string;
  money: Money;
}
class Money {
  amount: number;
  currency: string;
}
```

註：這邊為追求簡便，故將金額的 `amount` 用 JS 的 `number` type 表示，但實際應用上使用 `number` 在小數點部分並不夠精確，用 `decimal` 相關的 type 會更準確。

### 特徵 4: 當度量與描述改變時，可以用另一個 Value Object 替換

Value Object 的可替代性前面已經稍微提到。為了顧及不變性與概念整體性，當 Value Object 被改變時，我們**會重新賦值給它**。就像是你要把變數 `num` 從 3 改成 4 時，你會直接 `num = 4` 一樣。

假如說今天我要修改商品的金額從美金 100 變成美金 200，那我的程式碼會像這樣：

```typescript
class Product {
  name: string;
  money: Money;

  constructor(name, money) {
    this.name = name;
    this.money = money;
  }
  changePrice(money: Money): void {
    this.money = money;
  }
}

const p = new Product('A', new Money(100, 'USD'));
p.changePrice(new Money(200, 'USD'));
```

### 特徵 5: 相等性

既然 Value Object 沒有身份標識的概念，那麼只要兩個 Value Object 身上的屬性的值都相等，那我們就會說這兩個 Value Object 是相等的。這就好像「藍色的」房子與「藍色的」氣球雖然是不同的東西，但兩個身上的屬性「藍色」是相同的描述特徵。

這個優勢結合上面的不變性，如果剛好這個 Value Object 是用來描述一件「唯一」性的屬性時，剛好就與 Entity ID 的需求不謀而合了！因此很多人會把 Entity ID 建模成 Value Object。後面我們會講到怎麼做到這一點。

### 特徵 6: 無副作用

加上這一點，Value Object 使用起來表達力好、容易建立、而且還很安全呢！我們都知道管理一個有狀態的物件可以造成多大的災難，當你不知道你的物件是被誰偷改狀態時，你會很難 Debug。

無副作用這個特徵讓 Value Object 不只是一個資料結構或是一個屬性的容器，而增加很多領域知識的表達能力。比如在你的領域知識中，你商品的幣值在設定後不可更改，僅可調升或調降金額，那程式碼會變這樣：

```typescript
class Product {
  name: string;
  money: Money;

  increasePriceAmount(val: number): void {
    this.money = money.add(m);
  }
  decreasePriceAmount(val: number): void {
    this.money = money.subtract(val);
  }
}

class Money {
  amount: number;
  currency: string;
  constructor(amount: number, currency: string) {
    if (amount < 0) {
      throw new Error('Money amount should be positive');
    }
    if (!isCurrencyValid(currency)) {
      throw new Error('Money currency should be valid');
    }
    this.amount = amount;
    this.currency = currency;
  }

  add(val: number): void {
    // 回傳新物件!
    return new Money(amount + val, this.currency);
  }
  sub(val: number): void {
    if (val > this.amount) {
      throw new Error('Money amount cannot be subtract to negative');
    }
    // 回傳新物件!
    return new Money(amount - val, this.currency);
  }
}

const p = new Product('A', new Money(100, 'USD'));
p.increasePriceAmount(100); // p.money: { amount: 200, currency: 'USD' }
p.decreasePriceAmount(50); // p.money: { amount: 50, currency: 'USD' }
p.decreasePriceAmount(100000); // throw Error...
```

可以觀察到，Value Object **可以擁有行為，但每次都要回傳一個新的物件。**如此一來，可以透過重用 constructor 或其他 function 來驗證新的回傳 Value Object 是正確的！

## 實作 Value Object

讓我們取出以上特徵中的不變性、相等性，我們可以建立出一個 Value Object 的 Base Class:

```typescript
interface LiteralObject {
  [index: string]: unknown;
}

abstract class ValueObject<Props extends {}> {
  // 重點 1: Readonly，外面不能擅改資料
  props: Readonly<Props>;

  constructor(props: Props) {
    // 重點 2: Object.freeze 確保連 Object 屬性裡的資料也不能更動
    this.props = Object.freeze(props);
  }

  /**
   * Check equality by shallow equals of properties.
   * It can be override.
   */
  equals(obj?: ValueObject<Props>): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }
    if (obj.props === undefined) {
      return false;
    }
    const shallowObjectEqual = (
      props1: LiteralObject,
      props2: LiteralObject
    ) => {
      const keys1 = Object.keys(props2);
      const keys2 = Object.keys(props1);

      if (keys1.length !== keys2.length) {
        return false;
      }
      return keys1.every(
        key => props2.hasOwnProperty(key) && props2[key] === props1[key]
      );
    };
    // 重點 3: 針對屬性做比較，如果全部相等就回傳 true
    return shallowObjectEqual(this.props, obj.props);
  }
}
```

### 使用 Value Object 作為 Entity ID

回到 Entity，當時我們使用一個 Generic Type 作為 ID 的型別，在這裡我們可以套用 Value Object 的概念作轉換，然後應用回 Entity。

```typescript
// EntityId
import { ValueObject } from './ValueObject';
interface EntityIdProps<Value> {
  value: Value;
  occuredDate: Date;
}
export abstract class EntityId<Value> extends ValueObject<
  EntityIdProps<Value>
> {
  constructor(value: Value) {
    super({ value, occuredDate: new Date() });
  }

  get occuredDate(): Date {
    return this.props.occuredDate;
  }
  get value(): Value {
    return this.props.value;
  }

  toString(): string {
    const constructorName = this.constructor.name;
    return `${constructorName}(${String(
      this.props.value
    )})-${this.occuredDate.toISOString()}`;
  }

  toValue(): Value {
    return this.props.value;
  }

  equals(entityId: EntityId<Value>): boolean {
    if (entityId === null || entityId === undefined) {
      return false;
    }
    if (!(entityId instanceof this.constructor)) {
      return false;
    }
    return entityId.value === this.value;
  }
}

// Back to Entity
abstract class Entity<Id extends EntityId<unknown>, Props> {
  ...
}
```

在 DDD 中，並沒有限制說， Entity ID 一定要用 Value Object 的形式呈現，不過我們會在後面的章節闡明這樣做可以帶來的好處。

### Value Object 持久化

講到持久化的議題時，需要先釐清一件事情：**領域層的物件與資料庫的物件是不同的東西**，對於一些常用 ORM 框架的人來說，最直接的作法就是把透過 ORM 拿出的資料庫物件直接作為領域物件來使用。這是十分危險的行為，因為當你把這兩個概念綁在一起，你就很難擴展你的業務能力。

因此，當你在設計你的 Entity 或 Value Object 時，**資料庫的考量是次要的**。DDD 是根據業務能力與商業邏輯來設計領域物件，再接著設計資料庫的模型，而非反向過來。

所以一個 Entity 在資料庫的表中通常會有一個欄位放 ID，但 Value Object 的資料表**不一定不能有 ID**，這部分要看資料庫存取與搜尋的方便度做設計。

為了要翻譯兩個概念，通常我們會實作 Mapper Pattern 作為翻譯層，將兩者翻譯過後才轉過去。

不過 Value Object 的概念的確可能讓資料庫的設計與管理更加複雜了一些，之後將介紹 Aggregate 的概念，將管理相關連的 Entity 與 Value Object 的資料存儲有更多的規則。

### 如何分辨 Value Object 與 Entity

在做 DDD 設計時，我們會偏好 Value Object 更勝 Entity。而判斷這兩者的標準就在於**系統在不在乎這個物件的生命週期變化**，並非在於有無 ID 或相關的識別欄位。甚至，同一個概念物件在不同的 Bounded Context 中，也可能被分別建成 Entity 與 Value Object。

在兩個有上下游關係的 Bounded Context 間，如果有一個概念從上游留到下游時，盡量使用 Value Object 來表示這個概念。比如今天有兩個系統：管理會員的身份與權限管理系統 (IAM) 與消費相關的購買系統 (Purchasing) 。今天消費者要下單，會先從 IAM 取得會員資料與權限，然後回傳給 Purchasing 去產生訂單。

通常在 Purchasing 會把進來的會員作為 Entity 來操作，但以 DDD 角度來說，把進來的會員作為 Value Object 會更好。

一開始覺得很奇怪，如果會員要下訂單，那會員勢必要是一個 Entity 吧 ? 但仔細想想，在 Purchasing 中如果不會修改到會員資料，那在沒有狀態變更的情況下， Purchasing 中的會員確實是 Value Object 無誤。而且如此一來 Value Object 也減少了我們需要維護潛在狀態變更的複雜度。

讓我們用兩張來自 PPPoDDD 的圖片來做整理與比較：

Entity: ![https://ithelp.ithome.com.tw/upload/images/20191001/20111997OQMIOfb65E.jpg](https://ithelp.ithome.com.tw/upload/images/20191001/20111997OQMIOfb65E.jpg)

Value Object: ![https://ithelp.ithome.com.tw/upload/images/20191001/201119972ZPL9EhJfA.jpg](https://ithelp.ithome.com.tw/upload/images/20191001/201119972ZPL9EhJfA.jpg)

Entity 除了擁有一個 ID 以外，還可以包含多個 Value Object 或 Entity；而 Value Object 同時也可以擁有 Value Object 與 Entity (勁量避免)。

## Summary

今天介紹了 Value Object 的六項特徵：**描述性**、**不變性**、**概念整體性**、**替換性**、**相等性**、**無副作用**。讀者不妨找一些身邊的事物舉例子，會更好理解 Value Object 的含義。

同時，Value Object 的多項好處讓他非常適合作為不同 Bounded Context 或系統間溝通的形式來降低複雜度。不過需要注意，不要一不小心把所有東西都當作 Value Object 使用而忘記了 Entity 的存在。

## Reference

- [cover photo](https://unsplash.com/photos/HgtVLFq9lQA)
- IDDD
- PPPoDDD
- DDD
- [Martin Fowler - ValueObject](https://martinfowler.com/bliki/ValueObject.html)
