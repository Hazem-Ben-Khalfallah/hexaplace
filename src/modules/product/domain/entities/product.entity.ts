import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { Guard } from '@libs/ddd/domain/guard';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { ProductApprovedDomainEvent } from '@modules/product/domain/events/product-approved.domain-event';
import { ProductCreatedDomainEvent } from '@modules/product/domain/events/product-created.domain-event';
import { ProductRejectdDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';
import { ProductStatus } from '@modules/product/domain/value-objects/product-status/product-status.enum';
import { AlreadyDeletedProductError } from '@modules/product/errors/product/already-deleted-product-error.error';
import { ProductDescriptionRequiredError } from '@modules/product/errors/product/product-description-required.error';
import { ProductNameRequiredError } from '@modules/product/errors/product/product-name-required.error';

export interface CreateProductProps {
  id?: string;
  createdDate?: DateVO;
  name: string;
  description: string;
}

export interface UpdateProductProps {
  name: string;
  description: string;
}

export interface ProductProps extends CreateProductProps {
  status: ProductStatus;
}

export class ProductEntity extends AggregateRoot<ProductProps> {
  protected readonly _id: UUID;

  static create(create: CreateProductProps): ProductEntity {
    const id = create.id ? new UUID(create.id) : UUID.generate();
    const props: ProductProps = {
      ...create,
      status: ProductStatus.DRAFT,
    };

    const productEntity = new ProductEntity({
      id,
      createdDate: create.createdDate,
      props,
    });

    productEntity.addEvent(
      new ProductCreatedDomainEvent({
        aggregateId: id.value,
        ...props,
      }),
    );

    return productEntity;
  }

  approve(): void {
    this.changeStatusTo(ProductStatus.APPROVED);
    this.addEvent(new ProductApprovedDomainEvent({ aggregateId: this.id.value }));
  }

  reject(reason: string): void {
    this.changeStatusTo(ProductStatus.REJECTED);
    this.addEvent(
      new ProductRejectdDomainEvent({
        aggregateId: this.id.value,
        reason,
      }),
    );
  }

  markAsDeleted(): void {
    this.changeStatusTo(ProductStatus.DELETED);
  }

  private changeStatusTo(status: ProductStatus): void {
    if (this.props.status === ProductStatus.DELETED) {
      throw new AlreadyDeletedProductError();
    }
    this.props.status = status;
  }

  validate(): void {
    if (Guard.isEmpty(this.props.name)) throw new ProductNameRequiredError();
    if (Guard.isEmpty(this.props.description))
      throw new ProductDescriptionRequiredError();
  }
}