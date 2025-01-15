import {MdCloseFullscreen, MdOpenInFull} from 'react-icons/md';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';

import {Button} from '@/ui/components';
import type {MapContentProps} from './types';

import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet/dist/leaflet.css';

export function Map(props: MapContentProps) {
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
  const key = className + center.lat + center.lng + zoom;

  const Icon = expand ? MdCloseFullscreen : MdOpenInFull;
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
      {showExpand && !small && (
        <Button
          style={{zIndex: 10000}}
          variant="ghost"
          className="bg-accent absolute top-2 right-2"
          onClick={toggleExpand}>
          <Icon size={18} />
        </Button>
      )}
      {items?.map(item => {
        return (
          <Marker
            key={item.id}
            position={[
              Number(item.address?.latit),
              Number(item.address?.longit),
            ]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
