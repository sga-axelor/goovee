import {ComponentType} from 'react';

import type {TemplateProps} from '../types';
import {formatComponentCode} from '../utils/templates';

import {About1, about1Demos, about1Meta} from './about-1';
import {Clients1, clients1Demos, clients1Meta} from './clients-1';
import {Contact4, contact4Demos, contact4Meta} from './contacts-4';
import {CTA1, cta1Demos, cta1Meta} from './cta-1';
import {Footer1, footer1Demos, footer1Meta} from './footer-1';
import {Hero1, hero1Demos, hero1Meta} from './hero-1';
import {Navbar1, navbar1Demos, navbar1Meta} from './navbar-1';
import {
  PageProgress1,
  pageProgress1Demos,
  pageProgress1Meta,
} from './page-progress-1';
import {Pricing1, pricing1Demos, pricing1Meta} from './pricing-1';
import {Process1, process1Demos, process1Meta} from './process-1';
import {Services1, services1Demos, services1Meta} from './services-1';
import {Services2, services2Demos, services2Meta} from './services-2';
import {
  SidebarMenu1,
  sidebarMenu1Demos,
  sidebarMenu1Meta,
} from './sidebar-menu-1';
import {Team1, team1Demos, team1Meta} from './team-1';
import {
  Testimonial1,
  testimonial1Demos,
  testimonial1Meta,
} from './testimonial-1';
import {Wiki1, wiki1Demos, wiki1Meta} from './wiki-1';

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

export const demos = [
  {meta: about1Meta, demos: about1Demos},
  {meta: hero1Meta, demos: hero1Demos},
  {meta: services1Meta, demos: services1Demos},
  {meta: cta1Meta, demos: cta1Demos},
  {meta: process1Meta, demos: process1Demos},
  {meta: team1Meta, demos: team1Demos},
  {meta: services2Meta, demos: services2Demos},
  {meta: testimonial1Meta, demos: testimonial1Demos},
  {meta: pricing1Meta, demos: pricing1Demos},
  {meta: contact4Meta, demos: contact4Demos},
  {meta: clients1Meta, demos: clients1Demos},
  {meta: pageProgress1Meta, demos: pageProgress1Demos},
  {meta: footer1Meta, demos: footer1Demos},
  {meta: sidebarMenu1Meta, demos: sidebarMenu1Demos},
  {meta: navbar1Meta, demos: navbar1Demos},
  {meta: wiki1Meta, demos: wiki1Demos},
];
