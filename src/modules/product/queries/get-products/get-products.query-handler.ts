import { QueryHandlerBase } from '@libs/ddd/domain/base-classes/query-handler.base';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { ProductEntity } from '@modules/product/domain/entities/product.entity';
import { ProductReadRepositoryPort } from '@modules/product/ports/product.repository.port';
import { GetProductsQuery } from '@modules/product/queries/get-products/get-products.query';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler extends QueryHandlerBase {

  constructor(
    @Inject('ProductReadRepositoryPort')
    private readonly productReadRepository: ProductReadRepositoryPort,
  ) {
    super();
  }

  /* Since this is a simple query with no additional business
     logic involved, it bypasses application's core completely
     and retrieves products directly from a repository.
   */
     async handle(query: GetProductsQuery): Promise<Result<ProductEntity[]>> {
      const products = await this.productReadRepository.findProducts(query);
      return Result.ok(products);
    }
}
