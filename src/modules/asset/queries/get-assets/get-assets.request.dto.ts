import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetAssetsRequest{
  @ApiProperty({ description: 'asset name', required: false })
  @MaxLength(100)
  @IsString()
  @IsOptional()
  readonly name: string;
}

export class GetAssetsHttpRequest
  extends GetAssetsRequest {}
