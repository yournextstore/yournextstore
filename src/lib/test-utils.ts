/**
 * Simple utility functions for testing
 */

/**
 * Adds two numbers together
 * @param a - First number
 * @param b - Second number
 * @returns Sum of a and b
 */
export function add(a: number, b: number): number {
	return a + b;
}

/**
 * Multiplies two numbers
 * @param a - First number
 * @param b - Second number
 * @returns Product of a and b
 */
export function multiply(a: number, b: number): number {
	return a * b;
}

/**
 * Checks if a string is empty or contains only whitespace
 * @param str - String to check
 * @returns True if string is empty or whitespace only
 */
export function isEmpty(str: string): boolean {
	return str.trim().length === 0;
}

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 */
export function capitalize(str: string): string {
	if (isEmpty(str)) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a price in cents to a dollar string
 * @param priceInCents - Price in cents
 * @returns Formatted price string (e.g., "$12.34")
 */
export function formatPrice(priceInCents: number): string {
	const dollars = priceInCents / 100;
	return `$${dollars.toFixed(2)}`;
}
