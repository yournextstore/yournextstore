"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's newsletter column: email field over a gold "Subscribe" bar, consent underneath. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p role="status" className="font-body text-sm text-cream">
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="flex flex-col gap-2">
			<label htmlFor="footer-newsletter-email" className="sr-only">
				Your email address
			</label>
			<input
				id="footer-newsletter-email"
				required
				type="email"
				name="email"
				autoComplete="email"
				placeholder="your@email.com"
				className="border border-cream/20 bg-cream/10 px-4 py-3 font-body text-sm text-cream outline-none transition-colors placeholder:text-cream/60 focus:border-gold"
			/>
			<button
				type="submit"
				disabled={isPending || !consent}
				className="bg-gold py-3 font-body text-xs uppercase tracking-widest text-earth transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
			>
				{isPending ? "Subscribing…" : "Subscribe"}
			</button>
			<NewsletterConsent
				checked={consent}
				onCheckedChange={setConsent}
				disabled={isPending}
				className="mt-1 text-xs text-cream [&_button]:border-cream/50"
			/>
			{state?.error && (
				<p role="alert" className="text-xs text-gold-light">
					{state.error}
				</p>
			)}
		</form>
	);
}
