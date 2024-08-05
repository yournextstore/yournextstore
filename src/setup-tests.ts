import "next";
import { loadEnvConfig } from "@next/env";
import { expect, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
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
