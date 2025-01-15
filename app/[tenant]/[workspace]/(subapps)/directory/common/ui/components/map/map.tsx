'use client';
import {RESPONSIVE_SIZES} from '@/constants';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {useCallback, useMemo, useState} from 'react';
import {Map as GoogleMap} from './google-map';
import {Map as OpenMap} from './open-map';
import type {MapProps} from './types';
import {calculateZoom} from './utils';

const MAP_HEIGHT = 320; // h-80
const MAP_WIDTH = 384; // w-96

export function Map(props: MapProps) {
  const isGoogleMap = false;

  const {className, showExpand, entries} = props;
  const [expand, setExpand] = useState(false);
  const mapEntries = useMemo(
    () => entries.filter(x => x.address?.longit && x.address?.latit && x.isMap),
    [entries],
  );
  const res = useResponsive();
  const small = RESPONSIVE_SIZES.some(x => res[x]);
  const full = small || expand;

  const {defaultCenter, defaultZoom} = useMemo(() => {
    const lats = mapEntries.map(entry => Number(entry.address?.latit));
    const lngs = mapEntries.map(entry => Number(entry.address?.longit));

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const defaultCenter = {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    };

    const defaultZoom = calculateZoom({
      mapWidth: MAP_WIDTH,
      mapHeight: MAP_HEIGHT,
      minLat,
      maxLat,
      minLng,
      maxLng,
    });

    return {defaultCenter, defaultZoom};
  }, [mapEntries]);

  const mapClassName = useMemo(
    () =>
      cn(
        'relative',
        // NOTE: expand class is applied when the map is expanded and when it is in mobile view
        full ? 'expand h-[min(45rem,80dvh)] w-full' : 'h-80 w-96',
        className,
      ),
    [full, className],
  );

  const toggleExpand = useCallback(() => {
    setExpand(expand => !expand);
  }, []);

  if (!mapEntries.length) return <div className={cn(full && 'expand')} />; // NOTE: expand class is used make the parent parent component flex column

  const Map = isGoogleMap ? GoogleMap : OpenMap;
  return (
    <Map
      className={mapClassName}
      items={mapEntries}
      zoom={defaultZoom}
      center={defaultCenter}
      expand={expand}
      showExpand={!!showExpand}
      toggleExpand={toggleExpand}
      small={small}
    />
  );
}
