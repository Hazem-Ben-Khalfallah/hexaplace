import { CommandProps } from '@src/libs/ddd/domain/base-classes/command-props.base';
import { Command } from '@src/libs/ddd/domain/base-classes/command.base';

export class ApproveProductCommand extends Command {
  readonly productId: string;

  constructor(props: CommandProps<ApproveProductCommand>) {
    super(props);
    this.productId = props.productId;
  }
}
