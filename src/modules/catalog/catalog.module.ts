import { LoggerModule } from '@infrastructure/logger/logger.module';
import {
  productApprovedDomainEventHandlerProvider,
  productApprovedNotificationProvider,
  productReadRepositoryProvider,
  productRejectdDomainEventHandlerProvider,
  productRejectedNotificationProvider,
  productUnitOfWorkSingletonProvider,
  productWriteRepositoryProvider,
} from '@modules/catalog/catalog.providers';
import { ApproveProductCommandHandler } from '@modules/catalog/commands/approve-product/approve-product.command-handler';
import { ApproveProductHttpController } from '@modules/catalog/commands/approve-product/approve-product.http.controller';
import { CreateProductCommandHandler } from '@modules/catalog/commands/create-product/create-product.command-handler';
import { CreateProductHttpController } from '@modules/catalog/commands/create-product/create-product.http.controller';
import { GetProductHttpController } from '@modules/catalog/queries/get-product/get-product.http.controller';
import { GetProductQueryHandler } from '@modules/catalog/queries/get-product/get-product.query-handler';
import { GetProductsHttpController } from '@modules/catalog/queries/get-products/get-products.http.controller';
import { GetProductsQueryHandler } from '@modules/catalog/queries/get-products/get-products.query-handler';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteProductCommandHandler } from './commands/delete-product/delete-product.command-handler';
import { DeleteProductHttpController } from './commands/delete-product/delete-product.http.controller';
import { RejectProductCommandHandler } from './commands/reject-product/reject-product.command-handler';
import { RejectProductHttpController } from './commands/reject-product/reject-product.http.controller';
import { ProductOrmEntity } from './database/product.orm-entity';

const httpControllers = [
  CreateProductHttpController,
  ApproveProductHttpController,
  DeleteProductHttpController,
  RejectProductHttpController,
  GetProductsHttpController,
  GetProductHttpController,
];

const queryHandlers = [GetProductsQueryHandler, GetProductQueryHandler];

const commandHandlers = [
  CreateProductCommandHandler,
  ApproveProductCommandHandler,
  DeleteProductCommandHandler,
  RejectProductCommandHandler,
];

const domainEventHandlers = [
  productApprovedDomainEventHandlerProvider,
  productRejectdDomainEventHandlerProvider,
];

const unitsOfWork = [productUnitOfWorkSingletonProvider];

const repositories = [
  productReadRepositoryProvider,
  productWriteRepositoryProvider,
];

const adapters = [
  productApprovedNotificationProvider,
  productRejectedNotificationProvider,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrmEntity]),
    CqrsModule,
    LoggerModule,
  ],
  controllers: [...httpControllers],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...domainEventHandlers,
    ...unitsOfWork,
    ...repositories,
    ...adapters,
  ],
})
export class ProductModule {}
