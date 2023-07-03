import { ArgumentInvalidException } from '@libs/exceptions/argument-invalid.exception';

export enum AssetStatus {
  DRAFT = 'product_draft',
  APPROVED = 'product_approved',
  REJECTED = 'product_rejected',
  DELETED = 'product_deleted',
}

const ENUM_AS_MAP = new Map<string, AssetStatus>(
  Object.entries(AssetStatus).map(([, value]: [string, AssetStatus]) => [
    value,
    value,
  ]),
);

export function toEnum(value: string): AssetStatus {
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
