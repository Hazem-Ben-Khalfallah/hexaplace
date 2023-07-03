import { ArgumentInvalidException } from '@exceptions';
import { DomainPrimitive } from '@libs/ddd/domain/base-classes/value-object.base';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { ulid } from 'ulid';

export class ULID extends ID {
  private static readonly ID_SIZE = 26;

  /**
   * Returns new ID instance with randomly generated ID value
   * @static
   * @return {*}  {ID}
   * @memberof ID
   */
  static generate(generationDate: DateVO): ULID {
    return new ULID(ulid(generationDate.value.getTime()));
  }

  validate({ value }: DomainPrimitive<string>): void {
    ULID.validate(value);
  }

  static validate(value: string, argumentInvalidError?: ArgumentInvalidException): void {
    const format = /^[A-Z0-9_]*$/;
    if (
      typeof value !== 'string' ||
      value.length < ULID.ID_SIZE ||
      value[0] > '7' ||
      !format.test(value)
    ) {
      throw argumentInvalidError || new ArgumentInvalidException('Incorrect ULID format');
    }
  }

  public static toULID(id: string, argumentInvalidError: ArgumentInvalidException): ULID {
    try {
      return new ULID(id);
    } catch (error) {
      throw argumentInvalidError;
    }
  }
}
