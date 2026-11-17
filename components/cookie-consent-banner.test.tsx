import { expect, mock, test } from "bun:test";
import type { UseConsent } from "commerce-kit/tracking/react";
import { renderToString } from "react-dom/server";

const consent: { current: UseConsent } = {
	current: {
		required: true,
		optOut: null,
		purposes: { analytics: "granted", marketing: "granted", preferences: "granted", sale_of_data: "granted" },
		reopened: false,
		bannerVisible: false,
		set: () => {},
		open: () => {},
	},
};
mock.module("commerce-kit/tracking/react", () => ({ useConsent: () => consent.current }));

const { CookieConsentBanner, CookieSettingsLink } = await import("./cookie-consent-banner");

const asked = (overrides: Partial<UseConsent>) => {
	consent.current = { ...consent.current, ...overrides };
};

test("the footer offers Cookie settings only where the banner can show for this visitor", () => {
	asked({ required: true, optOut: null });
	expect(renderToString(<CookieSettingsLink />)).toContain("Cookie settings");
	for (const state of [
		{ required: false },
		{ required: null },
		{ optOut: "globalPrivacyControl" as const },
	]) {
		asked({ required: true, optOut: null, ...state });
		expect(renderToString(<CookieSettingsLink />)).toBe("");
	}
});

test("the reopened banner says what the visitor answered before", () => {
	asked({ required: true, optOut: null, bannerVisible: true, reopened: true });
	expect(renderToString(<CookieConsentBanner />)).toContain("You currently accept cookies.");
	asked({
		purposes: { analytics: "denied", marketing: "denied", preferences: "denied", sale_of_data: "denied" },
	});
	expect(renderToString(<CookieConsentBanner />)).toContain("You currently decline cookies.");
	asked({ reopened: false, bannerVisible: false });
	expect(renderToString(<CookieConsentBanner />)).toBe("");
});
