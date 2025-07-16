import {ComponentType} from 'react';

import type {TemplateProps} from '../types';
import type {Meta} from '../types/templates';
import {formatComponentCode} from '../utils/templates';

import {About1, about1Demo, about1Meta} from './about-1';
import {Clients1, clients1Demo, clients1Meta} from './clients-1';
import {Contact4, contact4Demo, contact4Meta} from './contacts-4';
import {CTA1, cta1Demo, cta1Meta} from './cta-1';
import {Footer1, footer1Demo, footer1Meta} from './footer-1';
import {Hero1, hero1Demo, hero1Meta} from './hero-1';
import {Navbar1, navbar1Demo, navbar1Meta} from './navbar-1';
import {
  PageProgress1,
  pageProgress1Demo,
  pageProgress1Meta,
} from './page-progress-1';
import {Pricing1, pricing1Demo, pricing1Meta} from './pricing-1';
import {Process1, process1Demo, process1Meta} from './process-1';
import {Services1, services1Demo, services1Meta} from './services-1';
import {Services2, services2Demo, services2Meta} from './services-2';
import {
  SidebarMenu1,
  sidebarMenu1Demo,
  sidebarMenu1Meta,
} from './sidebar-menu-1';
import {Team1, team1Demo, team1Meta} from './team-1';
import {
  Testimonial1,
  testimonial1Demo,
  testimonial1Meta,
} from './testimonial-1';
import {Wiki1, wiki1Demo, wiki1Meta} from './wiki-1';

const componentMap: Record<string, ComponentType<TemplateProps>> = {
  [about1Meta.code]: About1,
  [hero1Meta.code]: Hero1,
  [pageProgress1Meta.code]: PageProgress1,
  [services1Meta.code]: Services1,
  [cta1Meta.code]: CTA1,
  [process1Meta.code]: Process1,
  [team1Meta.code]: Team1,
  [services2Meta.code]: Services2,
  [testimonial1Meta.code]: Testimonial1,
  [pricing1Meta.code]: Pricing1,
  [contact4Meta.code]: Contact4,
  [clients1Meta.code]: Clients1,
  [navbar1Meta.code]: Navbar1,
  [footer1Meta.code]: Footer1,
  [wiki1Meta.code]: Wiki1,
  [sidebarMenu1Meta.code]: SidebarMenu1,
};

export const ComponentMap = Object.fromEntries(
  Object.entries(componentMap).map(([key, value]) => [
    formatComponentCode(key),
    value,
  ]),
) as Record<string, ComponentType<TemplateProps>>;

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

export const demos = [
  {meta: about1Meta, data: about1Demo},
  {meta: hero1Meta, data: hero1Demo},
  {meta: services1Meta, data: services1Demo},
  {meta: cta1Meta, data: cta1Demo},
  {meta: process1Meta, data: process1Demo},
  {meta: team1Meta, data: team1Demo},
  {meta: services2Meta, data: services2Demo},
  {meta: testimonial1Meta, data: testimonial1Demo},
  {meta: pricing1Meta, data: pricing1Demo},
  {meta: contact4Meta, data: contact4Demo},
  {meta: clients1Meta, data: clients1Demo},
  {meta: pageProgress1Meta, data: pageProgress1Demo},
  {meta: footer1Meta, data: footer1Demo},
  {meta: sidebarMenu1Meta, data: sidebarMenu1Demo},
  {meta: navbar1Meta, data: navbar1Demo},
  {meta: wiki1Meta, data: wiki1Demo},
];
