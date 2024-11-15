import {
  InfoWindow,
  Marker as MarkerComponent,
  useMarkerRef,
} from '@vis.gl/react-google-maps';
import {useCallback, useState} from 'react';

import {LatLng} from './types';

export function Marker({position}: {position: LatLng}) {
  // `markerRef` and `marker` are needed to establish the connection between
  const [markerRef, marker] = useMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown(isShown => !isShown),
    [],
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <MarkerComponent
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      />
      {infoWindowShown && (
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
