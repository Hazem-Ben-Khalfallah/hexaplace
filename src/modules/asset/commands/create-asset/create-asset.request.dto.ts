import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export interface CreateAsset {
  id?: string;
  name: string;
  description: string;
}

export class CreateAssetRequest implements CreateAsset {
  @ApiProperty({
    description: 'Asset id',
  })
  @IsString()
  @IsOptional()
  readonly id?: string;

  @ApiProperty({
    description: 'Asset name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Asset description' })
  @IsString()
  readonly description: string;
}

export class CreateAssetHttpRequest
  extends CreateAssetRequest
  implements CreateAsset {}
