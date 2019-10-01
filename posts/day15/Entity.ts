abstract class Entity<Id, Props> {
  readonly id: Id;
  protected props: Props;

  protected constructor(id: Id, props: Props) {
    this.id = id;
    this.props = props;
  }

  public abstract equals(obj?: Entity<Id, Props>): boolean;
}

interface PersonProps {
  name: string;
}

class Person extends Entity<string, PersonProps> {
  constructor(id: string, props: PersonProps) {
    super(id, props);
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

const p = new Person('1', { name: 'Bill' });
