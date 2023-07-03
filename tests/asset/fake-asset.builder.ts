import { faker } from '@faker-js/faker';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { AssetStatus } from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';
import { AssetWriteRepositoryPort } from '@modules/asset/ports/asset.repository.port';

export class FakeAssetBuilder {
  private id?: string;

  private name?: string;

  private description?: string;

  private status?: AssetStatus;

  private createdDate?: DateVO;

  private constructor(private assetWriteRepository: AssetWriteRepositoryPort) {}

  public static builder(
    assetWriteRepository: AssetWriteRepositoryPort,
  ): FakeAssetBuilder {
    return new FakeAssetBuilder(assetWriteRepository);
  }

  public withId(id?: string): FakeAssetBuilder {
    this.id = id;
    return this;
  }

  public withName(name: string): FakeAssetBuilder {
    this.name = name;
    return this;
  }

  public withDescription(description: string): FakeAssetBuilder {
    this.description = description;
    return this;
  }

  public withStatus(status?: AssetStatus): FakeAssetBuilder {
    this.status = status;
    return this;
  }

  public withCreatedDate(createdDate?: DateVO): FakeAssetBuilder {
    this.createdDate = createdDate;
    return this;
  }

  async build(): Promise<AssetEntity> {
    let assetEntity: AssetEntity = AssetEntity.create({
      id: this.id || faker.datatype.uuid(),
      createdDate: this.createdDate || undefined,
      name: this.name || faker.commerce.productName(),
      description: this.description || faker.commerce.productDescription(),
    });

    assetEntity = this.changeStatus(assetEntity, this.status);

    return this.assetWriteRepository.save(assetEntity);
  }

  private changeStatus(asset: AssetEntity, status?: AssetStatus): AssetEntity {
    if (AssetStatus.APPROVED === status) {
      asset.approve();
    }

    if (AssetStatus.REJECTED === status) {
      asset.reject('Rejection reason');
    }
    return asset;
  }
}
