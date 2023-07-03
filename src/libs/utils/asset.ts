export function getMaximumImageCount(): number {
  return parseInt(process.env.MAXIMUM_IMAGES_COUNT || '5', 10);
}
