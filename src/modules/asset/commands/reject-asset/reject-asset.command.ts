import { CommandProps } from '@src/libs/ddd/domain/base-classes/command-props.base';
import { Command } from '@src/libs/ddd/domain/base-classes/command.base';

export class RejectAssetCommand extends Command {
  readonly assetId: string;

  readonly reason: string;

  constructor(props: CommandProps<RejectAssetCommand>) {
    super(props);
    this.assetId = props.assetId;
    this.reason = props.reason;
  }
}
