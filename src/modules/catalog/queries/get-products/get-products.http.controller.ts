import { Result } from '@libs/ddd/domain/utils/result.util';
import { routesV1 } from '@modules/catalog/catalog.routes';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { GetProductsQuery } from '@modules/catalog/queries/get-products/get-products.query';
import { GetProductsHttpRequest } from '@modules/catalog/queries/get-products/get-products.request.dto';
import { ProductHttpResponse } from '@modules/catalog/queries/get-products/get-products.response.dto';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Product')
@ApiBearerAuth('jwt-token')
@Controller(routesV1.version)
export class GetProductsHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(routesV1.product.root)
  @ApiOperation({ summary: 'List products' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductHttpResponse,
  })
  async getProducts(
    @Query() request: GetProductsHttpRequest,
  ): Promise<ProductHttpResponse[]> {
    const query = new GetProductsQuery(request);
    const result: Result<ProductEntity[]> = await this.queryBus.execute(query);

    /* Returning Response classes which are responsible
       for whitelisting data that is sent to the product */
    return result.unwrap().map((product) => new ProductHttpResponse(product));
  }
}
