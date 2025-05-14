import dynamic from 'next/dynamic';
import {type ComponentType} from 'react';

// ---- CORE IMPORTS ---- //
import type {WebsiteComponent} from '@/types';

// ---- LOCAL IMPORTS ---- //
import type {TemplateProps} from '@/subapps/website/common/types';

export function getWebsiteComponent(
  component?: WebsiteComponent,
): ComponentType<TemplateProps> {
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
      import('../ui/components').then(mod => {
        let Component = mod?.ComponentMap?.[code];

        if (!Component) {
          return Fallback;
        }

        //TODO: figure out how to add this later
        // Component.displayName = displayName;
        return Component;
      }),
    {
      loading: () => null,
      ssr: false,
    },
  );
}
