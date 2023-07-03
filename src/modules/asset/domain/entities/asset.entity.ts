import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { Guard } from '@libs/ddd/domain/guard';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { AssetApprovedDomainEvent } from '@modules/asset/domain/events/asset-approved.domain-event';
import { AssetCreatedDomainEvent } from '@modules/asset/domain/events/asset-created.domain-event';
import { AssetRejectdDomainEvent } from '@modules/asset/domain/events/asset-rejected.domain-event';
import { AssetStatus } from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';
import { AlreadyDeletedAssetError } from '@modules/asset/errors/asset/already-deleted-asset-error.error';
import { AssetDescriptionRequiredError } from '@modules/asset/errors/asset/asset-description-required.error';
import { AssetNameRequiredError } from '@modules/asset/errors/asset/asset-name-required.error';

export interface CreateAssetProps {
  id?: string;
  createdDate?: DateVO;
  name: string;
  description: string;
}

export interface UpdateAssetProps {
  name: string;
  description: string;
}

export interface AssetProps extends CreateAssetProps {
  status: AssetStatus;
}

export class AssetEntity extends AggregateRoot<AssetProps> {
  protected readonly _id: UUID;

  static create(create: CreateAssetProps): AssetEntity {
    const id = create.id ? new UUID(create.id) : UUID.generate();
    const props: AssetProps = {
      ...create,
      status: AssetStatus.DRAFT,
    };

    const assetEntity = new AssetEntity({
      id,
      createdDate: create.createdDate,
      props,
    });

    assetEntity.addEvent(
      new AssetCreatedDomainEvent({
        aggregateId: id.value,
        ...props,
      }),
    );

    return assetEntity;
  }

  approve(): void {
    this.changeStatusTo(AssetStatus.APPROVED);
    this.addEvent(new AssetApprovedDomainEvent({ aggregateId: this.id.value }));
  }

  reject(reason: string): void {
    this.changeStatusTo(AssetStatus.REJECTED);
    this.addEvent(
      new AssetRejectdDomainEvent({
        aggregateId: this.id.value,
        reason,
      }),
    );
  }

  private changeStatusTo(status: AssetStatus): void {
    if (this.props.status === AssetStatus.DELETED) {
      throw new AlreadyDeletedAssetError();
    }
    this.props.status = status;
  }

  validate(): void {
    if (Guard.isEmpty(this.props.name)) throw new AssetNameRequiredError();
    if (Guard.isEmpty(this.props.description))
      throw new AssetDescriptionRequiredError();
  }
}
