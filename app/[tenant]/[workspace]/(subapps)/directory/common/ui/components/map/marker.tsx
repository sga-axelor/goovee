import {
  InfoWindow,
  Marker as MarkerComponent,
  useMarkerRef,
} from '@vis.gl/react-google-maps';
import {useCallback, useState} from 'react';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {Cloned} from '@/types/util';

import type {Entry, ListEntry} from '../../../types';
import {Card} from '../card';

type MarkerProps = {
  small: boolean;
  item: Cloned<Entry> | Cloned<ListEntry>;
};

export function Marker(props: MarkerProps) {
  const {small, item} = props;
  const {workspaceURI, tenant} = useWorkspace();

  const url = `${workspaceURI}/directory/entry/${item.id}`;
  const [markerRef, marker] = useMarkerRef();

  const [show, setShow] = useState(false);
  const toggle = useCallback(() => setShow(show => !show), []);
  const handleClose = useCallback(() => setShow(false), []);

  return (
    <>
      <MarkerComponent
        ref={markerRef}
        position={{
          lat: Number(item.address?.latit || 0),
          lng: Number(item.address?.longit || 0),
        }}
        onClick={toggle}
      />
      {show && (
        <InfoWindow anchor={marker} onClose={handleClose} headerDisabled>
          <Card item={item} url={url} small={small} tenant={tenant} />
        </InfoWindow>
      )}
    </>
  );
}
