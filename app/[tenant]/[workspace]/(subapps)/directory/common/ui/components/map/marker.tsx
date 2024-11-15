import {
  InfoWindow,
  Marker as MarkerComponent,
  useMarkerRef,
} from '@vis.gl/react-google-maps';
import {useCallback, useState} from 'react';

import {LatLng} from './types';

export function Marker({position}: {position: LatLng}) {
  const [markerRef, marker] = useMarkerRef();

  const [show, setShow] = useState(false);
  const toggle = useCallback(() => setShow(show => !show), []);
  const handleClose = useCallback(() => setShow(false), []);

  return (
    <>
      <MarkerComponent ref={markerRef} position={position} onClick={toggle} />
      {show && (
        <InfoWindow
          anchor={marker}
          onClose={handleClose}
          headerDisabled
          headerContent={<span>show me header</span>}>
          show me this
        </InfoWindow>
      )}
    </>
  );
}
