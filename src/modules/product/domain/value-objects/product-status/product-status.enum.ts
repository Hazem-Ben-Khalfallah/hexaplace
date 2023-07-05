import { ArgumentInvalidException } from '@libs/exceptions/argument-invalid.exception';

export enum ProductStatus {
  DRAFT = 'product_draft',
  APPROVED = 'product_approved',
  REJECTED = 'product_rejected',
  DELETED = 'product_deleted',
}

const ENUM_AS_MAP = new Map<string, ProductStatus>(
  Object.entries(ProductStatus).map(([, value]: [string, ProductStatus]) => [
    value,
    value,
  ]),
);

export function toEnum(value: string): ProductStatus {
  const enumType = ENUM_AS_MAP.get(value);
  if (!enumType) {
    throw new ArgumentInvalidException(
      `Invalid enum value "${value}". Valid values should be in [${Array.from(
        ENUM_AS_MAP.keys(),
      )}]`,
    );
  }
  return enumType;
}
