'use client';
import {
  APIProvider,
  Map as GMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {useEffect, useMemo, useState} from 'react';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {i18n} from '@/lib/core/i18n';
import {Cloned} from '@/types/util';
import {Button} from '@/ui/components';
import {Skeleton} from '@/ui/components/skeleton';
import {useResponsive, useToast} from '@/ui/hooks';
import {cn} from '@/utils/css';

import type {Entry, ListEntry} from '../../../orm';
import {Marker} from './marker';
import {LatLng} from './types';

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
  const [loading, setLoading] = useState(true);
  const [latLngs, setLatLngs] = useState<LatLng[]>([]);
  const {toast} = useToast();
  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);
  const full = small || expand;

  const Icon = expand ? MdCloseFullscreen : MdOpenInFull;

  const geocodingLib = useMapsLibrary('geocoding');
  const geocoder = useMemo(
    () => geocodingLib && new geocodingLib.Geocoder(),
    [geocodingLib],
  );

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

  // useEffect(() => {
  //   async function init() {
  //     if (!geocoder || !entries) {
  //       setLoading(false);
  //       return;
  //     }
  //
  //     //TODO: this is untested, re implement once api key is provided
  //     // cahce the response instead of making a new request everytime
  //     // a call back can provided instead of awaiting the promise
  //     // check if multiple addresses can be provided at once,
  //     const resPromises = entries.map(entry => {
  //       return geocoder.geocode({address: entry?.address});
  //     });
  //     setLoading(true);
  //     try {
  //       const res = await Promise.all(resPromises);
  //       // TODO: handle race conditions
  //       setLatLngs(
  //         res
  //           .map((x, i) => {
  //             if (!x.results[0].geometry.location) return null;
  //             return {
  //               id: entries[i].id,
  //               lat: x.results[0].geometry.location.lat(),
  //               lng: x.results[0].geometry.location.lng(),
  //             };
  //           })
  //           .filter(Boolean) as LatLng[],
  //       );
  //     } catch (e) {
  //       toast({
  //         variant: 'destructive',
  //         title:
  //           e instanceof Error ? e.message : i18n.get('Something went wrong'),
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   init();
  // }, [geocoder, entries, toast]);
  //
  // if (loading) return <Skeleton className={mapClassName} />;
  // if (!latLngs.length) return <div className={cn(full && 'expand')} />; // NOTE: expand class is used make the parent parent component flex column
  return (
    <GMap
      className={mapClassName}
      reuseMaps={true}
      // defaultCenter={{lat: latLngs[0].lat, lng: latLngs[0].lng}}
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
      {/* {latLngs?.map((latLng, index) => { */}
      {/*   const item = entries?.find(x => x.id === latLng.id); */}
      {/*   if (!item) return null; */}
      {/*   return ( */}
      {/*     <Marker */}
      {/*       position={latLng} */}
      {/*       key={index} */}
      {/*       small={small || !expand} */}
      {/*       item={item} */}
      {/*     /> */}
      {/*   ); */}
      {/* })} */}
    </GMap>
  );
}
