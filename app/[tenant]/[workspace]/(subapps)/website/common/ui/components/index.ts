import {ComponentType} from 'react';

import {Test} from './test';
import type {TemplateProps} from '../../types';

export {NotFound} from './not-found';

export const ComponentMap: Record<string, ComponentType<TemplateProps>> = {
  test: Test,
};
