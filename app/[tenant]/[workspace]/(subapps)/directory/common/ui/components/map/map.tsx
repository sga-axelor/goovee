'use client';
import dynamic from 'next/dynamic';
import {useCallback, useMemo, useState} from 'react';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {RESPONSIVE_SIZES} from '@/constants';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {Button} from '@/ui/components';
import {Skeleton} from '@/ui/components/skeleton';

import type {MapProps} from './types';
import {calculateZoom} from './utils';

const MAP_HEIGHT = 320; // h-80
const MAP_WIDTH = 384; // w-96

const GoogleMap = dynamic(() => import('./google-map').then(mod => mod.Map), {
  ssr: false,
  loading: MapSkeleton,
});

const OpenMap = dynamic(() => import('./open-map').then(mod => mod.Map), {
  ssr: false,
  loading: MapSkeleton,
});

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

  const toggleExpand = useCallback(() => {
    setExpand(expand => !expand);
  }, []);

  const MapComponent = isGoogleMap ? GoogleMap : OpenMap;
  const Icon = expand ? MdCloseFullscreen : MdOpenInFull;
  return (
    // NOTE: expand class is applied when the map is expanded and when it is in mobile view
    <div className={cn('relative', full && 'expand')}>
      {!!mapEntries.length && (
        <>
          <MapComponent
            className={cn(
              full ? 'h-[min(45rem,80dvh)] w-full' : 'h-80 w-96',
              className,
            )}
            items={mapEntries}
            zoom={defaultZoom}
            center={defaultCenter}
            small={small || !expand}
          />
          {showExpand && !small && (
            <Button
              style={{zIndex: 10000}}
              variant="ghost"
              className="bg-accent absolute top-2 right-2"
              onClick={toggleExpand}>
              <Icon size={18} />
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function MapSkeleton() {
  return <Skeleton className="h-80 w-96" />;
}
