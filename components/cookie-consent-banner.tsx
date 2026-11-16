// ─── DO NOT REMOVE ──────────────────────────────────────────────────────────
// GDPR cookie consent banner: design only. Whether this visitor must be asked,
// the consent cookie and Google Consent Mode belong to the platform tracking
// runtime; the banner shows when `bannerVisible` and answers through `set`.
// ────────────────────────────────────────────────────────────────────────────
"use client";

import { useConsent } from "commerce-kit/tracking/react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CookieConsentBanner = () => {
	const { bannerVisible, set } = useConsent();
	if (!bannerVisible) return null;

	const onAccept = () => set({ analytics: true, marketing: true, preferences: true, sale_of_data: true });
	const onDecline = () =>
		set({ analytics: false, marketing: false, preferences: false, sale_of_data: false });

	return (
		// z-[45]: above the "Made with YNS" badge, the chat launcher and the newsletter launcher (z-40 at
		// bottom-4), which would otherwise overlap its buttons, and below the cart sheet and dialogs (z-50),
		// which it would otherwise cover, checkout button included.
		<div className="fixed bottom-0 left-0 right-0 z-[45] border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-md">
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
						size="icon-sm"
						onClick={onDecline}
						aria-label="Decline cookies"
					>
						<XIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
