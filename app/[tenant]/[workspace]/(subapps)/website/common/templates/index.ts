import {ComponentType} from 'react';

import type {TemplateProps} from '../types';
import type {Meta} from '../types/templates';

import {About1, about1Meta} from './about-1';
import {Hero1, hero1Meta} from './hero-1';
import {PageProgress1, pageProgress1Meta} from './page-progress-1';
import {Services1, services1Meta} from './services-1';
import {CTA1, cta1Meta} from './cta-1';
import {Process1, process1Meta} from './process-1';
import {Team1, team1Meta} from './team-1';
import {Services2, services2Meta} from './services-2';
import {Testimonial1, testimonial1Meta} from './testimonial-1';
import {Pricing1, pricing1Meta} from './pricing-1';
import {Contact4, contact4Meta} from './contacts-4';
import {Clients1, clients1Meta} from './clients-1';
import {Navbar1, navbar1Meta} from './navbar-1';
import {Wiki1, wiki1Meta} from './wiki-1';
import {SidebarMenu1, sidebarMenu1Meta} from './sidebar-menu-1';
import {Footer1, footer1Meta} from './footer-1';

export const ComponentMap: Record<string, ComponentType<TemplateProps>> = {
  [about1Meta.name]: About1,
  [hero1Meta.name]: Hero1,
  [pageProgress1Meta.name]: PageProgress1,
  [services1Meta.name]: Services1,
  [cta1Meta.name]: CTA1,
  [process1Meta.name]: Process1,
  [team1Meta.name]: Team1,
  [services2Meta.name]: Services2,
  [testimonial1Meta.name]: Testimonial1,
  [pricing1Meta.name]: Pricing1,
  [contact4Meta.name]: Contact4,
  [clients1Meta.name]: Clients1,
  [navbar1Meta.name]: Navbar1,
  [footer1Meta.name]: Footer1,
  [wiki1Meta.name]: Wiki1,
  [sidebarMenu1Meta.name]: SidebarMenu1,
};

export const metas: Meta[] = [
  about1Meta,
  hero1Meta,
  pageProgress1Meta,
  services1Meta,
  cta1Meta,
  process1Meta,
  team1Meta,
  services2Meta,
  testimonial1Meta,
  pricing1Meta,
  contact4Meta,
  clients1Meta,
  navbar1Meta,
  footer1Meta,
  wiki1Meta,
  sidebarMenu1Meta,
];
