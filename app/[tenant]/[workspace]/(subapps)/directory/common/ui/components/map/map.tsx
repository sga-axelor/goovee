'use client';
import {APIProvider, Map as GMap} from '@vis.gl/react-google-maps';
import {useMemo, useState} from 'react';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {Cloned} from '@/types/util';
import {Button} from '@/ui/components';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';

import type {Entry, ListEntry} from '../../../orm';
import {Marker} from './marker';

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

function MapContent(props: MapProps) {
  const {className, showExpand, entries} = props;
  const [expand, setExpand] = useState(false);
  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);
  const full = small || expand;

  const defaultCenter = useMemo(
    () => ({
      lat: Number(entries[0]?.address?.latit || 0),
      lng: Number(entries[0]?.address?.longit || 0),
    }),
    [entries],
  );

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

  // if (loading) return <Skeleton className={mapClassName} />;
  if (!entries.length) return <div className={cn(full && 'expand')} />; // NOTE: expand class is used make the parent parent component flex column
  return (
    <GMap
      className={mapClassName}
      reuseMaps={true}
      defaultCenter={defaultCenter}
      defaultZoom={10}
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
      {entries?.map((item, index) => {
        if (!item.address?.longit || !item.address?.latit) return null;
        return <Marker key={index} small={small || !expand} item={item} />;
      })}
    </GMap>
  );
}
