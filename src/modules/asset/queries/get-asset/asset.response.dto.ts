import { ResponseBase } from '@libs/ddd/interface-adapters/base-classes/response.base';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { ApiProperty } from '@nestjs/swagger';

export interface GetAssetById {
  id?: string;
  name: string;
  description: string;
}

export class AssetResponse extends ResponseBase implements GetAssetById {
  constructor(asset: AssetEntity) {
    super(asset);
    /* Whitelisting returned data to avoid leaks.
       If a new property is added, like password or a
       credit card number, it won't be returned
       unless you specifically allow this.
       (avoid blacklisting, which will return everything
        but blacklisted items, which can lead to a data leak).
    */
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

export class AssetHttpResponse extends AssetResponse implements GetAssetById {}
