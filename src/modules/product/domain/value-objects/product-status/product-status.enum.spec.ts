import { ArgumentInvalidException } from '@libs/exceptions/argument-invalid.exception';
import {
  ProductStatus,
  toEnum,
} from '@modules/product/domain/value-objects/product-status/product-status.enum';

describe('Product status type conversion to enum', () => {
  it('should return an error if string value is not valid', () => {
    // given
    const value = 'invalid_product_status';

    // when
    const toEnumInvocation = () => {
      toEnum(value);
    };

    // then
    expect(toEnumInvocation).toThrow(ArgumentInvalidException);
  });

  it('should return valid enum value', () => {
    // given
    const value = 'rejected';

    // when
    const type = toEnum(value);

    // then
    expect(type).toEqual(ProductStatus.REJECTED);
  });
});
