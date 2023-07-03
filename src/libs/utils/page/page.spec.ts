import { ArgumentInvalidException } from '@exceptions';
import { Page } from '@src/libs/utils/page/page';
import { PageOptions } from '@src/libs/utils/page/page-options';
import { Asset } from 'aws-sdk/clients/codeartifact';

describe('pagination', () => {
  it('should fail when number page -1 ', () => {
    expect(
      () =>
        new Page<Asset>([], {
          totalElements: 3,
          pageOptions: new PageOptions(-1, 3),
        }),
    ).toThrow(new ArgumentInvalidException(`Invalid current page number`));
  });

  it('should fail when page size -1  ', () => {
    expect(
      () =>
        new Page<Asset>([], {
          totalElements: 3,
          pageOptions: new PageOptions(2, -1),
        }),
    ).toThrow(new ArgumentInvalidException(`Invalid page size`));
  });

  it('should fail when page size  is 0', () => {
    expect(
      () =>
        new Page<Asset>([], {
          totalElements: 3,
          pageOptions: new PageOptions(2, 0),
        }),
    ).toThrow(new ArgumentInvalidException(`Invalid page size`));
  });

  it('should create page', () => {
    const page = new Page<Asset>([], {
      totalElements: 3,
      pageOptions: new PageOptions(2, 1),
    });
    expect(page.currentPageNumber).toEqual(2);
    expect(page.pageSize).toEqual(1);
    expect(page.totalElements).toEqual(3);
  });
});
