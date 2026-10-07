// ─── DO NOT REMOVE ──────────────────────────────────────────────────────────
// GDPR cookie consent banner + Google Consent Mode v2 wiring.
// Banner UI lives in ./cookie-consent-banner.tsx (must keep both files).
// Rendered at the top of <body> in app/layout.tsx — that ordering is required
// so the `default_consent` push lands on window.dataLayer before any GTM /
// Meta Pixel / Google Ads script. Do not move it below other scripts.
// ────────────────────────────────────────────────────────────────────────────
import { Suspense } from "react";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { meGetCached } from "@/lib/commerce";

// Must match CONSENT_COOKIE in ./cookie-consent-banner.tsx
const CONSENT_COOKIE = "yns-cookie-consent";

// With `fromCookie`, the script reads the visitor's choice itself. Reading the cookie on
// the server would render every page per request instead of serving it static.
const ConsentScript = ({ fromCookie = false }: { fromCookie?: boolean }) => {
	const state = fromCookie
		? `/(?:^|; )${CONSENT_COOKIE}=accepted(?:;|$)/.test(document.cookie)?'granted':'denied'`
		: "'granted'";
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `(function(s){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'default_consent',ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s});})(${state});`,
			}}
		/>
	);
};

export async function CookieConsent() {
	const me = await meGetCached();
	if (!me.store.settings?.enabledTools?.cookieConsent) {
		// Consent tool disabled in admin — tracking can fire freely.
		return <ConsentScript />;
	}

	return (
		<>
			<ConsentScript fromCookie />
			{/* Its own boundary is required: the banner renders only in the browser, and
			    suspending the layout's boundary instead would client-render the script
			    above, and a script React inserts on the client never runs. */}
			<Suspense fallback={null}>
				<CookieConsentBanner />
			</Suspense>
		</>
	);
}
