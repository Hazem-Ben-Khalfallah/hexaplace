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

import { DeleteOrArchiveProductCommandHandler } from '@modules/catalog/commands/delete-or-archive-product/delete-or-archive-product.command-handler';
import { DeleteOrArchiveProductHttpController } from '@modules/catalog/commands/delete-or-archive-product/delete-or-archive-product.http.controller';
import { RejectProductCommandHandler } from '@modules/catalog/commands/reject-product/reject-product.command-handler';
import { RejectProductHttpController } from '@modules/catalog/commands/reject-product/reject-product.http.controller';
import { ProductOrmEntity } from '@modules/catalog/database/product.orm-entity';
import { GetProductHttpController } from '@modules/catalog/queries/get-product/get-product.http.controller';
import { GetProductQueryHandler } from '@modules/catalog/queries/get-product/get-product.query-handler';
import { GetProductsHttpController } from '@modules/catalog/queries/get-products/get-products.http.controller';
import { GetProductsQueryHandler } from '@modules/catalog/queries/get-products/get-products.query-handler';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

const httpControllers = [
  CreateProductHttpController,
  ApproveProductHttpController,
  RejectProductHttpController,
  GetProductsHttpController,
  GetProductHttpController,
  DeleteOrArchiveProductHttpController,
];

const queryHandlers = [GetProductsQueryHandler, GetProductQueryHandler];

const commandHandlers = [
  CreateProductCommandHandler,
  ApproveProductCommandHandler,
  RejectProductCommandHandler,
  DeleteOrArchiveProductCommandHandler,
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
