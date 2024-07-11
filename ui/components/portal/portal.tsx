'use client';

import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

export interface PortalProps {
  container?: Element | null | (() => Element | null);
  children?: React.ReactNode;
}

export function Portal({container = document.body, children}: PortalProps) {
  const [mountNode, setMountNode] = useState<Element | null>(null);
  useEffect(() => {
    let node = container;
    if (typeof container === 'function') {
      node = (container as Function)();
    }
    setMountNode(node);
  }, [container]);

  return mountNode ? createPortal(children, mountNode) : null;
}

export default Portal;
