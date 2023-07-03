import { ArgumentInvalidException } from '@exceptions';
import {
  getDefaultPageNumber,
  getDefaultPageSize,
} from '@libs/utils/page/page';
import { isNumber } from 'class-validator';

export class PageOptions {
  readonly currentPageNumber: number = getDefaultPageNumber();

  readonly pageSize: number = getDefaultPageSize();

  constructor(currentPageNumber?: number, pageSize?: number) {
    this.currentPageNumber = currentPageNumber?.toString()
      ? currentPageNumber
      : 0;
    this.pageSize = pageSize?.toString() ? pageSize : getDefaultPageSize();
    this.validate();
  }

  protected validate(): void {
    if (
      !isNumber(this.currentPageNumber) ||
      this.currentPageNumber < getDefaultPageNumber()
    )
      throw new ArgumentInvalidException(`Invalid current page number`);
    if (!isNumber(this.pageSize) || this.pageSize < 1)
      throw new ArgumentInvalidException(`Invalid page size`);
  }
}
