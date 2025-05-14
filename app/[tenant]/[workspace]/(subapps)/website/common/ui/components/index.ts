import {ComponentType} from 'react';

import type {TemplateProps} from '../../types';

import {Hero1} from './hero-1';
import {PageProgress} from './page-progress';
import {Services1} from './services-1';
import {CTA1} from './cta-1';
import {Process1} from './process-1';
import {About1} from './about-1';
import {Team1} from './team-1';
import {Services2} from './services-2';
import {Testimonial1} from './testimonial-1';
import {Pricing1} from './pricing-1';
import {Contacts4} from './contacts-4';
import {Clients1} from './clients-1';

export const ComponentMap: Record<string, ComponentType<TemplateProps>> = {
  'page-progress': PageProgress,
  'hero-1': Hero1,
  'services-1': Services1,
  'cta-1': CTA1,
  'process-1': Process1,
  'about-1': About1,
  'team-1': Team1,
  'services-2': Services2,
  'testimonial-1': Testimonial1,
  'pricing-1': Pricing1,
  'contacts-4': Contacts4,
  'clients-1': Clients1,
};

export {NotFound} from './not-found';
