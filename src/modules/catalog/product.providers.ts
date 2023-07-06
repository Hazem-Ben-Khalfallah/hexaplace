import { ProductUnitOfWork } from '@modules/catalog/database/product.unit-of-work';
import { ClassProvider, Provider } from '@nestjs/common';
import { ProductOrmRepository } from './database/product.orm-repository';
import { ProductApprovedDomainEventHandler } from './event-handlers/product-approved.domain-event-handler';
import { ProductRejectedDomainEventHandler } from './event-handlers/product-rejected.domain-event-handler';
import { EmailNotificationSender } from './adapters/notification.email.adapter';

export const productUnitOfWorkSingletonProvider: ClassProvider = {
  provide: 'ProductUnitOfWorkPort',
  useClass: ProductUnitOfWork,
};

export const productReadRepositoryProvider: ClassProvider = {
  provide: 'ProductReadRepositoryPort',
  useClass: ProductOrmRepository,
};

export const productWriteRepositoryProvider: ClassProvider = {
  provide: 'ProductWriteRepositoryPort',
  useClass: ProductOrmRepository,
};

export const productApprovedNotificationProvider: ClassProvider = {
  provide: 'ProductApprovedNotificationPort',
  useClass: EmailNotificationSender,
};

export const productRejectedNotificationProvider: ClassProvider = {
  provide: 'ProductRejectedNotificationPort',
  useClass: EmailNotificationSender,
};

export const productApprovedDomainEventHandlerProvider: Provider = {
  provide: ProductApprovedDomainEventHandler,
  useFactory: (
    logger,
    productApprovedNotificationPort,
  ): ProductApprovedDomainEventHandler => {
    const eventHandler = new ProductApprovedDomainEventHandler(
      logger,
      productApprovedNotificationPort,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: ['LoggerPort', 'ProductApprovedNotificationPort'],
};

export const productRejectdDomainEventHandlerProvider: Provider = {
  provide: ProductRejectedDomainEventHandler,
  useFactory: (
    logger,
    productRejectdNotificationPort,
  ): ProductRejectedDomainEventHandler => {
    const eventHandler = new ProductRejectedDomainEventHandler(
      logger,
      productRejectdNotificationPort,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: ['LoggerPort', 'ProductRejectedNotificationPort'],
};
