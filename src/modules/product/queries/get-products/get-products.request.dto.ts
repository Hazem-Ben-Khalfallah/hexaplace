import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetProductsRequest{
  @ApiProperty({ description: 'product name', required: false })
  @MaxLength(100)
  @IsString()
  @IsOptional()
  readonly name: string;
}

export class GetProductsHttpRequest
  extends GetProductsRequest {}
