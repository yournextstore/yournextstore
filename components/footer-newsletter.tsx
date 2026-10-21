"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return <p className="text-sm text-ink-foreground">{state.message || "You're on the list."}</p>;
	}

	return (
		<form action={action} className="flex flex-col gap-2">
			<label htmlFor="footer-newsletter-email" className="sr-only">
				Email address
			</label>
			<input
				id="footer-newsletter-email"
				type="email"
				name="email"
				required
				placeholder="Your email"
				className="h-10 w-full rounded-md border border-[#374151] bg-[#1f2937] px-3 text-sm text-white placeholder:text-[#9ca3af] focus:border-brand-display focus:outline-none focus:ring-2 focus:ring-brand-display/40"
			/>
			<button
				type="submit"
				disabled={isPending || !consent}
				className="h-10 rounded-md bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isPending ? "Subscribing…" : "Subscribe"}
			</button>
			<NewsletterConsent
				checked={consent}
				onCheckedChange={setConsent}
				disabled={isPending}
				className="mt-1 text-ink-muted [&>span]:opacity-100 [&_button]:border-[#4b5563]"
			/>
			{state?.error && <p className="text-sm text-red-300">{state.error}</p>}
		</form>
	);
}
