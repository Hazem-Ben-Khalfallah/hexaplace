const assetsRoot = '/assets';
export const routesV1 = {
  version: 'v1',
  asset: {
    root: assetsRoot,
    resourceById: `${assetsRoot}/:id`,
    reject: `${assetsRoot}/:id/reject`,
    approve: `${assetsRoot}/:id/approve`
  }
};
