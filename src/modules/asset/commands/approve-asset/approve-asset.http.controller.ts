import { routesV1 } from '@modules/asset/asset.routes';
import { ApproveAssetCommand } from '@modules/asset/commands/approve-asset/approve-asset.command';
import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Asset')
@Controller(routesV1.version)
export class ApproveAssetHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.asset.approve)
  @ApiOperation({ summary: 'Approve asset' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Asset approved',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `when approving a marked as deleted asset`,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `when asset is not found`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async approve(@Param('id') assetId: string): Promise<void> {
    const command = new ApproveAssetCommand({
      assetId,
    });
    await this.commandBus.execute(command);
  }
}
