import { CommandProps } from '@src/libs/ddd/domain/base-classes/command-props.base';
import { Command } from '@src/libs/ddd/domain/base-classes/command.base';

export class RejectProductCommand extends Command {
  readonly productId: string;

  readonly reason: string;

  constructor(props: CommandProps<RejectProductCommand>) {
    super(props);
    this.productId = props.productId;
    this.reason = props.reason;
  }
}
