import { ResponseBase } from '@libs/ddd/interface-adapters/base-classes/response.base';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AssetResponse extends ResponseBase {
  constructor(asset: AssetEntity) {
    super(asset);
    const props = asset.getPropsCopy();
    this.name = props.name;
    this.description = props.description;
  }

  @ApiProperty({
    example: 'product 1',
    description: 'Asset name',
  })
  name: string;

  @ApiProperty({
    example: 'Awesome prroduct',
    description: 'Asset description',
  })
  description: string;
}

export class AssetHttpResponse extends AssetResponse {}
