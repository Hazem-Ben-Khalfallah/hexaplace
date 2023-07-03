import { ArgumentInvalidException } from '@src/libs/exceptions';

export class AssetIdInvalidError extends ArgumentInvalidException {
  static readonly msg = 'ASSET.ID_INVALID';

  constructor(metadata?: unknown) {
    super(AssetIdInvalidError.msg, metadata);
  }
}
