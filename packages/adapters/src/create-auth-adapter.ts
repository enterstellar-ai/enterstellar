/**
 * @module @enterstellar/adapters/create-auth-adapter
 * @description Factory functions for creating validated `AuthAdapter` instances.
 *
 * - `createAuthAdapter(config)` — wraps a consumer-provided implementation,
 *   validates config via {@link validateAdapterConfig}, and wraps every method
 *   in error handling per Design Choice AD5 (raw vendor errors never leak).
 *
 * - `createNoopAuthAdapter()` — returns a no-op adapter for testing and
 *   development when no real auth provider is connected.
 *
 * Both factories return a plain object with closures (R1 pattern — no classes).
 *
 * @see Bible §4.15
 * @see Design Choice AD1 — minimal but complete: getSession, hasRole, onAuthChange
 * @see Design Choice AD2 — always async (I/O methods)
 * @see Design Choice AD5 — wrap into EnterstellarError
 */

import type { AuthAdapter } from '@enterstellar/types';

import { adapterAuthError, adapterMethodError } from './errors.js';
import type { AuthAdapterConfig } from './types.js';
import { validateAdapterConfig } from './validate-adapter.js';

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a validated `AuthAdapter` from consumer-provided config.
 *
 * The factory:
 * 1. Validates the config (name + required methods) — throws `ENS-7001` on failure.
 * 2. Wraps `getSession()` and `hasRole()` in error handling → `ENS-7005` on throw.
 * 3. Wraps `onAuthChange()` in error handling → `ENS-7002` on throw.
 *
 * Consumers never see raw vendor errors — all failures are `EnterstellarError` (AD5).
 *
 * @param config - The adapter implementation with a `name` and all required methods.
 * @returns A frozen `AuthAdapter` instance.
 * @throws `EnterstellarError` with code `ENS-7001` if config validation fails.
 *
 * @example
 * ```ts
 * import { createAuthAdapter } from '@enterstellar/adapters';
 *
 * const auth = createAuthAdapter({
 *   name: 'supabase-auth',
 *   getSession: async () => {
 *     const { data } = await supabase.auth.getSession();
 *     if (!data.session) return null;
 *     return { userId: data.session.user.id, roles: ['clinician'] };
 *   },
 *   hasRole: async (role) => {
 *     const session = await supabase.auth.getSession();
 *     return session.data.session?.user.role === role;
 *   },
 *   onAuthChange: (cb) => {
 *     const { data } = supabase.auth.onAuthStateChange((_event, session) => {
 *       cb(session ? { userId: session.user.id, roles: ['clinician'] } : null);
 *     });
 *     return () => data.subscription.unsubscribe();
 *   },
 * });
 * ```
 */
export function createAuthAdapter(config: AuthAdapterConfig): AuthAdapter {
  // -----------------------------------------------------------------------
  // Step 1: Validate config — throws ENS-7001 on failure
  // -----------------------------------------------------------------------
  validateAdapterConfig('auth', config);

  const adapterName = config.name;

  // -----------------------------------------------------------------------
  // Step 2: Build wrapped adapter (plain object with closures — R1 pattern)
  // -----------------------------------------------------------------------
  const adapter: AuthAdapter = {
    /**
     * Wrapped `getSession()` — catches vendor errors → `ENS-7005`.
     */
    async getSession(): Promise<{ userId: string; roles: string[] } | null> {
      try {
        return await config.getSession();
      } catch (error: unknown) {
        throw adapterAuthError(adapterName, 'getSession', error);
      }
    },

    /**
     * Wrapped `hasRole()` — catches vendor errors → `ENS-7005`.
     */
    async hasRole(role: string): Promise<boolean> {
      try {
        return await config.hasRole(role);
      } catch (error: unknown) {
        throw adapterAuthError(adapterName, 'hasRole', error);
      }
    },

    /**
     * Wrapped `onAuthChange()` — catches subscription setup errors → `ENS-7002`.
     * Uses generic method error (not auth-specific) because `onAuthChange` is
     * subscription management, not auth state retrieval.
     */
    onAuthChange(
      callback: (session: { userId: string; roles: string[] } | null) => void,
    ): () => void {
      try {
        return config.onAuthChange(callback);
      } catch (error: unknown) {
        throw adapterMethodError(adapterName, 'onAuthChange', error);
      }
    },
  };

  // -----------------------------------------------------------------------
  // Step 3: Freeze and return — prevents accidental mutation (R4 pattern)
  // -----------------------------------------------------------------------
  return Object.freeze(adapter);
}

// ---------------------------------------------------------------------------
// No-Op Factory
// ---------------------------------------------------------------------------

/**
 * Creates a no-op `AuthAdapter` for testing and development.
 *
 * All methods resolve to safe defaults:
 * - `getSession()` → `null` (unauthenticated)
 * - `hasRole()` → `false` (no permissions)
 * - `onAuthChange()` → no-op unsubscribe function (never fires)
 *
 * @returns A frozen, no-op `AuthAdapter` instance.
 *
 * @example
 * ```ts
 * import { createNoopAuthAdapter } from '@enterstellar/adapters';
 *
 * const auth = createNoopAuthAdapter();
 * await auth.getSession(); // null
 * await auth.hasRole('admin'); // false
 * const unsub = auth.onAuthChange(() => {}); // never called
 * unsub(); // no-op
 * ```
 */
export function createNoopAuthAdapter(): AuthAdapter {
  const adapter: AuthAdapter = {
    /** Returns `null` — no active session in noop mode. */
    getSession(): Promise<{ userId: string; roles: string[] } | null> {
      return Promise.resolve(null);
    },

    /** Returns `false` — no permissions in noop mode. */
    hasRole(_role: string): Promise<boolean> {
      return Promise.resolve(false);
    },

    /** Returns a no-op unsubscribe function — never fires a callback. */
    onAuthChange(
      _callback: (session: { userId: string; roles: string[] } | null) => void,
    ): () => void {
      // No-op — no auth state changes to subscribe to.
      return () => {
        /* noop unsubscribe */
      };
    },
  };

  return Object.freeze(adapter);
}
