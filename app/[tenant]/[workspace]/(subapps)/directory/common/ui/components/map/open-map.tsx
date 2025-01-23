'use client';
import L from 'leaflet';
import {memo, useLayoutEffect, useRef} from 'react';
import ReactDOM from 'react-dom/client';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

import {Card} from '../card';
import {MapContentProps} from './types';

import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet/dist/leaflet.css';

export const Map = memo((props: MapContentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const {className, center, zoom, items, small} = props;
  const {workspaceURI, tenant} = useWorkspace();

  useLayoutEffect(() => {
    if (!mapRef.current) return;
    const map = new L.Map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom,
    });
    // add tile layer with attribution. Without tile layer, the map will not be displayed
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    items?.forEach(item => {
      const url = `${workspaceURI}/directory/entry/${item.id}`;
      const popup = document.createElement('div');
      ReactDOM.createRoot(popup).render(
        <Card item={item} url={url} small={small} tenant={tenant} />,
      );
      L.marker([Number(item.address?.latit), Number(item.address?.longit)])
        .addTo(map)
        .bindPopup(popup, {
          ...(!small && {minWidth: 500}),
          className: '[&_.leaflet-popup-content]:m-0',
        });
    });

    return () => {
      map.off();
      map.remove();
    };
    //NOTE: className is added to trigger a re-render if it affects the map's dimensions.
  }, [zoom, center, items, workspaceURI, tenant, small, className]);

  return <div ref={mapRef} className={className} />;
});

Map.displayName = 'Map';
