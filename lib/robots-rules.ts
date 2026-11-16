const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

export type RobotsGroup = {
	userAgent: string[];
	allow?: string[];
	disallow?: string[];
	crawlDelay?: number;
};

type OpenGroup = {
	userAgent: string[];
	allow: string[];
	disallow: string[];
	crawlDelay?: number;
	named: boolean;
};

const DIRECTIVE = /^(user-agent|allow|disallow|crawl-delay)\s*:\s*(.+)$/i;

/**
 * The merchant's own robots.txt rules as rule groups, for `app/robots.ts` to print after the store's own. The
 * merchant types them as free text under Settings → SEO and the Store API returns it as `settings.robotsRules`; the
 * pinned commerce-kit types don't know the field yet, so it is read by shape.
 *
 * Only crawler rules are kept: `User-agent`, `Allow`, `Disallow` and `Crawl-delay` lines. Comments and every other
 * line (a pasted `Sitemap:` or `Host:`, a typo) are dropped, so the text can't break the file. Lines before the
 * first `User-agent` apply to every crawler.
 */
export function storeRobotsGroups(settings: unknown): RobotsGroup[] {
	const text = isRecord(settings) ? settings.robotsRules : undefined;
	if (typeof text !== "string") {
		return [];
	}

	const groups: OpenGroup[] = [];
	for (const rawLine of text.split(/\r?\n/)) {
		const match = DIRECTIVE.exec(rawLine.replace(/#.*$/, "").trim());
		const value = match?.[2]?.trim();
		if (!match || !value) {
			continue;
		}
		const key = match[1]?.toLowerCase();
		const last = groups.at(-1);

		if (key === "user-agent") {
			// User-agent lines in a row share one group; one that follows a rule starts the next group.
			if (last?.named && last.allow.length + last.disallow.length === 0 && last.crawlDelay === undefined) {
				last.userAgent.push(value);
			} else {
				groups.push({ userAgent: [value], allow: [], disallow: [], named: true });
			}
			continue;
		}

		const group = last ?? { userAgent: ["*"], allow: [], disallow: [], named: false };
		if (!last) {
			groups.push(group);
		}
		if (key === "allow") {
			group.allow.push(value);
		} else if (key === "disallow") {
			group.disallow.push(value);
		} else {
			const seconds = Number(value);
			if (Number.isFinite(seconds) && seconds >= 0) {
				group.crawlDelay = seconds;
			}
		}
	}

	return groups
		.filter((group) => group.allow.length + group.disallow.length > 0 || group.crawlDelay !== undefined)
		.map((group) => ({
			userAgent: group.userAgent,
			...(group.allow.length > 0 ? { allow: group.allow } : {}),
			...(group.disallow.length > 0 ? { disallow: group.disallow } : {}),
			...(group.crawlDelay !== undefined ? { crawlDelay: group.crawlDelay } : {}),
		}));
}
