/**
 * Enterstellar Monorepo — lint-staged Configuration
 *
 * Runs ESLint + Prettier on staged TypeScript files only.
 * Triggered by Husky pre-commit hook for fast, focused commits.
 *
 * Test files are excluded from ESLint here — they are validated by per-package
 * `turbo run test` / `typecheck` instead.
 *
 * @see agent/06-enterstellar-setup.md — DX Tooling Chain
 */
export default {
    '*.{ts,tsx}': (files) => {
        const lintable = files.filter((file) => !file.includes('/__tests__/'));
        const commands = ['prettier --write ' + files.map((f) => `"${f}"`).join(' ')];
        if (lintable.length > 0) {
            commands.unshift(
                'eslint --fix --max-warnings=0 --no-warn-ignored ' +
                    lintable.map((f) => `"${f}"`).join(' '),
            );
        }
        return commands;
    },
    '*.{json,md,yaml,yml}': ['prettier --write'],
};
