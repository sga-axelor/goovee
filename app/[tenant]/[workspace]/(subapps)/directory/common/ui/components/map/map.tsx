'use client';
import {APIProvider, Map as GMap} from '@vis.gl/react-google-maps';
import {useMemo, useState} from 'react';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {RESPONSIVE_SIZES} from '@/constants';
import {Cloned} from '@/types/util';
import {Button} from '@/ui/components';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';

import type {Entry, ListEntry} from '../../../orm';
import {Marker} from './marker';
import {calculateZoom} from './utils';

type MapProps = {
  className?: string;
  showExpand?: boolean;
  entries: Cloned<Entry>[] | Cloned<ListEntry>[];
};

export function Map(props: MapProps) {
  return (
    <APIProvider apiKey="">
      <MapContent {...props} />
    </APIProvider>
  );
}

const MAP_HEIGHT = 320; // h-80
const MAP_WIDTH = 384; // w-96

function MapContent(props: MapProps) {
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

  const Icon = expand ? MdCloseFullscreen : MdOpenInFull;

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

  if (!mapEntries.length) return <div className={cn(full && 'expand')} />; // NOTE: expand class is used make the parent parent component flex column
  return (
    <GMap
      className={mapClassName}
      reuseMaps={true}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      gestureHandling="greedy"
      disableDefaultUI={true}>
      {showExpand && !small && (
        <Button
          variant="ghost"
          className="bg-accent absolute top-2 right-2"
          onClick={() => setExpand(expand => !expand)}>
          <Icon size={18} />
        </Button>
      )}
      {mapEntries?.map(item => {
        return <Marker key={item.id} small={small || !expand} item={item} />;
      })}
    </GMap>
  );
}
