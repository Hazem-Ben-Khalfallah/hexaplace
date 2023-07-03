import { ExceptionCodes } from '@libs/exceptions/exception.codes';
import { ExceptionBase } from '@src/libs/exceptions';

export class AlreadyDeletedAssetError extends ExceptionBase {
  static readonly msg = 'ASSET.ALREADY_DELETED_ASSET_ERROR';

  readonly code = ExceptionCodes.unprocessable;

  constructor(metadata?: unknown) {
    super(AlreadyDeletedAssetError.msg, metadata);
  }
}
