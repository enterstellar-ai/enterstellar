/**
 * @module @enterstellar/adapters/version
 * @description Package version constant for `@enterstellar/adapters`.
 *
 * Used by DevTools for version display and runtime compatibility checks.
 * Must be kept in sync with the `version` field in `package.json`.
 *
 * @see Design Choice T14 — version exports
 */

/**
 * Current version of the `@enterstellar/adapters` package.
 *
 * @remarks
 * This value MUST match the `version` field in `package.json`.
 * Update this constant whenever a new version is released via Changesets.
 */
export const ADAPTERS_VERSION = '0.0.0' as const;
