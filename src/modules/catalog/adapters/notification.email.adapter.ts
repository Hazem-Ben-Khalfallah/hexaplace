import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { ProductApprovedNotificationPort } from '@modules/catalog/ports/product-approved-notification.port';
import { Inject } from '@nestjs/common';
import { ProductRejectedNotificationPort } from '../ports/product-rejected-notification.port';

export class EmailNotificationSender
  implements ProductApprovedNotificationPort, ProductRejectedNotificationPort
{
  constructor(
    @Inject('LoggerPort')
    private readonly logger: LoggerPort,
  ) {
    logger.setContext(this.constructor.name);
  }

  async send(event: DomainEvent): Promise<void> {
    this.logger.log('Email successfully sent', JSON.stringify(event));
    await Promise.resolve();
  }
}
