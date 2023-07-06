import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export interface RejectProduct {
  reason?: string;
}

export class RejectProductRequest implements RejectProduct {
  @ApiProperty({ description: 'Rejection reason' })
  @MaxLength(320)
  @IsString()
  readonly reason: string;
}

export class RejectProductHttpRequest extends RejectProductRequest {}
