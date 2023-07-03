import { ArgumentInvalidException } from '@src/libs/exceptions';

export class AssetNameRequiredError extends ArgumentInvalidException {
  static readonly msg = 'ASSET.NAME_CAN_NOT_BE_EMPTY_ERROR';

  constructor(metadata?: unknown) {
    super(AssetNameRequiredError.msg, metadata);
  }
}
