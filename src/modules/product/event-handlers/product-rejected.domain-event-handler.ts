import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { ProductRejectdDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';
import { ProductRejectdNotificationGatewayPort } from '@modules/product/ports/product-rejected-notification.gateway.port';

export class ProductRejectdDomainEventHandler extends DomainEventHandler {
  constructor(
    private readonly logger: LoggerPort,
    private readonly productRejectdNotificationGatewayPort: ProductRejectdNotificationGatewayPort,
  ) {
    super(ProductRejectdDomainEvent);
    logger.setContext(this.constructor.name);
  }

  async handle(event: ProductRejectdDomainEvent): Promise<void> {
    this.logger.debug(
      `Sending product rejectd notification [${JSON.stringify(event)}]`,
    );

    await this.productRejectdNotificationGatewayPort.notify(event);
  }
}
