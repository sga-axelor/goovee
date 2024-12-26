'use client';
import {APIProvider, Map as GMap} from '@vis.gl/react-google-maps';
import {useEffect, useMemo, useState} from 'react';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {Button} from '@/ui/components';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {useMapsLibrary} from '@vis.gl/react-google-maps';

import {AOSPortalDirectoryEntry} from '@/goovee/.generated/models';
import {Cloned} from '@/types/util';

type MapProps = {
  className?: string;
  showExpand?: boolean;
  locations?: Cloned<AOSPortalDirectoryEntry[]>;
};

export function Map(props: MapProps) {
  return (
    <APIProvider apiKey="">
      <MapContent {...props} />
    </APIProvider>
  );
}

function MapContent(props: MapProps) {
  const {className, showExpand, locations} = props;
  const [expand, setExpand] = useState(false);
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
      if (!geocoder) return;
      console.log({address: locations?.[0]?.address});
      const latLng = await geocoder.geocode({address: locations?.[0]?.address});
      console.log(latLng);
    }
    init();
  }, [geocoder, locations]);
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
      {/* {markers?.map((marker, index) => ( */}
      {/*   <Marker position={marker} key={index} small={small || !expand} /> */}
      {/* ))} */}
    </GMap>
  );
}
