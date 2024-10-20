import "next";
import { loadEnvConfig } from "@next/env";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

loadEnvConfig(".");

/**
 * Vitest setup logic
 * https://vitest.dev/config/#setupfiles
 */

expect.extend(matchers);

afterEach(() => {
	cleanup();
});
