"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's signup: heading, one-line pitch, a grey email field over a full-width black button. */
export function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold text-primary">Newsletter</h2>
			{state?.success ? (
				<p>{state.message}</p>
			) : (
				<>
					<p>Subscribe to receive updates, access to exclusive deals, and more.</p>
					<form action={action} className="space-y-2 sm:max-w-md">
						<input
							type="email"
							name="email"
							required
							autoComplete="email"
							placeholder="Enter your email"
							aria-label="Email for newsletter"
							className="flex h-10 w-full rounded-md border border-input bg-field px-4 py-2 text-base text-ink placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
						/>
						<button
							type="submit"
							disabled={isPending || !marketingConsent}
							className="inline-flex h-10 w-full items-center justify-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-[transform,background] duration-200 hover:bg-black/85 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-90"
						>
							{isPending ? "Subscribing…" : "Subscribe"}
						</button>
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
							className="pt-1 [&_span]:text-xs [&_span]:opacity-100"
						/>
					</form>
					{state?.error && <p className="text-sm text-destructive">{state.error}</p>}
				</>
			)}
		</div>
	);
}
