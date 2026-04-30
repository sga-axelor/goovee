# 1.7.0 (2026-04-30)

## Features

### Core Platform

- Add PWA support and real-time push notifications – #107259
  <details>
    <summary>Details</summary>

  Implemented PWA via Serwist with asset precaching and stale-while-revalidate caching. Added a web push notification system covering registrations, tickets, forum posts, comments, replies, quotations, news, and invoice payments. Includes a /notifications center, multi-device sync, auto-healing on permission grant, and notification grouping via tags.
  </details>

- Support configurable HUB PISP transfer types – #111746
  <details>
    <summary>Details</summary>

  HUB PISP payments can now be restricted to Instant (SCTInst), Standard (SCT), or both via a new transferTypeSelect config. The UI shows only the allowed transfer tiles and the server rejects requests for transfer types that are not allowed.
  </details>

## Fixes

### Core Platform

- Avoid duplicate and oversized avatar image fetches – #111925
  <details>
    <summary>Details</summary>

  Avatars were downloaded twice (Radix preload + next/image) and at the largest configured width. AvatarImage now serves a single, properly-sized optimized variant.
  </details>

- Properly log out user if account is missing – #111185
  <details>
    <summary>Details</summary>

  Automatically clear the session and log out the user if their account is no longer found in the system.
  </details>

## Changes

### Core Platform

- General improvements across authentication, core, events, forum, orders, and translations – #111787
  <details>
    <summary>Details</summary>

  Refactored ORM functions to pass resolved Client/Tenant instead of tenantId, validated auth and account actions with Zod, cached locale translations in the service worker, upgraded Next.js to 16.2.4 with TypeScript 6.0, replaced lodash with lodash-es. Fixed auth error handling, Google OAuth redirection, service worker caching scope, locale initialisation, React hook dependencies in forum and events, and missing/incorrect translations. Migrated Avatar and other image components to next/image with proper alt attributes.
  </details>

### Events

- General improvements across authentication, core, events, forum, orders, and translations – #111787
  <details>
    <summary>Details</summary>

  Refactored ORM functions to pass resolved Client/Tenant instead of tenantId, validated auth and account actions with Zod, cached locale translations in the service worker, upgraded Next.js to 16.2.4 with TypeScript 6.0, replaced lodash with lodash-es. Fixed auth error handling, Google OAuth redirection, service worker caching scope, locale initialisation, React hook dependencies in forum and events, and missing/incorrect translations. Migrated Avatar and other image components to next/image with proper alt attributes.
  </details>

### Forum

- General improvements across authentication, core, events, forum, orders, and translations – #111787
  <details>
    <summary>Details</summary>

  Refactored ORM functions to pass resolved Client/Tenant instead of tenantId, validated auth and account actions with Zod, cached locale translations in the service worker, upgraded Next.js to 16.2.4 with TypeScript 6.0, replaced lodash with lodash-es. Fixed auth error handling, Google OAuth redirection, service worker caching scope, locale initialisation, React hook dependencies in forum and events, and missing/incorrect translations. Migrated Avatar and other image components to next/image with proper alt attributes.
  </details>

### Orders

- General improvements across authentication, core, events, forum, orders, and translations – #111787
  <details>
    <summary>Details</summary>

  Refactored ORM functions to pass resolved Client/Tenant instead of tenantId, validated auth and account actions with Zod, cached locale translations in the service worker, upgraded Next.js to 16.2.4 with TypeScript 6.0, replaced lodash with lodash-es. Fixed auth error handling, Google OAuth redirection, service worker caching scope, locale initialisation, React hook dependencies in forum and events, and missing/incorrect translations. Migrated Avatar and other image components to next/image with proper alt attributes.
  </details>
