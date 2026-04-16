# 1.6.4 (2026-04-16)

## Features

### Core Platform

- Forward Up2Pay IPN callback to legacy ERP when invoice is unknown – #110472
  <details>
    <summary>Details</summary>

  Add automatic forwarding of unrecognized Up2Pay IPNs to the legacy system (Consonance Web) via a new UP2PAY_LEGACY_FORWARD_URL environment variable, while preserving normal processing for recognized payments.
  </details>

### Invoices

- Forward Up2Pay IPN callback to legacy ERP when invoice is unknown – #110472
  <details>
    <summary>Details</summary>

  Add automatic forwarding of unrecognized Up2Pay IPNs to the legacy system (Consonance Web) via a new UP2PAY_LEGACY_FORWARD_URL environment variable, while preserving normal processing for recognized payments.
  </details>
