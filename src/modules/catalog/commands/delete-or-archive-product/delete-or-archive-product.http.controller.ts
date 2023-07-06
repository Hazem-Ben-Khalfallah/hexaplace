import { routesV1 } from '@modules/catalog/product.routes';
import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteOrArchiveProductCommand } from './delete-or-archive-product.command';

@ApiTags('Product')
@Controller(routesV1.version)
export class DeleteOrArchiveProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(routesV1.product.delete)
  @ApiOperation({ summary: 'delete or archive a product' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product archived',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `when product is not found`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async approve(@Param('id') productId: string): Promise<void> {
    const command = new DeleteOrArchiveProductCommand({
      productId,
    });
    await this.commandBus.execute(command);
  }
}
