# DDD 戰術設計：Application Service 3 - 結合 TDD/BDD (續)

今天來用一個案例來說明如何利用 TDD/BDD 來撰寫一個 Application Service。讓我們來看看如何實作一個簡單的註冊功能。

### 步驟 1. 蒐集 Specification By Examples

在寫程式之前，我們需要先跟我們的商業團隊進行需求溝通，必要時也可以請測試團隊的人來參加。一開始，商業團隊提出了註冊的幾個基本需求：

1. 使用者要提供名稱、電子郵件、密碼。
2. Email 不能重複。
3. 密碼至少要六個字。

但是需求都是破碎的知識細節，我們接著要求商業團隊提出實際的案例或是使用者故事，然後把這些資訊轉為 Gherkin 語法的規格書：

```cucumber
Feature: Register a new member
  As a web user,
  I want to register on the site to be a member
  so taht I can use the service provided by the site.

  The basic information of a member must contain an email address, a password and a name.

  Background:
    Given a web user is on the registration page

  Scenario: Register to be a new member
    Given the web user has input user information:
      | email         | password | name |
      | test@mail.com | 123456   | test |
    When the web user signed up
    Then a member should be created

  Scenario: User email must be uniqe
    Given an existing member with email 'test@mail.com'
    When the web user inputs email 'test@mmai.com'
    Then the web user should receive "Email Duplicated" error

  Scenario: User password length must be >= 6
    When the web user inputs password '12345'
    Then the web user should receive "Password Too Short" error
```

從以上的規格書可以清楚地看到每商業邏輯的需求，以及其前因與後果。接著我們可以來寫第一個測試：

註：測試方面，我使用的是 Jest 框架。

### 步驟 2. 撰寫 Application Service Test

在一個 DDD Bounded Context 模組中，會至少建立三層資料夾代表三層架構，分別是 `domain` 、 `application` (或是 `useCase`)、`infrastructure`。我們的第一個測試就寫在 `application` 這一層的 `member` 資料夾下，讓我們先從第一個 Happ Path 的案例開始寫起：

```typescript
// xxBoundedContext/application/member/RegisterMember.spec.ts
import {
  RegisterMemberUsecase,
  RegisterMemberInput,
  RegisterMemberOutput
} from '../index';
import { InMemeryMemberRepository } from '../../infrastructure/repository/member';

describe('Register a User', function() {
  it('should succeed', async function() {
    const name = 'test';
    const email = 'test@mail.com';
    const password = '123456';
    const encryptStub = (str: string): string => str;

    const input: RegisterMemberInput = {
      name,
      email,
      password
    };
    const repo = new InMemeryMemberRepository();
    const usecase = new RegisterMemberUsecase(repo, encryptStub);

    const output: RegisterMemberOutput = await usecase.execute(input, output);

    expect(output.id).not.toBeUndefined();
    expect(output.name).toBe(name);
    expect(output.email).toBe(email);
    expect(repo.member.length).toBe(1);
  });
});
```

當你寫完這個測試時，你會發現你的 IDE 會爬滿紅色底線警告你「這些東西都不存在啊」。不要擔心，讓我們繼續走下去。

### 步驟 3. 撰寫 Application Service

有了 Application Service 的測試後，照 TDD 的作法，接著我們來寫 Application Service 的程式碼。

```typescript
// xxBoundedContext/application/member/RegisterMember.ts
import { MemberRepository, Member } from '../../domain/member';

export class RegisterMemberUsecase {
  private memberRepo: MemberRepository;
  // 從外部傳進加密 function
  private encrypt: (data: string) => string;

  constructor(memberRepo: MemberRepository) {
    this.memberRepo = memberRepo;
    this.encrypt = encrypt;
  }

  async execute(input: RegisterMemberInput): Promise<RegisterMemberOutput> {
    const { name, email, password } = input;

    const hashedPassword: string = this.encrypt(password);

    const service = new MemberIdentityService(this._encrypt);
    const [error: string, member: Member] = Member.register({
      id: this.memberRepo.nextId(),
      name,
      email,
      hashedPassword: password
    });
    if (error) {
      const output: RegisterMemberOutput = {
        success: false,
        errorMessage: error;
      };
    }

    await this.memberRepo.save(member);

    const output: RegisterMemberOutput = {
      success: true,
      member: {
        id: member.id.toValue(),
        name: member.name,
        email: member.email
      }
    };
  }
}

export interface RegisterMemberInput {
  name: string;
  email: string;
  password: string;
}

interface MemberDto {
  id: string;
  name: string;
  email: string;
}

export interface RegisterMemberOutput {
  success: boolean;
  member?: MemberDto;
  errorMessage?: string;
}
```

