import { LoggerModule } from '@infrastructure/logger/logger.module';
import { productReadRepositoryProvider,productUnitOfWorkSingletonProvider,productWriteRepositoryProvider } from '@modules/product/product.providers';
import { ApproveProductCommandHandler } from '@modules/product/commands/approve-product/approve-product.command-handler';
import { ApproveProductHttpController } from '@modules/product/commands/approve-product/approve-product.http.controller';
import { CreateProductCommandHandler } from '@modules/product/commands/create-product/create-product.command-handler';
import { CreateProductHttpController } from '@modules/product/commands/create-product/create-product.http.controller';
import { GetProductHttpController } from '@modules/product/queries/get-product/get-product.http.controller';
import { GetProductQueryHandler } from '@modules/product/queries/get-product/get-product.query-handler';
import { GetProductsHttpController } from '@modules/product/queries/get-products/get-products.http.controller';
import { GetProductsQueryHandler } from '@modules/product/queries/get-products/get-products.query-handler';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RejectProductCommandHandler } from './commands/reject-product/reject-product.command-handler';
import { RejectProductHttpController } from './commands/reject-product/reject-product.http.controller';
import { ProductOrmEntity } from './database/product.orm-entity';

const unitsOfWork = [productUnitOfWorkSingletonProvider];

const repositories = [
  productReadRepositoryProvider,
  productWriteRepositoryProvider,
];


const httpControllers = [
  CreateProductHttpController,
  ApproveProductHttpController,
  RejectProductHttpController,
  GetProductsHttpController,
  GetProductHttpController,
];

const commandHandlers = [
  CreateProductCommandHandler,
  ApproveProductCommandHandler,
  RejectProductCommandHandler,
];

const queryHandlers = [GetProductsQueryHandler, GetProductQueryHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrmEntity]),
    CqrsModule,
    LoggerModule
  ],
  controllers: [...httpControllers],
  providers: [
    ...repositories,
    ...unitsOfWork,
    ...commandHandlers,
     ...queryHandlers],
})
export class ProductModule {}
