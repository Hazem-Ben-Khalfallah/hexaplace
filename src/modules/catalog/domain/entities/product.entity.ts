import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { Guard } from '@libs/ddd/domain/guard';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ProductApprovedDomainEvent } from '@modules/catalog/domain/events/product-approved.domain-event';
import { ProductCreatedDomainEvent } from '@modules/catalog/domain/events/product-created.domain-event';
import { ProductRejectedDomainEvent } from '@modules/catalog/domain/events/product-rejected.domain-event';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { ProductAlreadyArchivedError } from '@modules/catalog/errors/product/product-already-archived.error';
import { ProductDescriptionRequiredError } from '@modules/catalog/errors/product/product-description-required.error';
import { ProductNameRequiredError } from '@modules/catalog/errors/product/product-name-required.error';
import { ProductDeletedDomainEvent } from '../events/product-delete.domain-event';
import { ProductId } from '../value-objects/product-id.value-object';

export interface CreateProductProps {
  id?: string;
  createdDate?: DateVO;
  name: string;
  description: string;
}

export interface ProductProps {
  createdDate?: DateVO;
  name: string;
  description: string;
  status: ProductStatus;
}

export class ProductEntity extends AggregateRoot<ProductProps> {
  protected readonly _id: ProductId;
  status: any;

  static create(create: CreateProductProps): ProductEntity {
    const id: ProductId = create.id
      ? new ProductId(create.id)
      : ProductId.generate();
    const props: ProductProps = {
      name: create.name,
      description: create.description,
      status: ProductStatus.DRAFT,
    };

    const productEntity = new ProductEntity({
      id,
      createdDate: create.createdDate,
      props,
    });

    productEntity.emitEvent(
      new ProductCreatedDomainEvent({
        aggregateId: id.value,
        ...props,
      }),
    );

    return productEntity;
  }

  approve(): void {
    this.updateStatusIfApplicable(ProductStatus.APPROVED);
    this.emitEvent(
      new ProductApprovedDomainEvent({ aggregateId: this.id.value }),
    );
  }

  archive() {
    this.updateStatusIfApplicable(ProductStatus.ARCHIVED);
    this.emitEvent(
      new ProductApprovedDomainEvent({ aggregateId: this.id.value }),
    );
  }

  reject(reason: string): void {
    this.updateStatusIfApplicable(ProductStatus.REJECTED);
    this.emitEvent(
      new ProductRejectedDomainEvent({
        aggregateId: this.id.value,
        reason,
      }),
    );
  }

  markAsDeleted(): void {
    this.updateStatusIfApplicable(ProductStatus.ARCHIVED);
  }

  private updateStatusIfApplicable(status: ProductStatus): void {
    if (this.props.status === ProductStatus.ARCHIVED) {
      throw new ProductAlreadyArchivedError();
    }
    this.props.status = status;
  }

  validate(): void {
    if (Guard.isEmpty(this.props.name)) throw new ProductNameRequiredError();
    if (Guard.isEmpty(this.props.description))
      throw new ProductDescriptionRequiredError();
  }

  deleteArchive() {
    if (this.isDraft()) {
      this.changeStateOfProductandMakeStatusAsDeleted();
    } else if (this.isApproved()) {
      this.archive();
    } else if (this.isArchived()) {
      throw new ProductAlreadyArchivedError();
    } else {
      return;
    }
  }

  private changeStateOfProductandMakeStatusAsDeleted() {
    this.updateStatusIfApplicable(ProductStatus.DELETED);
    this.emitEvent(
      new ProductDeletedDomainEvent({
        aggregateId: this.id.value,
      }),
    );
  }

  private isDraft() {
    return this.props.status === ProductStatus.DRAFT;
  }

  private isArchived() {
    return this.props.status === ProductStatus.ARCHIVED;
  }

  isApproved() {
    return this.props.status === ProductStatus.APPROVED;
  }
}
