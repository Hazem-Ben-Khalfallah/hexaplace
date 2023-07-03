import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { AssetRejectdDomainEvent } from '@modules/asset/domain/events/asset-rejected.domain-event';
import { AssetRejectdNotificationGatewayPort } from '@modules/asset/ports/asset-rejected-notification.gateway.port';

export class AssetRejectdDomainEventHandler extends DomainEventHandler {
  constructor(
    private readonly logger: LoggerPort,
    private readonly assetRejectdNotificationGatewayPort: AssetRejectdNotificationGatewayPort,
  ) {
    super(AssetRejectdDomainEvent);
    logger.setContext(this.constructor.name);
  }

  async handle(event: AssetRejectdDomainEvent): Promise<void> {
    this.logger.debug(
      `Sending asset rejectd notification [${JSON.stringify(event)}]`,
    );

    await this.assetRejectdNotificationGatewayPort.notify(event);
  }
}
