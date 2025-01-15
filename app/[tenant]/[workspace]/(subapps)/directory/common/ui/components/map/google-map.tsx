'use client';
import {APIProvider, Map as GMap} from '@vis.gl/react-google-maps';
import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';

import {Button} from '@/ui/components';

import {Marker} from './marker';
import {MapContentProps} from './types';

export function Map(props: MapContentProps) {
  return (
    <APIProvider apiKey="">
      <MapContent {...props} />
    </APIProvider>
  );
}

function MapContent(props: MapContentProps) {
  const {
    className,
    center,
    zoom,
    expand,
    showExpand,
    toggleExpand,
    items,
    small,
  } = props;

  const Icon = expand ? MdCloseFullscreen : MdOpenInFull;
  return (
    <GMap
      className={className}
      reuseMaps={true}
      defaultCenter={center}
      defaultZoom={zoom}
      gestureHandling="greedy"
      disableDefaultUI={true}>
      {showExpand && !small && (
        <Button
          variant="ghost"
          className="bg-accent absolute top-2 right-2"
          onClick={toggleExpand}>
          <Icon size={18} />
        </Button>
      )}
      {items?.map(item => {
        return <Marker key={item.id} small={small || !expand} item={item} />;
      })}
    </GMap>
  );
}
