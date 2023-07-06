import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { QueryParams } from '@libs/ddd/domain/ports/repository.ports';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { final } from '@libs/decorators/final.decorator';
import { removeUndefinedProps } from '@libs/utils/remove-undefined-props.util';
import { ProductOrmEntity } from '@modules/catalog/database/product.orm-entity';
import { ProductOrmMapper } from '@modules/catalog/database/product.orm-mapper';
import {
  ProductEntity,
  ProductProps,
} from '@modules/catalog/domain/entities/product.entity';
import { ProductReadRepositoryPort } from '@modules/catalog/ports/product.repository.port';
import { GetProductsQuery } from '@modules/catalog/queries/get-products/get-products.query';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
@final
export class ProductOrmRepository
  extends TypeormRepositoryBase<ProductEntity, ProductProps, ProductOrmEntity>
  implements ProductReadRepositoryPort
{
  protected relations: string[] = [];

  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>,
    @Inject('LoggerPort')
    protected readonly logger: LoggerPort,
  ) {
    super(
      productRepository,
      new ProductOrmMapper(ProductEntity, ProductOrmEntity),
      logger,
    );
  }

  async findOneByIdOrThrow(id: UUID): Promise<ProductEntity> {
    return super.findOneByIdOrThrow(id);
  }

  async findProducts(query: GetProductsQuery): Promise<ProductEntity[]> {
    const where: QueryParams<ProductOrmEntity> = removeUndefinedProps(query);
    const products = await this.repository.find({ where });
    return products.map((product) => this.mapper.toDomainEntity(product));
  }

  // Used to construct a query
  protected prepareQuery(
    params: QueryParams<ProductProps>,
  ): WhereCondition<ProductOrmEntity> {
    const where: QueryParams<ProductOrmEntity> = {};
    if (params.name) {
      where.name = params.name;
    }
    return where;
  }
}
