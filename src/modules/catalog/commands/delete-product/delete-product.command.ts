import { CommandProps } from '@src/libs/ddd/domain/base-classes/command-props.base';
import { Command } from '@src/libs/ddd/domain/base-classes/command.base';

// Command is a plain object with properties
export class DeleteProductCommand extends Command {
  readonly id: string;

  constructor(props: CommandProps<DeleteProductCommand>) {
    super(props);
    this.id = props.id;
  }
}
