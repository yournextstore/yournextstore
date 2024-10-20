import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// @ts-ignore -- throws Excessive stack depth comparing types
export default defineConfig({
	// @ts-ignore -- types mismatch between versions
	plugins: [tsConfigPaths(), react()],
	test: {
		globals: true,
		passWithNoTests: true,
		setupFiles: "./src/setup-tests.ts",
		css: false,
		outputFile: {
			json: "coverage/report.json",
		},
		coverage: {
			reporter: ["text", "json", "html", "text-summary"],
		},
		clearMocks: true,
		mockReset: true,
		restoreMocks: true,
		unstubGlobals: true,
		unstubEnvs: true,
		include: ["**/?(*.)test.?(c|m)[jt]s?(x)"],
	},
});
