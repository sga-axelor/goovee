import {
  InfoWindow,
  Marker as MarkerComponent,
  useMarkerRef,
} from '@vis.gl/react-google-maps';
import {useCallback, useState} from 'react';

import {LatLng} from './types';
import {Card} from '../card';

const item = {
  name: 'Entry Name',
  address: '43 Mainstreet - London',
  image: '',
  description:
    'Lorem ipsum dolor sit amet consectetur. Neque diam integer Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi veritatis ex labore illum quos dolores, nam optio consectetur odit. Minus facilis illo, consequuntur dolor nam illum facere velit? Ipsum, illo! purus aenean porttitor morbi. Turpis. ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
};

export function Marker({position}: {position: LatLng}) {
  const [markerRef, marker] = useMarkerRef();

  const [show, setShow] = useState(false);
  const toggle = useCallback(() => setShow(show => !show), []);
  const handleClose = useCallback(() => setShow(false), []);

  return (
    <>
      <MarkerComponent ref={markerRef} position={position} onClick={toggle} />
      {show && (
        <InfoWindow anchor={marker} onClose={handleClose} headerDisabled>
          <Card item={item} />
        </InfoWindow>
      )}
    </>
  );
}
