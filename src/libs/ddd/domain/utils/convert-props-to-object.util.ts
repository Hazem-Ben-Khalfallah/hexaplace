/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { ValueObject } from '@libs/ddd/domain/base-classes/value-object.base';

function convertToPlainObject(item: any): any {
  if (item && ValueObject.isValueObject(item)) {
    return item.getRawProps();
  }
  return item;
}

/**
 * Converts Entity/Value Objects props to a plain object.
 * Useful for testing and debugging.
 * @param props
 */
export function convertPropsToObject(props: any): any {
  const propsCopy = { ...props };

  // eslint-disable-next-line guard-for-in
  for (const prop in propsCopy) {
    propsCopy[prop] = convertToPlainObject(propsCopy[prop]);
  }

  return propsCopy;
}
