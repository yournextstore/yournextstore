// There is no CI: the pre-commit hook is the only gate, so it runs the full
// non-build check suite (lint + type-check + tests) on every commit that
// touches TypeScript. `bun run build` stays manual — it needs live store data.
export default {
	"*": "bun biome check --write --unsafe --staged --no-errors-on-unmatched --files-ignore-unknown=true",
	"**/*.ts?(x)": () => ["bun tsc --noEmit", "bun test"],
};
