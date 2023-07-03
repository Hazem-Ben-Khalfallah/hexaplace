import { ArgumentInvalidException } from '@src/libs/exceptions';

export class AssetDescriptionRequiredError extends ArgumentInvalidException {
  static readonly msg = 'ASSET.DESCRIPTION_CAN_NOT_BE_EMPTY_ERROR';

  constructor(metadata?: unknown) {
    super(AssetDescriptionRequiredError.msg, metadata);
  }
}
