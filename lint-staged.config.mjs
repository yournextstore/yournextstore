export default {
	"*": "bun biome check --write --unsafe --staged --no-errors-on-unmatched --files-ignore-unknown=true",
	"**/*.ts?(x)": () => "bun tsgo --noEmit",
};
