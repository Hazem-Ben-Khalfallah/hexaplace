import { faker } from '@faker-js/faker';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ProductEntity } from '@modules/product/domain/entities/product.entity';
import { ProductStatus } from '@modules/product/domain/value-objects/product-status/product-status.enum';
import { ProductWriteRepositoryPort } from '@modules/product/ports/product.repository.port';

export class FakeProductBuilder {
  private id?: string;

  private name?: string;

  private description?: string;

  private status?: ProductStatus;

  private createdDate?: DateVO;

  private constructor(private productWriteRepository: ProductWriteRepositoryPort) {}

  public static builder(
    productWriteRepository: ProductWriteRepositoryPort,
  ): FakeProductBuilder {
    return new FakeProductBuilder(productWriteRepository);
  }

  public withId(id?: string): FakeProductBuilder {
    this.id = id;
    return this;
  }

  public withName(name?: string): FakeProductBuilder {
    this.name = name;
    return this;
  }

  public withDescription(description?: string): FakeProductBuilder {
    this.description = description;
    return this;
  }

  public withStatus(status?: ProductStatus): FakeProductBuilder {
    this.status = status;
    return this;
  }

  public withCreatedDate(createdDate?: DateVO): FakeProductBuilder {
    this.createdDate = createdDate;
    return this;
  }

  async build(): Promise<ProductEntity> {
    let productEntity: ProductEntity = ProductEntity.create({
      id: this.id || faker.datatype.uuid(),
      createdDate: this.createdDate || undefined,
      name: this.name || faker.commerce.productName(),
      description: this.description || faker.commerce.productDescription(),
    });

    productEntity = this.changeStatus(productEntity, this.status);

    return this.productWriteRepository.save(productEntity);
  }

  private changeStatus(product: ProductEntity, status?: ProductStatus): ProductEntity {
    if (ProductStatus.APPROVED === status) {
      product.approve();
    }

    if (ProductStatus.REJECTED === status) {
      product.reject('Rejection reason');
    }

    if (ProductStatus.DELETED === status) {
      product.markAsDeleted();
    }
    return product;
  }
}
