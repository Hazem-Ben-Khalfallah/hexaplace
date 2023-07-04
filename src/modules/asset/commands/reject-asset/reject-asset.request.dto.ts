import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export interface RejectAsset {
  reason?: string;
}

export class RejectAssetRequest implements RejectAsset {
  @ApiProperty({ description: 'Rejection reason' })
  @MaxLength(320)
  @IsString()
  readonly reason: string;
}

export class RejectAssetHttpRequest extends RejectAssetRequest {}
