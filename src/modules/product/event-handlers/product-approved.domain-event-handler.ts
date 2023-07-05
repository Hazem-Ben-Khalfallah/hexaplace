import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { ProductApprovedDomainEvent } from '@modules/product/domain/events/product-approved.domain-event';
import { ProductApprovedNotificationPort } from '@modules/product/ports/product-approved-notification.port';

export class ProductApprovedDomainEventHandler extends DomainEventHandler {
  constructor(
    private readonly logger: LoggerPort,
    private readonly productApprovedNotificationPort: ProductApprovedNotificationPort,
  ) {
    super(ProductApprovedDomainEvent);
    logger.setContext(this.constructor.name);
  }

  async handle(event: ProductApprovedDomainEvent): Promise<void> {
    this.logger.debug(
      `Sending product approved notification [${JSON.stringify(event)}]`,
    );

    await this.productApprovedNotificationPort.send(event);
  }
}
