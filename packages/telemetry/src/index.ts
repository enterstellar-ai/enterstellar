/**
 * @module @enterstellar/telemetry
 * @description ForgeSignal collection, queuing, and upload. Zero-PII telemetry for the Forge.
 *
 * This is the public API barrel for `@enterstellar/telemetry`. Consumers import
 * from `@enterstellar/telemetry` — internal modules are not part of the public API.
 *
 * **Quick Start:**
 * ```ts
 * import { createTelemetryCollector } from '@enterstellar/telemetry';
 *
 * const telemetry = await createTelemetryCollector({
 *   platform: 'web',
 *   registrySize: 42,
 * });
 *
 * // Called automatically by @enterstellar/compiler and @enterstellar/react (TL1).
 * telemetry.record({ ... });
 *
 * // On shutdown:
 * await telemetry.dispose();
 * ```
 *
 * @see Bible §4.12
 * @see Design Choices TL1–TL12
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
export { createTelemetryCollector } from './create-telemetry.js';

// ---------------------------------------------------------------------------
// Types (re-exported for consumer use)
// ---------------------------------------------------------------------------
export type {
  TelemetryCollector,
  TelemetryConfig,
  TelemetryStats,
  FlushResult,
  ForgeSignalInput,
} from './types.js';
