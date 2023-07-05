import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { BaseEntityProps } from '@libs/ddd/domain/base-classes/entity.base';
import { DomainEvents } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import {
  DataWithPaginationMeta,
  FindManyPaginatedParams,
  QueryParams,
  ReadRepositoryPort,
  WriteRepositoryPort,
} from '@libs/ddd/domain/ports/repository.ports';
import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { OrmMapper } from '@libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { TypeormEntityBase } from '@libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { DeepPartial } from '@libs/types';
import { NotFoundException } from '@src/libs/exceptions';

export abstract class InMemoryRepositoryBase<
  TEntity extends AggregateRoot<unknown>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  EntityProps,
  OEntity extends TypeormEntityBase,
> implements WriteRepositoryPort<TEntity>, ReadRepositoryPort<TEntity, OEntity>
{
  protected savedEntities: OEntity[] = [];

  hasError: boolean;

  protected correlationId?: string;

  /**
   * Specify relations to other tables.
   * For example: `relations = ['user', ...]`
   */
  protected constructor(
    protected readonly mapper: OrmMapper<TEntity, OEntity>,
    protected readonly logger: LoggerPort,
  ) {}

  protected toDomainEntities(entities: OEntity[]): TEntity[] {
    return entities.map((e: OEntity) => this.mapper.toDomainEntity(e));
  }

  delete(entity: TEntity): Promise<void> {
    this.savedEntities = this.savedEntities.filter(
      (e: OEntity) => e.id !== entity.id.value,
    );
    return Promise.resolve();
  }

  async findOneByIdOrThrow(id: ID): Promise<TEntity> {
    if (this.hasError) {
      throw new Error('Fake in-memory error');
    }
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with id '${id}' not found`);
    }
    return entity;
  }

  private findOneById(id: ID): Promise<TEntity | undefined> {
    const entity: OEntity | undefined = this.savedEntities.find(
      (e: OEntity) => e.id === id.value,
    );
    return entity
      ? Promise.resolve(this.mapper.toDomainEntity(entity))
      : Promise.resolve(undefined);
  }

  private existsById(id: ID | string): boolean {
    return this.savedEntities.some((e: OEntity) => e.id === id);
  }

  private update(ormEntity: OEntity): void {
    const index = this.savedEntities.findIndex(
      (savedEntity: OEntity) => savedEntity.id === ormEntity.id,
    );
    this.savedEntities[index] = ormEntity;
  }

  private create(ormEntity: OEntity): void {
    this.savedEntities.push(ormEntity);
  }

  async save(entity: TEntity): Promise<TEntity> {
    this.logger.debug(
      `Save [${entity.constructor.name}] [${entity.id.value}]`,
      entity.toObject(),
    );
    entity.validate(); // Protecting invariant before saving
    const ormEntity = this.mapper.toOrmEntity(entity);
    if (this.existsById(entity.id.value)) {
      this.update(ormEntity);
    } else {
      this.create(ormEntity);
    }

    await DomainEvents.publishEvents(
      entity.id,
      this.logger,
      this.correlationId,
    );
    return this.mapper.toDomainEntity(ormEntity);
  }

  saveMultiple(entities: TEntity[]): Promise<void> {
    entities.forEach((e: TEntity) => {
      this.savedEntities.push(this.mapper.toOrmEntity(e));
    });
    return Promise.resolve();
  }

  setCorrelationId(correlationId: string): this {
    this.correlationId = correlationId;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findMany(params: QueryParams<OEntity>): Promise<TEntity[]> {
    const entities = this.filterBy(this.savedEntities, params);
    return Promise.resolve(this.toDomainEntities(entities));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findOneOrThrow(params: QueryParams<OEntity>): Promise<TEntity> {
    const entities = this.filterBy(this.savedEntities, params);
    return Promise.resolve(this.toDomainEntities(entities)[0]);
  }

  // FIXME: use params attr to filter entities
  findManyPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: FindManyPaginatedParams<OEntity>,
  ): Promise<DataWithPaginationMeta<TEntity>> {
    const entities = this.filterBy(this.savedEntities, options.params || {});
    const res: DataWithPaginationMeta<TEntity> = {
      results: this.toDomainEntities(entities),
      nbResultsPerPage: 50,
      limit: 50,
      page: 0,
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: '0',
      endCursor: '50',
    };
    return Promise.resolve(res);
  }

  private filterBy(
    savedEntities: OEntity[],
    params: DeepPartial<BaseEntityProps & OEntity>,
  ) {
    let entities = savedEntities;
    if (params) {
      Object.keys(params).forEach((key: string) => {
        entities = entities.filter(
          (entity) =>
            entity[key as keyof OEntity] ===
            params[key as keyof QueryParams<OEntity>],
        );
      });
    }
    return entities;
  }

  forceError(): void {
    this.hasError = true;
  }
}
