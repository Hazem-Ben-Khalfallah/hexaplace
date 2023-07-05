import { routesV1 } from '@modules/product/product.routes';
import { RejectProductCommand } from '@modules/product/commands/reject-product/reject-product.command';
import { RejectProductHttpRequest } from '@modules/product/commands/reject-product/reject-product.request.dto';
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

@ApiTags('Product')
@Controller(routesV1.version)
export class RejectProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.product.reject)
  @ApiOperation({ summary: 'Reject product' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product rejected',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: `when rejecting a marked as deleted product`,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `when product is not found`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async reject(
    @Param('id') productId: string,
    @Body() body: RejectProductHttpRequest,
  ): Promise<void> {
    const command = new RejectProductCommand({
      productId,
      reason: body.reason,
    });
    await this.commandBus.execute(command);
  }
}
