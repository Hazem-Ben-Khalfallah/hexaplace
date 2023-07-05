import { NotFoundException } from '@src/libs/exceptions';

export class ProductNotFoundError extends NotFoundException {
  static readonly msg = 'PRODUCT.NOT_FOUND';

  constructor(metadata?: unknown) {
    super(ProductNotFoundError.msg, metadata);
  }
}
