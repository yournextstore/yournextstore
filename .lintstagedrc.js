// https://nextjs.org/docs/basic-features/eslint#lint-staged
// @ts-check
import Path from "node:path";

const buildEslintCommand = (filenames) =>
	`next lint --fix --file ${filenames
		.map((f) => Path.relative(process.cwd(), f))
		.join(" --file ")}`;

export default {
	"*.{js,mjs,jsx,ts,tsx}": [buildEslintCommand],
	"*.*": "prettier --write --ignore-unknown",
};
