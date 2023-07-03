import { Query } from '@libs/ddd/domain/base-classes/query-handler.base';

// Query is a plain object with properties
export class GetAssetQuery extends Query {
  readonly id: string;

  constructor(props: GetAssetQuery) {
    super();
    this.id = props.id;
  }
}
