import { NotFoundException } from '@exceptions';
import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
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
import { FindConditions, ObjectLiteral, Repository } from 'typeorm';

export type WhereCondition<OrmEntity> =
  | FindConditions<OrmEntity>[]
  | FindConditions<OrmEntity>
  | ObjectLiteral
  | string;

export abstract class TypeormRepositoryBase<
  Entity extends AggregateRoot<unknown>,
  EntityProps,
  OrmEntity extends ObjectLiteral,
> implements
    WriteRepositoryPort<Entity>,
    ReadRepositoryPort<Entity, EntityProps>
{
  protected constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: OrmMapper<Entity, OrmEntity>,
    protected readonly logger: LoggerPort,
  ) {}

  /**
   * Specify relations to other tables.
   * For example: `relations = ['user', ...]`
   */
  protected abstract relations: string[];

  protected tableName = this.repository.metadata.tableName;

  protected abstract prepareQuery(
    params: QueryParams<EntityProps>,
  ): WhereCondition<OrmEntity>;

  async save(entity: Entity): Promise<Entity> {
    entity.validate(); // Protecting invariant before saving
    const ormEntity: OrmEntity = this.mapper.toOrmEntity(entity);
    const result = await this.repository.save(ormEntity);
    await DomainEvents.publishEvents(
      entity.id,
      this.logger,
      this.correlationId,
    );
    this.logger.debug(
      `[${entity.constructor.name}] persisted ${entity.id.value}`,
    );
    return this.mapper.toDomainEntity(result);
  }

  async saveMultiple(entities: Entity[]): Promise<Entity[]> {
    const ormEntities = entities.map((entity) => {
      entity.validate();
      return this.mapper.toOrmEntity(entity);
    });
    const result = await this.repository.save(ormEntities);
    await Promise.all(
      entities.map((entity) =>
        DomainEvents.publishEvents(entity.id, this.logger, this.correlationId),
      ),
    );
    this.logger.debug(
      `[${entities}]: persisted ${entities.map((entity) => entity.id)}`,
    );
    return result.map((entity) => this.mapper.toDomainEntity(entity));
  }

  async findOne(
    params: QueryParams<EntityProps> = {},
  ): Promise<Entity | undefined> {
    const where = this.prepareQuery(params);
    const found = await this.repository.findOne({
      where,
      relations: this.relations,
    });
    return found ? this.mapper.toDomainEntity(found) : undefined;
  }

  async findOneOrThrow(params: QueryParams<EntityProps> = {}): Promise<Entity> {
    const found = await this.findOne(params);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async findOneByIdOrThrow(id: ID | string): Promise<Entity> {
    const query = {
      where: { id: id instanceof ID ? id.value : id },
    };
    const found = await this.repository.findOne(query);
    if (!found) {
      throw new NotFoundException();
    }
    return this.mapper.toDomainEntity(found);
  }

  async findMany(params: QueryParams<EntityProps> = {}): Promise<Entity[]> {
    const result = await this.repository.find({
      where: this.prepareQuery(params),
      relations: this.relations,
    });

    return result.map((item) => this.mapper.toDomainEntity(item));
  }

  async findManyPaginated({
    params = {},
    pagination,
    orderBy,
  }: FindManyPaginatedParams<EntityProps>): Promise<
    DataWithPaginationMeta<Entity>
  > {
    const [data, count] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where: this.prepareQuery(params),
      order: orderBy,
      relations: this.relations,
    });

    const result: DataWithPaginationMeta<Entity> = {
      results: data.map((item) => this.mapper.toDomainEntity(item)),
      nbResultsPerPage: count,
      limit: pagination?.limit,
      page: pagination?.page,
      startCursor: '',
      endCursor: '',
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return result;
  }

  async delete(entity: Entity): Promise<Entity> {
    entity.validate();
    await this.repository.remove(this.mapper.toOrmEntity(entity));
    await DomainEvents.publishEvents(
      entity.id,
      this.logger,
      this.correlationId,
    );
    this.logger.debug(
      `[${entity.constructor.name}] deleted ${entity.id.value}`,
    );
    return entity;
  }

  protected correlationId?: string;

  setCorrelationId(correlationId: string): this {
    this.correlationId = correlationId;
    this.setContext();
    return this;
  }

  private setContext() {
    if (this.correlationId) {
      this.logger.setContext(`${this.constructor.name}:${this.correlationId}`);
    } else {
      this.logger.setContext(this.constructor.name);
    }
  }
}
