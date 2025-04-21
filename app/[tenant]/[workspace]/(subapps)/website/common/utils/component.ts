import dynamic from 'next/dynamic';

// ---- CORE IMPORTS ---- //
import {WebsiteComponent} from '@/types';

export function getWebsiteComponent(component: WebsiteComponent) {
  const {code, title} = component;
  const displayName = title || code;

  const Fallback = () => null;
  Fallback.displayName = displayName;

  if (!component?.code) {
    return Fallback;
  }

  return dynamic(
    () =>
      import('../ui/components').then((mod: any) => {
        let Component = mod?.ComponentMap?.[code];

        if (!Component) {
          return Fallback;
        }

        Component.displayName = displayName;
        return Component;
      }),
    {
      loading: () => null,
      ssr: false,
    },
  );
}
