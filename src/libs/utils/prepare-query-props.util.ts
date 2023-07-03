/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { removeUndefinedProps } from '@libs/utils/remove-undefined-props.util';

/**
 * Remove undefined properties from an object
 */
export function prepareQueryProps(item: any): any {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tenantId, ...itemsWithoutTenantId } = item;

  return removeUndefinedProps(itemsWithoutTenantId);
}
