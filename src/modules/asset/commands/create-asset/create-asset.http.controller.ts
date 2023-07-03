import { routesV1 } from '@modules/asset/asset.routes';
import { CreateAssetCommand } from '@modules/asset/commands/create-asset/create-asset.command';
import { CreateAssetHttpRequest } from '@modules/asset/commands/create-asset/create-asset.request.dto';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Asset')
@ApiBearerAuth('jwt-token')
@Controller(routesV1.version)
export class CreateAssetHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.asset.root)
  @ApiOperation({ summary: 'Create a asset' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'when the asset is created successfully',
  })
  async create(@Body() body: CreateAssetHttpRequest): Promise<void> {
    const command = new CreateAssetCommand({
      ...body,
    });

    await this.commandBus.execute(command);
  }
}
