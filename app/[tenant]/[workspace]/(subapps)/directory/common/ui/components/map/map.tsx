'use client';
import {APIProvider, Map as GMap} from '@vis.gl/react-google-maps';
import {useState} from 'react';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {Button} from '@/ui/components';
import {cn} from '@/utils/css';
import {Marker} from './marker';

const markers = [
  {lat: 48.85341, lng: 2.3488},
  {lat: 48.85671, lng: 2.4475},
  {lat: 48.80671, lng: 2.4075},
];

export function Map() {
  const [expand, setExpand] = useState(false);

  const Icon = expand ? MdCloseFullscreen : MdOpenInFull;
  return (
    <APIProvider apiKey="">
      <GMap
        className={cn(
          'relative',
          expand ? 'expand h-[45rem] w-full' : 'h-80 w-96',
        )}
        defaultCenter={{lat: 48.85341, lng: 2.3488}}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        <Button
          variant="ghost"
          className="bg-accent absolute top-2 right-2"
          onClick={() => setExpand(expand => !expand)}>
          <Icon size={18} />
        </Button>
        {markers.map((marker, index) => (
          <Marker position={marker} key={index} />
        ))}
      </GMap>
    </APIProvider>
  );
}
