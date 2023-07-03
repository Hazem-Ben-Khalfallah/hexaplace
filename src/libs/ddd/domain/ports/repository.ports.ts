import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { BaseEntityProps } from '@libs/ddd/domain/base-classes/entity.base';
import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { DeepPartial } from '@libs/types';

/*  Most of repositories will probably need generic
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific interfaces should be defined
    in a respective module/use case.
*/

export type QueryParams<EntityProps> = DeepPartial<
  BaseEntityProps & EntityProps
>;

export interface Save<Entity> {
  save(entity: Entity): Promise<Entity>;
}

export interface SaveMultiple<Entity> {
  saveMultiple(entities: Entity[]): Promise<Entity[]>;
}

export interface FindOne<Entity, EntityProps> {
  findOneOrThrow(params: QueryParams<EntityProps>): Promise<Entity>;
}

export interface FindOneById<Entity> {
  findOneByIdOrThrow(id: ID | string): Promise<Entity>;
}

export interface FindMany<Entity, EntityProps> {
  findMany(params: QueryParams<EntityProps>): Promise<Entity[]>;
}

export interface OrderBy {
  [key: number]: -1 | 1;
}

export interface PaginationMeta {
  skip?: number;
  limit?: number;
  page?: number;
}

export interface FindManyPaginatedParams<EntityProps> {
  params?: QueryParams<EntityProps>;
  pagination?: PaginationMeta;
  orderBy?: OrderBy;
}

export interface DataWithPaginationMeta<T extends AggregateRoot<unknown>> {
  results: T[];
  nbResultsPerPage: number;
  limit?: number;
  page?: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface FindManyPaginated<
  TEntity extends AggregateRoot<unknown>,
  REntityProps,
> {
  findManyPaginated(
    options: FindManyPaginatedParams<REntityProps>,
  ): Promise<DataWithPaginationMeta<TEntity>>;
}

export interface DeleteOne<Entity> {
  delete(entity: Entity): Promise<Entity>;
}

export interface WriteRepositoryPort<Entity>
  extends Save<Entity>,
    DeleteOne<Entity>,
    SaveMultiple<Entity> {
  setCorrelationId(correlationId: string): this;
}

export interface ReadRepositoryPort<
  Entity extends AggregateRoot<unknown>,
  EntityProps,
> extends FindOne<Entity, EntityProps>,
    FindOneById<Entity>,
    FindMany<Entity, EntityProps>,
    FindManyPaginated<Entity, EntityProps> {}
