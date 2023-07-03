import { CommandProps } from '@src/libs/ddd/domain/base-classes/command-props.base';
import { Command } from '@src/libs/ddd/domain/base-classes/command.base';

export class ApproveAssetCommand extends Command {
  readonly assetId: string;

  constructor(props: CommandProps<ApproveAssetCommand>) {
    super(props);
    this.assetId = props.assetId;
  }
}
