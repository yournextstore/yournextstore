import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"body-max-length": [1, "always", 100],
		"body-max-line-length": [1, "always", 100],
	},
};

export default Configuration;
