// ─── DO NOT REMOVE ──────────────────────────────────────────────────────────
// GDPR cookie consent banner. Entry point + server logic in ./cookie-consent.tsx.
// ────────────────────────────────────────────────────────────────────────────
"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Must match CONSENT_COOKIE in ./cookie-consent.tsx
const CONSENT_COOKIE = "yns-cookie-consent";

const recordChoice = (choice: "accepted" | "declined") => {
	document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
	const state = choice === "accepted" ? "granted" : "denied";
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: "consent_update",
		ad_storage: state,
		ad_user_data: state,
		ad_personalization: state,
		analytics_storage: state,
	});
};

declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
	}
}

export const CookieConsentBanner = () => {
	const [hidden, setHidden] = useState(false);
	if (hidden) return null;

	const onAccept = () => {
		recordChoice("accepted");
		setHidden(true);
	};
	const onDecline = () => {
		recordChoice("declined");
		setHidden(true);
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-md">
			<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex-1">
					<h3 className="mb-1 font-semibold">We use cookies</h3>
					<p className="text-sm text-muted-foreground">
						We use cookies to improve your browsing experience, analyze site traffic, and personalize content.
						By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.
					</p>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<Button type="button" variant="outline" size="sm" onClick={onDecline}>
						Decline
					</Button>
					<Button type="button" size="sm" onClick={onAccept}>
						Accept
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onDecline}
						aria-label="Decline cookies"
						className="p-1 h-auto"
					>
						<XIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
