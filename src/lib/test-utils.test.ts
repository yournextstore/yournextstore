import { describe, expect, it } from "vitest";
import { add, capitalize, formatPrice, isEmpty, multiply } from "./test-utils";

describe("test-utils", () => {
	describe("add", () => {
		it("should add two positive numbers", () => {
			expect(add(2, 3)).toBe(5);
		});

		it("should add negative numbers", () => {
			expect(add(-2, -3)).toBe(-5);
		});

		it("should add positive and negative numbers", () => {
			expect(add(5, -3)).toBe(2);
		});

		it("should handle zero", () => {
			expect(add(0, 5)).toBe(5);
			expect(add(5, 0)).toBe(5);
			expect(add(0, 0)).toBe(0);
		});

		it("should handle decimal numbers", () => {
			expect(add(1.5, 2.5)).toBe(4);
			expect(add(0.1, 0.2)).toBeCloseTo(0.3);
		});
	});

	describe("multiply", () => {
		it("should multiply two positive numbers", () => {
			expect(multiply(3, 4)).toBe(12);
		});

		it("should multiply negative numbers", () => {
			expect(multiply(-3, -4)).toBe(12);
			expect(multiply(-3, 4)).toBe(-12);
		});

		it("should handle zero", () => {
			expect(multiply(0, 5)).toBe(0);
			expect(multiply(5, 0)).toBe(0);
		});

		it("should handle decimal numbers", () => {
			expect(multiply(2.5, 4)).toBe(10);
			expect(multiply(0.1, 0.2)).toBeCloseTo(0.02);
		});
	});

	describe("isEmpty", () => {
		it("should return true for empty string", () => {
			expect(isEmpty("")).toBe(true);
		});

		it("should return true for whitespace only strings", () => {
			expect(isEmpty(" ")).toBe(true);
			expect(isEmpty("   ")).toBe(true);
			expect(isEmpty("\t")).toBe(true);
			expect(isEmpty("\n")).toBe(true);
			expect(isEmpty(" \t \n ")).toBe(true);
		});

		it("should return false for non-empty strings", () => {
			expect(isEmpty("hello")).toBe(false);
			expect(isEmpty("a")).toBe(false);
			expect(isEmpty(" hello ")).toBe(false);
		});
	});

	describe("capitalize", () => {
		it("should capitalize first letter of lowercase string", () => {
			expect(capitalize("hello")).toBe("Hello");
		});

		it("should handle already capitalized strings", () => {
			expect(capitalize("Hello")).toBe("Hello");
		});

		it("should handle single character", () => {
			expect(capitalize("a")).toBe("A");
			expect(capitalize("A")).toBe("A");
		});

		it("should handle empty string", () => {
			expect(capitalize("")).toBe("");
		});

		it("should handle whitespace only strings", () => {
			expect(capitalize(" ")).toBe(" ");
			expect(capitalize("   ")).toBe("   ");
		});

		it("should only capitalize first letter", () => {
			expect(capitalize("hello world")).toBe("Hello world");
			expect(capitalize("hELLO")).toBe("HELLO");
		});
	});

	describe("formatPrice", () => {
		it("should format whole dollar amounts", () => {
			expect(formatPrice(100)).toBe("$1.00");
			expect(formatPrice(1234)).toBe("$12.34");
		});

		it("should format cents", () => {
			expect(formatPrice(50)).toBe("$0.50");
			expect(formatPrice(5)).toBe("$0.05");
		});

		it("should handle zero", () => {
			expect(formatPrice(0)).toBe("$0.00");
		});

		it("should handle large amounts", () => {
			expect(formatPrice(123456)).toBe("$1234.56");
		});

		it("should handle single digit cents", () => {
			expect(formatPrice(101)).toBe("$1.01");
			expect(formatPrice(1)).toBe("$0.01");
		});
	});
});
