import { QueryHandlerBase } from '@libs/ddd/domain/base-classes/query-handler.base';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductReadRepositoryPort } from '@modules/catalog/ports/product.repository.port';
import { GetProductQuery } from '@modules/catalog/queries/get-product/get-product.query';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler extends QueryHandlerBase {
  constructor(
    @Inject('ProductReadRepositoryPort')
    private readonly productRepo: ProductReadRepositoryPort,
  ) {
    super();
  }

  /* Since this is a simple query with no additional business
     logic involved, it bypasses application's core completely
     and retrieves products directly from a repository.
   */
  async handle(query: GetProductQuery): Promise<Result<ProductEntity>> {
    const product = await this.productRepo.findOneByIdOrThrow(new UUID(query.id));
    return Result.ok(product);
  }
}
