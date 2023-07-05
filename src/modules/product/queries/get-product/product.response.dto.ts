import { ResponseBase } from '@libs/ddd/interface-adapters/base-classes/response.base';
import { ProductEntity } from '@modules/product/domain/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export interface GetProductById {
  id?: string;
  name: string;
  description: string;
  status: string;
}

export class ProductResponse extends ResponseBase implements GetProductById {
  constructor(product: ProductEntity) {
    super(product);
    /* Whitelisting returned data to avoid leaks.
       If a new property is added, like password or a
       credit card number, it won't be returned
       unless you specifically allow this.
       (avoid blacklisting, which will return everything
        but blacklisted items, which can lead to a data leak).
    */
    const props = product.getPropsCopy();
    this.name = props.name;
    this.description = props.description;
    this.status = props.status;
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

  @ApiProperty({
    example: 'product_draft',
    description: 'Product status',
  })
  status: string;

}

export class ProductHttpResponse extends ProductResponse implements GetProductById {}
