import { routesV1 } from '@modules/catalog/catalog.routes';
import { Controller, Delete, HttpCode, HttpStatus, Param, } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteProductCommand } from './delete-product.command';

@ApiTags('Product')
@Controller(routesV1.version)
export class DeleteProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(routesV1.product.resourceById)
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `when product is not found`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async approve(@Param('id') productId: string): Promise<void> {
    const command = new DeleteProductCommand({
      productId,
    });
    await this.commandBus.execute(command);
  }
}
