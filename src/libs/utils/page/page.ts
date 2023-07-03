import { PageOptions } from '@libs/utils/page/page-options';
import { ApiProperty } from '@nestjs/swagger';

export class Page<T> {
  @ApiProperty({
    description: 'has previous page',
  })
  readonly hasPrevious: boolean;

  @ApiProperty({
    description: 'has next page',
  })
  readonly hasNext: boolean;

  @ApiProperty({
    description: 'current page number',
  })
  readonly currentPageNumber: number;

  @ApiProperty({
    description: 'current page size',
  })
  readonly pageSize: number;

  @ApiProperty({
    description: 'total elements related to the selected filters',
  })
  readonly totalElements: number;

  @ApiProperty({
    description: 'total pages count',
  })
  readonly totalPages: number;

  @ApiProperty({
    description: 'current page elements list',
    type: Object,
  })
  data: T[];

  constructor(
    data: T[],
    {
      pageOptions,
      totalElements,
    }: { pageOptions: PageOptions; totalElements: number },
  ) {
    this.data = data;
    this.currentPageNumber =
      pageOptions.currentPageNumber || getDefaultPageNumber();
    this.pageSize = pageOptions.pageSize || getDefaultPageSize();
    this.totalElements = totalElements;
    this.totalPages = this.totalElements
      ? Math.ceil(this.totalElements / this.pageSize)
      : 0;
    this.hasPrevious = this.currentPageNumber > 0;
    this.hasNext = this.currentPageNumber + 1 < this.totalPages;
  }
}

export function getDefaultPageSize(): number {
  return parseInt(process.env.DEFAULT_PAGE_SIZE || '10', 10);
}

export function getDefaultPageNumber(): number {
  return parseInt(process.env.DEFAULT_PAGE_NUMBER || '0', 10);
}
