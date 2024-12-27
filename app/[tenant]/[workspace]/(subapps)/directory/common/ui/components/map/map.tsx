'use client';
import {
  APIProvider,
  Map as GMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {useEffect, useMemo, useState} from 'react';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {Cloned} from '@/types/util';
import {Button} from '@/ui/components';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';

import type {Entry, ListEntry} from '../../../orm';
import {LatLng} from './types';
import {Marker} from './marker';

type MapProps = {
  className?: string;
  showExpand?: boolean;
  entries?: Cloned<Entry>[] | Cloned<ListEntry>[];
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
  const [latLngs, setLatLngs] = useState<LatLng[]>([]);
  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);
  const full = small || expand;

  const Icon = expand ? MdCloseFullscreen : MdOpenInFull;

  const geocodingLib = useMapsLibrary('geocoding');
  const geocoder = useMemo(
    () => geocodingLib && new geocodingLib.Geocoder(),
    [geocodingLib],
  );

  useEffect(() => {
    async function init() {
      if (!geocoder || !entries) return;
      const resPromises = entries.map(entry => {
        return geocoder.geocode({address: entry?.address});
      });
      const res = await Promise.all(resPromises);
      // TODO: handle race conditions
      setLatLngs(
        res.map((x, i) => ({
          id: entries[i].id,
          lat: x.results[0].geometry.location.lat(),
          lng: x.results[0].geometry.location.lng(),
        })),
      );
    }
    init();
  }, [geocoder, entries]);
  return (
    <GMap
      className={cn(
        'relative',
        full ? 'expand h-[min(45rem,80dvh)] w-full' : 'h-80 w-96',
        className,
      )}
      reuseMaps={true}
      defaultCenter={{lat: 48.85341, lng: 2.3488}}
      defaultZoom={10}
      gestureHandling={'greedy'}
      disableDefaultUI={true}>
      {showExpand && !small && (
        <Button
          variant="ghost"
          className="bg-accent absolute top-2 right-2"
          onClick={() => setExpand(expand => !expand)}>
          <Icon size={18} />
        </Button>
      )}
      {latLngs?.map((latLng, index) => {
        const item = entries?.find(x => x.id === latLng.id);
        if (!item) return null;
        return (
          <Marker
            position={latLng}
            key={index}
            small={small || !expand}
            item={item}
          />
        );
      })}
    </GMap>
  );
}
