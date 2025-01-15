import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

import {Card} from '../card';
import type {MapContentProps} from './types';

import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet/dist/leaflet.css';

export function Map(props: MapContentProps) {
  const {className, center, zoom, items, small} = props;
  const {workspaceURI, tenant} = useWorkspace();
  const key = className + center.lat + center.lng + zoom;

  return (
    <MapContainer
      key={key}
      className={className}
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items?.map(item => {
        const url = `${workspaceURI}/directory/entry/${item.id}`;
        return (
          <Marker
            key={item.id}
            position={[
              Number(item.address?.latit),
              Number(item.address?.longit),
            ]}>
            <Popup
              {...(!small && {minWidth: 500})}
              className="[&_.leaflet-popup-content]:m-0">
              <Card item={item} url={url} small={small} tenant={tenant} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
