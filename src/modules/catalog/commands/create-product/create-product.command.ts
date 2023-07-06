import { CommandProps } from '@src/libs/ddd/domain/base-classes/command-props.base';
import { Command } from '@src/libs/ddd/domain/base-classes/command.base';

// Command is a plain object with properties
export class CreateProductCommand extends Command {
  readonly id?: string;

  readonly name: string;

  readonly description: string;

  constructor(props: CommandProps<CreateProductCommand>) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
  }
}
