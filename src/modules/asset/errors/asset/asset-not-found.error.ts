import { NotFoundException } from '@src/libs/exceptions';

export class AssetNotFoundError extends NotFoundException {
  static readonly msg = 'ASSET.NOT_FOUND';

  constructor(metadata?: unknown) {
    super(AssetNotFoundError.msg, metadata);
  }
}
