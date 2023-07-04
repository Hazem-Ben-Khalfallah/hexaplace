import { routesV1 } from '@modules/asset/asset.routes';
import { RejectAssetCommand } from '@modules/asset/commands/reject-asset/reject-asset.command';
import { RejectAssetHttpRequest } from '@modules/asset/commands/reject-asset/reject-asset.request.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Asset')
@Controller(routesV1.version)
export class RejectAssetHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.asset.reject)
  @ApiOperation({ summary: 'Reject asset' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Asset rejected',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `when rejecting a marked as deleted asset`,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `when asset is not found`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async reject(
    @Param('id') assetId: string,
    @Body() body: RejectAssetHttpRequest,
  ): Promise<void> {
    const command = new RejectAssetCommand({
      assetId,
      reason: body.reason,
    });
    await this.commandBus.execute(command);
  }
}
