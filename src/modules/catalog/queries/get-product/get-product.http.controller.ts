import { Result } from '@libs/ddd/domain/utils/result.util';
import { routesV1 } from '@modules/catalog/product.routes';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { GetProductQuery } from '@modules/catalog/queries/get-product/get-product.query';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductHttpResponse } from '@modules/catalog/queries/get-product/product.response.dto';

@ApiTags('Product')
@ApiBearerAuth('jwt-token')
@Controller(routesV1.version)
export class GetProductHttpController {
  constructor(private readonly queryBys: QueryBus) {}

  @Get(routesV1.product.resourceById)
  @ApiOperation({ summary: 'get product by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductHttpResponse,
  })
  async getProductById(@Param('id') id: string): Promise<ProductHttpResponse> {
    const query = new GetProductQuery({ id });
    const result: Result<ProductEntity> = await this.queryBys.execute(query);

    /* Returning Response classes which are responsible
       for whitelisting data that is sent to the product */
    return new ProductHttpResponse(result.unwrap());
  }
}
