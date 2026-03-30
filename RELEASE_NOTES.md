# 1.6.1 (2026-03-30)

## Features

### Core Platform

- Improve Stripe bank transfer reconciliation – #110211
  <details>
    <summary>Details</summary>

  Improved Stripe invoice bank transfer handling by retrying transient webhook failures, reconciling payment state through webhook and SSE updates, and cleaning up stale pending bank transfer intents after successful payments or customer balance auto-payment.
  </details>

### Invoices

- Improve Stripe bank transfer reconciliation – #110211
  <details>
    <summary>Details</summary>

  Improved Stripe invoice bank transfer handling by retrying transient webhook failures, reconciling payment state through webhook and SSE updates, and cleaning up stale pending bank transfer intents after successful payments or customer balance auto-payment.
  </details>
