import { CommandProps } from '@libs/ddd/domain/base-classes/command-props.base';
import { Guard } from '@libs/ddd/domain/guard';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { ArgumentNotProvidedException } from '@libs/exceptions';

export class Command {
  /** ID for correlation purposes (for UnitOfWork, for commands that
   *  arrive from other microservices,logs correlation etc). */
  public readonly correlationId: string;

  constructor(props: CommandProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'Command props should not be empty',
      );
    }
    this.correlationId =
      props.correlationId || ULID.generate(DateVO.now()).value;
  }
}
