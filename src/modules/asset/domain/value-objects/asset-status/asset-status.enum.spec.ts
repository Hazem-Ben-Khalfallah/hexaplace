import { ArgumentInvalidException } from '@libs/exceptions/argument-invalid.exception';
import {
  AssetStatus,
  toEnum,
} from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';

describe('Asset status type conversion to enum', () => {
  it('should return an error if string value is not valid', () => {
    // given
    const value = 'invalid_asset_status';

    // when
    const toEnumInvocation = () => {
      toEnum(value);
    };

    // then
    expect(toEnumInvocation).toThrow(ArgumentInvalidException);
  });

  it('should return valid enum value', () => {
    // given
    const value = 'product_rejected';

    // when
    const type = toEnum(value);

    // then
    expect(type).toEqual(AssetStatus.REJECTED);
  });
});
