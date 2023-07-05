import { ResponseBase } from '@libs/ddd/interface-adapters/base-classes/response.base';
import { ProductEntity } from '@modules/product/domain/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponse extends ResponseBase {
  constructor(product: ProductEntity) {
    super(product);
    const props = product.getPropsCopy();
    this.name = props.name;
    this.description = props.description;
  }

  @ApiProperty({
    example: 'product 1',
    description: 'Product name',
  })
  name: string;

  @ApiProperty({
    example: 'Awesome prroduct',
    description: 'Product description',
  })
  description: string;
}

export class ProductHttpResponse extends ProductResponse {}
