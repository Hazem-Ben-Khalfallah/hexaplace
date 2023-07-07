import { routesV1 } from '@modules/catalog/catalog.routes';
import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { DeleteProductCommand } from './delete-product.command';

@ApiTags('Product')
@ApiBearerAuth('jwt-token')
@Controller(routesV1.version)
export class DeleteProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(routesV1.product.delete)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'when the product is deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') productId: string): Promise<void> {
    const command = new DeleteProductCommand({
      id: productId,
    });

    await this.commandBus.execute(command);
  }
}
