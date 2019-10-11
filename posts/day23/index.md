# BDD - 如何寫出好的 語法展示你的 Specification By Examples

使用實例化規格書的好處之一，就是可以讓開需求的人自己定義好後，讓開發人員可以直接作為驗收測試使用。不過到底怎麼樣的 才是好讀好測試的小黃瓜呢？今天來為各位介紹幾個原則，一起將 `Given`、`When`、`Then` 發揮到極致！

註：本篇 Specification By Examples 我統稱 SBE。
註：本篇 Example 我會翻成「實例」。

## 基本語法

產生 SBE 的流程大致上如下：

![https://ithelp.ithome.com.tw/upload/images/20191010/20111997qrWY76ryAu.jpg](https://ithelp.ithome.com.tw/upload/images/20191010/20111997qrWY76ryAu.jpg)
(source: BDD IN ACTION)

而我們要實作的就是圓圈鎖圈起來的那一段，我們通常會將一個 SBE 檔案稱為一個 feature 檔案，而一個使用 語法格式寫成的 feature 檔案至少需要以下幾個要素：

1. Title & Description 標題與敘述
2. Scenarios
   - Given
   - When
   - Then

至於語言方面，Cucumber 作為執行驗收測試的框架，支援多種語言版本的 ，如果想用中文可以參考下圖：

![https://ithelp.ithome.com.tw/upload/images/20191010/201119975hjI2IKFm0.png](https://ithelp.ithome.com.tw/upload/images/20191010/201119975hjI2IKFm0.png)

至於本篇，因為習慣之故，我仍沿用英文做關鍵字，但同時為了加速大家的理解，其餘部分就用中文來表達。因此一個簡單的 feature 檔案會像這樣呈現：

```
Feature: 訂單結案時獲得紅利點數 # Title
  身為一名銷售主管 # Description
  我想要讓顧客在訂單結案後獲得點數
  這樣就能提供誘因繼續再我們的商城消費

  Scenario: 普通等級客戶可以獲得 10 點
  Given 我是有一名普通等級客戶
  And 我有一筆待結案訂單
  When 我的訂單結案時
  Then 我應該獲得 10 點紅利點數

  Scenario: VIP 等級客戶可以獲得 20 點
  Given 我是有一名 VIP 等級客戶
  And 我有一筆待結案訂單
  When 我的訂單結案時
  Then 我應該獲得 20 點紅利點數

  ...
```

從上面的案例可觀察到，開頭的 `Feature` 關鍵字後要帶出本功能的重點，也就是**使用者或相關利益相關者如何執行這個功能**。若是你用「紅利點數管理」相對而言就比較模糊，無法了解使用者確切的活動行為。

接著，眼尖的朋友應該有發現，`Feature` 下面的敘述區塊就是一個使用者故事 (User Story)，遵照著 「As..., I want to ..., so that ...」的語法，清楚地表達出這個功能的前因後果。

當然，在敘述區塊部分並未限制你要用什麼語法，不過參考使用者故事的寫法是一個不錯的開始。另外你也可以自由的在其中新增一些需求與規格。

註： `#` 在 feature 檔案中是註釋的語法。

## Scenario 寫法

`Scenario` 後面都會接上一個標題。這個標題應該盡可能簡潔、精準且斷言式地表達這個實例的意圖。由於一個 Scenario 通常代表著一個業務規則，因此一份 feature 檔案可能需要多個 Scenario。在這種情況下，我們要簡單扼要的表達他的重點以及**特殊之處**。

所以與其寫 `Scenario: 一個普通等級的客戶在他其中一筆訂單結案的當下可以立即獲得 10 點的紅利點數以供未來使用`，用 `普通等級客戶可以獲得 10 點` 與 `VIP 等級客戶可以獲得 20 點` 更能凸顯該 Scenario 的意圖。

接著，一個 Scenario 至少會有三段結構：

1. `Given`: 前置條件，如背景知識或是起始狀態
2. `When`: 一個動作或是事件
3. `Then`: 預期的結果

組合起來就像這樣：

```
Given <一段背景>
When <某事發生>
Then <預期的結果>
```

這樣的結構清楚明瞭，讓人一眼就能看出這個實例的前因、執行與後果。不過請注意，**Scenario 之間應該要互相獨立**，前一個 Scenario 執行的結果不應該影響下一個。

## Given 寫法

在 `Given` 階段，你可以著手建立起始狀態，如建立測試資料、啟動瀏覽器並導向正確位置等等。此外，你也可以建構一些背景知識供閱讀者理解，即使並不需要在程式中做任何動作。

常見的 `Given` 有：

- 使用者目前狀態: `Given 我已經登入`
- 系統狀態: `Given 線上人數有 1000 人`
- 背景知識: `Given 台北到高雄有 360 公里`

除了使用文字以外，你也可以在 `Given` 裡面加入表格讓資料呈現更清楚。如下：

```
Given 系統有一名使用者資料如下:
  | email         | name   | age |
  | test@mail.com | test   | 20  |
```

## When 寫法

`When` 代表系統或是使用者執行的一個動作或發生的事件，導致之後要驗證的結果。可能是 UI 相關，也可能是系統自己發出的通知。不過不管是哪個，撰寫 `When` 的原則都很簡單: **描述「做什麼 (what to do) 」而非「怎麼做 (how to do)」**。

在 `When` 這一關很多人會把它當作使用者手冊來寫，用 `And` 洋洋灑灑串接一堆動作，比如網頁的細節操作、系統實作細節的步驟等等。但這些對於溝通與價值的實現並無太大的幫助。舉個例，當 `When` 步驟過於瑣碎時，不但內容與實作緊緊綁在一起，讓維護成本提高外，也不利於閱讀：

```
Scenario: 抽獎活動抽號碼牌
Given 我想要抽獎
When 我進入了抽獎頁面
And 我填了我的姓名在 '.name' 欄位
And 我填了我的聯絡電話在 '.phone' 欄位
And 我填了我的 Email 在 '.email' 欄位
And 我填了我的縣市在 '.city' 欄位
And 我填了我的詳細地址在 '.street' 欄位
And 我填了我的郵遞區號在 '.post_code' 欄位
And 我點擊了抽號碼牌的按鈕
Then 我應該得到了一個抽獎號碼牌
And 我應該得到一封 Email 通知包含號碼牌資訊
```

這種情況很常出現。此時你要問你自己，即使 UI 操作很重要，但 feature 檔案的**重點應該要在於商業流程而非介面操作流程**。因此我們可以改良成如下：

```
Scenario: 抽獎活動抽號碼牌
Given 我想要抽獎因此填了以下資訊：
  | name | email         | phone      | city   | street     | postcode | ... |
  | John | test@mail.com | 0912121212 | Taipei | Xinyi Road | 123      | ... |
When 我抽了號碼牌
Then 我應該得到了一個抽獎號碼牌
And 我應該得到一封 Email 通知包含號碼牌資訊
```

是否清晰許多？

## Then 寫法

承接著 `When` 的行為，`Then` 就是要來驗證隨後的行為是否符合要求，也是你加入 `assert` 的地方。在撰寫 `Then` 時有一個小訣竅，就是每一行都加上一個「應該 (should)」，這樣就能保證你的 `Then` 是要來驗證行為，而非又一個 `When` 來執行新的操作。

而驗證本身不只驗證有沒有操作正確，也可以操作錯誤後有沒有對應的錯誤產生：

```
Scenario: 考駕照須滿 18 歲
  Given 一個 17 歲的女生
  And 她已經輸入了她的身分證號碼
  When 她要報考駕照
  Then 系統應該要跳出錯誤:
  """
  未滿 18 歲不得考取駕照
  """
```

## And 與 But

不管是 `Given`、`When` 還是 `Then`，一行只能做一件事情，如果你發現某一行的責任超過一個了，那就直接截斷並在隔行開頭加上 `And` 關鍵字。而至於 `But` 關鍵字與 `And` 類似，只是在語意上與前一句比較有衝突，所以才會用 `But`。

對於 Gherkin 來說，不論是 `And` 或是 `But`，他只會看你上面承接的是哪個關鍵字 (`Given`、`When` 還是 `Then`)，他就會當作是該關鍵字的同義字。

以上就是最基礎的語法，至於想學習更多語法，可以到 [Cucumber 教學網站](https://cucumber.io/docs/gherkin/reference/) 學習。

### 設計原則 1 - 專注在有價值的行為

Spec By Examples 的重點不在於詳盡，而是把最關鍵的行為描述出來。

### 避免太多 UI 細節

第一名，把 SBE 歸格當作「使用者手冊」來寫。當你把繁瑣的步驟一項項寫上去時，這份規格書就越難被保存，因為任何 UI 的改變 (而且相信我絕對會)，你的規格書就要做出大量的改變。另外，或許這對前端很有用，但對於後端來說，這些 UI 步驟是無法測試的。此外，更不要把 UI 的外觀細節加進去，比如「跳出一個藍色按鈕」。

### 避免加入技術細節

SBE 的精神之一就是用自然易懂的語言讓跨團隊的人能夠無障礙地互相溝通。因此，技術人員也要避免加入過多的技術細節進去。畢竟，你使用 Postgres 或是 MySQL 或是發了幾個 Transaction 對於使用者來說並沒有太大的意義。

一個充滿技術細節的 feature 會長這樣：

```
Given 資料庫裡面有一筆購物者帳號
And 我用 HTTP 協議送出一個登入通知
And 瀏覽器存了登入的認證 session
And 我登入了
When ...
Then ...
```

但整段話其實只代表很簡單的註冊資訊，實在不必寫得如此複雜。

```
Given 我以購物者的身份登入了
When ...
Then ...
```

### 避免加入過多資料細節

與上一個原則類似，規格書中的資料固然重要，我們要紀錄的主角是「行為」。我們不是要把所有 Class constructor 的資料都填進去，這不但不實際(可能會太多)，而且容易因為需求變更而難以修改。

一個例子如下：

```

Given 我想要申請線上銀行的會員填了以下資料：
  | first-name | surname | last-name | email         | country | street     | postcode | birthday   | ...other 10 items |
  | Elsa       | B       | Chen      | test@mail.com | U.S.A   | xxx street | 231      | 2019.10.01 | ...               |
When 我送出申請
Then 我應該要進入等待清單
And 我應該要收到一封通知信
And ...
And ...
And ...
And ...
```

如果你覺得以上這些資料並非你關注的重點，你想要測試的是整體的行為邏輯，那你可以將資料的敘述拿掉，專心在行為上。如此一來，也能更快理解核心功能，以利溝通。

```
Given 我想要申請線上銀行的會員填了資料
When 我送出申請
Then 我應該要進入等待清單
And 我應該要收到一封通知信
And ...
And ...
And ...
And ...
```

## 設計原則 2 - 沙漏原則：When 最小化

當你寫好你的初版 SBE 後，第一個可以改良的地方就是檢查你的 `When` 的大小，越小越好，甚至一行最好。SBE 的目的不是要寫一份使用手冊，而每一個 Scenario 的目的其實僅僅只是表達一個(或少數幾個)業務規則罷了。

那那些步驟該放哪裡呢？有一個建議，你可以都先試著放到 Given 裡面，從「`When` 我做了什麼」，變成「`Given` 我已經做了什麼」，然後只把最關鍵的觸發點如送出放進你的 `When` 裡面。

`What` 應該揭露的是你要「做什麼」而非「怎麼做」

### 設計原則 3 - 將共同 Given 抽成 Background

當你發現你的 Scenario 數量逐漸增長，而其中有一些 `Given` 敘述一直重複，你就可以考慮引入 `Background` 關鍵字。我們先來看一個沒有 `Background` 的 feature 檔案:

```
Feature: 建立新貼文
  ...

  Scenario: 成功建立貼文
    Given 我已經登入
    And 我輸入了所有必須的資料
    When 我建立貼文
    Then 我的貼文應該要被建立

  Scenario: 貼文需要標題才能建立
    Given 我已經登入
    And 我並沒有被水桶
    And 我輸入了所有必須的資料除了標題
    When 我建立貼文
    Then 我的貼文不該被建立
    And 出現錯誤訊息 "Title Required"
```

雖然每一篇 Scenario 都很清楚，但重複的部分可以利用 `Background` 消除：

```
Feature: 建立新貼文
  ...

  Background:
    Given 我已經登入
    And 我並沒有被水桶

  Scenario: 成功建立貼文
    Given 我輸入了所有必須的資料
    When 我建立貼文
    Then 我的貼文應該要被建立

  Scenario: 貼文需要標題才能建立
    Given 我輸入了所有必須的資料除了標題
    When 我建立貼文
    Then 我的貼文不該被建立
    And 出現錯誤訊息 "Title Required"
```

## 其他建議

1. 不要多餘的標點符號
2. 盡量使用真實世界資料

### Reference

- [what's in a story](https://dannorth.net/whats-in-a-story/)
