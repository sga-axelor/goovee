# 1.6.5 (2026-04-27)

## Fixes

### Core Platform

- Fix Up2Pay IPN webhook intermittent signature verification failure – #111668
  <details>
    <summary>Details</summary>

  IPN callbacks could fail signature verification when parameter values contained characters encoded differently by Up2Pay's rules versus standard URL encoding.
  </details>
