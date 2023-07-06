import { routesV1 } from '@modules/catalog/catalog.routes';
import { CreateProductCommand } from '@modules/catalog/commands/create-product/create-product.command';
import { CreateProductHttpRequest } from '@modules/catalog/commands/create-product/create-product.request.dto';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
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
export class CreateProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.product.root)
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'when the product is created successfully',
  })
  async create(@Body() body: CreateProductHttpRequest): Promise<void> {
    const command = new CreateProductCommand({
      ...body,
    });

    await this.commandBus.execute(command);
  }
}
