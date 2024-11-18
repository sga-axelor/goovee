'use client';
import {APIProvider, Map as GMap} from '@vis.gl/react-google-maps';
import {useState} from 'react';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {Button} from '@/ui/components';
import {cn} from '@/utils/css';
import {Marker} from './marker';
import {LatLng} from './types';

type MapProps = {
  className?: string;
  showExpand?: boolean;
  markers?: LatLng[];
};

export function Map(props: MapProps) {
  const {className, showExpand, markers} = props;
  const [expand, setExpand] = useState(false);

  const Icon = expand ? MdCloseFullscreen : MdOpenInFull;
  return (
    <APIProvider apiKey="">
      <GMap
        className={cn(
          'relative',
          expand ? 'expand h-[45rem] w-full' : 'h-80 w-96',
          className,
        )}
        reuseMaps={true}
        defaultCenter={{lat: 48.85341, lng: 2.3488}}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        {showExpand && (
          <Button
            variant="ghost"
            className="bg-accent absolute top-2 right-2"
            onClick={() => setExpand(expand => !expand)}>
            <Icon size={18} />
          </Button>
        )}
        {markers?.map((marker, index) => (
          <Marker position={marker} key={index} />
        ))}
      </GMap>
    </APIProvider>
  );
}
