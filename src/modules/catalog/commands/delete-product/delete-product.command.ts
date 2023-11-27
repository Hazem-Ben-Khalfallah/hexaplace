import { CommandProps } from '@src/libs/ddd/domain/base-classes/command-props.base';
import { Command } from '@src/libs/ddd/domain/base-classes/command.base';

export class DeleteProductCommand extends Command {
  readonly id: string;

  constructor(props: CommandProps<DeleteProductCommand>) {
    super(props);
    this.id = props.id;
  }
}
