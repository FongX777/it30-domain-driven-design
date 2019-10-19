# DDD TypeScript 模板

今天終於到了最後一天！因為可以講得東西實在太多了，當初想進行的實作 Project 由於篇幅不夠而作罷，不過未來我會花時間再寫一個系列的實作文章（應該會接在這篇後面，大約 11 月中後陸續出來）。

今天就來用 TypeScript 來實作幾個模板來方便大家實作 DDD 戰術設計(做一些之前程式碼的總整理)

- Value Object
- Entity/EntityId
- Domain Event
- Aggregate Root

然後既然用了 TypeScript，以下範例我會避免使用 `any` 使 TypeScript 發揮他的型別檢查！

## Value Object

```typescript
interface LiteralObject {
  [index: string]: unknown;
}

export abstract class ValueObject<Props extends {}> {
  props: Readonly<Props>;

  constructor(props: Props) {
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
    return shallowObjectEqual(this.props, obj.props);
  }
}
```

## Entity

### Entity ID

```typescript
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
```

### Entity

```typescript
import { EntityId } from './EntityId';

export abstract class Entity<Id extends EntityId<unknown>, Props> {
  readonly id: Id;
  protected props: Props;

  protected constructor(id: Id, props: Props) {
    this.id = id;
    this.props = props;
  }

  equals(obj?: Entity<Id, Props>): boolean {
    if (obj == null || obj === undefined) {
      return false;
    }

    const isEntity = (v: unknown): v is Entity<Id, Props> => {
      return v instanceof Entity;
    };
    if (!isEntity(obj)) {
      return false;
    }

    return this.id.equals(obj.id);
  }
}
```

## Domain Event

```typescript
export abstract class DomainEvent {
  readonly occuredOn: Date;
  constructor() {
    this.occuredOn = new Date();
  }
}
```

## Aggregate Root

```typescript
import { Entity } from './Entity';
import { EntityId } from './EntityId';
import { DomainEvent } from './event/DomainEvent';

export abstract class AggregateRoot<
  Id extends EntityId<unknown>,
  Props
> extends Entity<Id, Props> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  protected addDomainEvents(domainEvents: DomainEvent[]): void {
    this._domainEvents.push(...domainEvents);
  }

  clearEvents(): void {
    this._domainEvents = [];
  }
}
```
