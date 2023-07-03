import { BaseEntityProps } from '@libs/ddd/domain/base-classes/entity.base';
import { IdResponse } from '@libs/ddd/interface-adapters/dtos/id.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseBase extends IdResponse {
  constructor(entity: BaseEntityProps) {
    super(entity.id.value);
    this.createdAt = entity.createdDate.value.toISOString();
    this.updatedAt = entity.updatedDate.value.toISOString();
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  createdAt: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  updatedAt: string;
}
