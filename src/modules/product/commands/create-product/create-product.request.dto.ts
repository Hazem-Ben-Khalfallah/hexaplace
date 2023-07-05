import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export interface CreateProduct {
  id?: string;
  name: string;
  description: string;
}

export class CreateProductRequest implements CreateProduct {
  @ApiProperty({
    description: 'Product id',
  })
  @IsString()
  @IsOptional()
  readonly id?: string;

  @ApiProperty({
    description: 'Product name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  readonly description: string;
}

export class CreateProductHttpRequest
  extends CreateProductRequest
  implements CreateProduct {}