撰寫完 Application Service 後，我們發現還缺少 `domain` 層的 model 以及 `InMemoryMemberRepository` 的實作。

### 步驟 4. 撰寫 Domain Model Test

來到 `domain` 資料夾下，第一件事還是一樣先建立測試：

```typescript
// xxBoundedContext/domain/member/model/Member.spec.ts
import { Member, MemberId } from './Member';
describe('Member register', () => {
  const defaultProps = {
    id: new Member('1'),
    name: 'test',
    email: 'test@mail.com',
    password: '123456'
  };
  it('should pass', () => {
    const props = {
      ...defaultProps
    };
    const [error, member] = Member.register(props);

    expect(error).toBeUndefined();
    expect(member.id.equals(props.id)).toBeTruthy();
    expect(member.name).toEqual(props.name);
    expect(member.email).toEqual(props.email);
    expect(member.password).toEqual(props.password);
  });
  it('should fail for password toot short', () => {
    const props = {
      ...defaultProps,
      // too short
      password: '00'
    };
    const [error, member] = Member.register(props);

    expect(member).toBeUndefined();
    expect(error).toEqual('Password should contain at least 6 letters');
  });
});
```

可以看到這段測試相對 Application Service 來說易懂許多。

### 步驟 4. 撰寫 Domain Model

於是我們接著進入 `domain` 資料夾，依據 Application Service 使用案例的需求建立我們的 Model 。

```typescript
export class MemberId extends EntityId<string> {}

interface MemberProps {
  id: MemberId;
  name: string;
  email: string;
  password: string;
}

export class Member extends Entity<MemberId, MemberProps> {
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }
  static register(props: MemberProps): [string, Member] {
    if (!passwordRule(props.password)) {
      // return domain error
      return ['Password should contain at least 6 letters'];
    }
    return [undefined, new Member(props)];
  }
}

function passwordRule(password: string): boolean {
  return password.length > 5;
}
```

可以從以上的程式碼注意到幾件與以前寫程式的習慣不同的地方：

1. 寫 Class 時不會追求一次到位。事實上 BDD 認為「當使用者真正需要時」再去寫程式碼，保留時間與精力放在最大價值上。
2. method 命名時採用遵守 Ubiquitous Language，如使用 `register` 而非 `create`。

寫到這邊，我們再跑一次 `domain` 層的測試。終於！我們有了第一個成功測試。

註：想知道 Enity Base Class 實作的請參考之前的[這篇](https://ithelp.ithome.com.tw/articles/10223150) 與[這篇](https://ithelp.ithome.com.tw/articles/10223595)

### 步驟 5. 撰寫 Repository interface

不過我們別忘了 `domain` 層還需要一個 Repository Interface。

```typescript
// xxBoundedContext/domain/model/member/MemberRepository.ts
import { Member, MemberId } from './MemberRepository';
interface MemberRepository {
  nextId(): MemberId;
  ofId(id: MemberId): Promise<Member | undefined>;
  save(member: Member): Promise<void>;
}
```

在 `domain` 層最後，我們用一個 `member/index.ts` 將這一層的 Model 包在一起方便外面引用：

```typescript
// xxBoundedContext/domain/model/member/index.ts
export * from './Member';
export * from './MemberRepository';
```

### 步驟 5. 撰寫測試用 Repository

離完成 Application Service 只差一個測試用 Repository。在前面 Repository 篇章有提到，可以使用內存實作的 Repository 來幫忙測試。

```typescript
import {
  Member,
  MemberId,
  MemberRepository
} from '../../../domain/model/member';
import newId from 'uuid/v4';
// xxBoundedContext/infrastructure/repository/member/InMemoryMemberRepository.ts
class InMemoryMemberRepository implements MemberRepository {
  members: { [index: MemberId]: Member } = {};

  nextId(): MemberId {
    return new MemberId(newId());
  }
  ofId(id: MemberId): Promise<Member | undefined> {
    // ...
  }
  save(member: Member): Promise<void> {
    this.members[member.id] = member;
  }
}
```

### 步驟 6. 回去跑 Application Service 測試

所有配料都到齊後，回去重跑一次你的 Application Service 測試，你會發現全都通過了！

有了一次成功的經驗，你可以用同樣的流程繼續添加測試驗證 Application Service 的行為，而且往後的程式由於有前面的鋪路，會更加好寫！
