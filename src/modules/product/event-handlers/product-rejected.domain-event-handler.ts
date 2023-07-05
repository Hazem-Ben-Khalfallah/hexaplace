import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { ProductRejectedDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';
import { ProductRejectedNotificationPort } from '@modules/product/ports/product-rejected-notification.port';

export class ProductRejectedDomainEventHandler extends DomainEventHandler {
  constructor(
    private readonly logger: LoggerPort,
    private readonly productRejectedNotificationPort: ProductRejectedNotificationPort,
  ) {
    super(ProductRejectedDomainEvent);
    logger.setContext(this.constructor.name);
  }

  async handle(event: ProductRejectedDomainEvent): Promise<void> {
    this.logger.debug(
      `Sending product rejected notification [${JSON.stringify(event)}]`,
    );

    await this.productRejectedNotificationPort.send(event);
  }
}
