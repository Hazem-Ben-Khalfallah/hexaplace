import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { ProductRejectedDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';
import { ProductRejectdNotificationGatewayPort as ProductRejectedNotificationGatewayPort } from '@modules/product/ports/product-rejected-notification.gateway.port';

export class ProductRejectdDomainEventHandler extends DomainEventHandler {
  constructor(
    private readonly logger: LoggerPort,
    private readonly productRejectedNotificationGatewayPort: ProductRejectedNotificationGatewayPort,
  ) {
    super(ProductRejectedDomainEvent);
    logger.setContext(this.constructor.name);
  }

  async handle(event: ProductRejectedDomainEvent): Promise<void> {
    this.logger.debug(
      `Sending product rejected notification [${JSON.stringify(event)}]`,
    );

    await this.productRejectedNotificationGatewayPort.notify(event);
  }
}
