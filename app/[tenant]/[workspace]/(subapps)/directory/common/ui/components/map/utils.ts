export function calculateZoom({
  mapWidth,
  mapHeight,
  minLat,
  maxLat,
  minLng,
  maxLng,
}: {
  mapWidth: number;
  mapHeight: number;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}): number {
  const WORLD_DIM = {width: 256, height: 256}; // World dimensions at zoom level 0
  const ZOOM_MAX = 15; // Maximum allowed zoom level (maximum possible is 21)

  const latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;
  const lngDiff = maxLng - minLng;
  const lngFraction = lngDiff < 0 ? (lngDiff + 360) / 360 : lngDiff / 360;

  const latZoom = Math.floor(
    Math.log(mapHeight / WORLD_DIM.height / latFraction) / Math.LN2,
  );
  const lngZoom = Math.floor(
    Math.log(mapWidth / WORLD_DIM.width / lngFraction) / Math.LN2,
  );

  return Math.min(latZoom, lngZoom, ZOOM_MAX);

  function latRad(lat: number) {
    const sin = Math.sin((lat * Math.PI) / 180);
    return Math.log((1 + sin) / (1 - sin)) / 2;
  }
}

export function calculateZoom2({
  mapWidth,
  mapHeight,
  minLat,
  maxLat,
  minLng,
  maxLng,
}: {
  mapWidth: number;
  mapHeight: number;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}) {
  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;

  const MAX_ZOOM = 15;

  const latZoom = zoomLevel(latSpan, mapHeight, 256); // Default: 256 (tile size at zoom 0)
  const lngZoom = zoomLevel(lngSpan, mapWidth, 256); // Default: 256 (tile size at zoom 0)

  return Math.min(latZoom, lngZoom, MAX_ZOOM);

  function zoomLevel(span: number, mapDim: number, worldDim: number) {
    return Math.floor(Math.log2((worldDim * mapDim) / (span * 360)));
  }
}
