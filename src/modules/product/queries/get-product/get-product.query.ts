import { Query } from '@libs/ddd/domain/base-classes/query-handler.base';

// Query is a plain object with properties
export class GetProductQuery extends Query {
  readonly id: string;

  constructor(props: GetProductQuery) {
    super();
    this.id = props.id;
  }
}
