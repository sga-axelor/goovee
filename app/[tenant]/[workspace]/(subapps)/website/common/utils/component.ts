import dynamic from 'next/dynamic';

// ---- CORE IMPORTS ---- //
import {WebsiteComponent} from '@/types';

export function getWebsiteComponent(component: WebsiteComponent): any {
  const Fallback = () => null;
  Fallback.displayName = 'ComponentFallback';

  if (!component?.code) {
    return Fallback;
  }

  const {code, title} = component;
  const displayName = title || code;
  Fallback.displayName = displayName;

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
