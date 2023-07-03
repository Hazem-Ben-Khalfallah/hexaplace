/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Remove undefined properties from an object
 */
export function removeUndefinedProps(item: any): any {
  // TODO: make recursive for nested objects
  // eslint-disable-next-line no-param-reassign
  delete item.tenantId;
  const filtered: any = {};
  for (const key of Object.keys(item)) {
    if (item[key]) filtered[key] = item[key];
  }
  return filtered;
}
