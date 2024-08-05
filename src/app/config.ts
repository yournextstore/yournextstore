import "server-only";

declare global {
	/**
	 * ⚠️ Warning: This might be `undefined` but TypeScript doesn't have a syntax to express that.
	 * @see https://github.com/microsoft/TypeScript/issues/36057
	 */
	function __ynsFindStripeAccount(): string | undefined | Promise<string | undefined>;
}

export const findStripeAccount = () => {
	if (!global.__ynsFindStripeAccount) {
		return undefined;
	}
	return global.__ynsFindStripeAccount();
};
