import { routesV1 } from '@modules/catalog/product.routes';
import { ApproveProductCommand } from '@modules/catalog/commands/approve-product/approve-product.command';
import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller(routesV1.version)
export class ApproveProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.product.approve)
  @ApiOperation({ summary: 'Approve product' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product approved',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `when approving a marked as deleted product`,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `when product is not found`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async approve(@Param('id') productId: string): Promise<void> {
    const command = new ApproveProductCommand({
      productId,
    });
    await this.commandBus.execute(command);
  }
}
