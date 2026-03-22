/**
 * Cache-safe translation helper.
 *
 * next-intl's `getTranslations` internally calls `getRequestConfig` which
 * accesses `headers()` — this is not allowed inside `"use cache"` components.
 *
 * This helper loads messages directly via dynamic import and returns a simple
 * lookup function, bypassing next-intl's server machinery entirely.
 *
 * Use this in `"use cache"` functions. For non-cached server components,
 * prefer next-intl's `getTranslations` which has full ICU MessageFormat support.
 */

type Messages = Record<string, Record<string, string>>;

export async function getCachedTranslations<N extends string>(
	locale: string,
	namespace: N,
): Promise<(key: string, values?: Record<string, string | number>) => string> {
	const messages: Messages = (await import(`@/messages/${locale}.json`)).default;
	const nsMessages = messages[namespace] ?? {};

	return (key: string, values?: Record<string, string | number>) => {
		const template = nsMessages[key] ?? key;
		if (!values) return template;

		// Simple interpolation for {varName} placeholders
		return template.replace(/\{(\w+)\}/g, (_, name: string) => {
			return values[name] !== undefined ? String(values[name]) : `{${name}}`;
		});
	};
}

const DEFAULT_LOCALE = "en-US";

/**
 * Get a locale-prefixed path for use inside `"use cache"` components.
 * next-intl's `Link` cannot be used inside cache because it reads headers().
 * Use this with plain `next/link` instead.
 */
export function localePath(locale: string, path: string): string {
	if (locale === DEFAULT_LOCALE) return path;
	return `/${locale}${path}`;
}
