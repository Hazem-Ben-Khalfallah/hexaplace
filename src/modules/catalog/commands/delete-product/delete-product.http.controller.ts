import { routesV1 } from '@modules/catalog/catalog.routes';
import { DeleteProductCommand } from '@modules/catalog/commands/delete-product/delete-product.command';
import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Product')
@ApiBearerAuth('jwt-token')
@Controller(routesV1.version)
export class DeleteProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(routesV1.product.delete)
  @ApiOperation({ summary: 'Delete product by id' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product Archived',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `when product is not found`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProductById(@Param('id') id: string): Promise<void> {
    const command = new DeleteProductCommand({ id: id });
    await this.commandBus.execute(command);
  }
}
