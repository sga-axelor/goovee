import {
  InfoWindow,
  Marker as MarkerComponent,
  useMarkerRef,
} from '@vis.gl/react-google-maps';
import {useCallback, useState} from 'react';

import {LatLng} from './types';
import {Category} from '../directory-list';

const category = [{name: 'service'}, {name: 'industry'}, {name: 'wholesale'}];

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
          <div className="flex bg-card rounded-lg gap-5" key="">
            <div className="p-3 space-y-2">
              {category.map((item, index) => (
                <Category
                  name={item?.name}
                  key={index}
                  className="me-3"
                  variant={item?.name}
                />
              ))}

              <h4 className="font-semibold">Entry Name</h4>
              <p className="text-success text-sm"> 43 Mainstreet - London</p>
              <p className="text-xs">
                Lorem ipsum dolor sit amet consectetur. Neque diam integer purus
                aenean porttitor morbi. Turpis.
              </p>
            </div>
            <div className="bg-yellow-200 w-[150px] h-[153px] rounded-r-lg"></div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
