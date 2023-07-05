const productsRoot = '/products';
export const routesV1 = {
  version: 'v1',
  product: {
    root: productsRoot,
    resourceById: `${productsRoot}/:id`,
    reject: `${productsRoot}/:id/reject`,
    approve: `${productsRoot}/:id/approve`
  }
};
