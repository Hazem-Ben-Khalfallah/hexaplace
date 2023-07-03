import { Query } from '@libs/ddd/domain/base-classes/query-handler.base';

// Query is a plain object with properties
export class GetAssetsQuery extends Query {
  readonly name?: string;

  constructor(props: GetAssetsQuery) {
    super();
    this.name = props.name;
  }
}
