import { Query } from '@libs/ddd/domain/base-classes/query-handler.base';

// Query is a plain object with properties
export class GetProductsQuery extends Query {
  readonly name?: string;

  constructor(props: GetProductsQuery) {
    super();
    this.name = props.name;
  }
}
