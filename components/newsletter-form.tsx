"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's compact signup: heading, one-line pitch, email field with a solid button. */
export function NewsletterForm({ className }: { className?: string }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div className={className}>
			<h2 className="mb-2 text-title-md md:mb-1 md:text-title-lg">Join our newsletter</h2>
			{state?.success ? (
				<p className="max-md:text-body-xs">{state.message}</p>
			) : (
				<>
					<p className="mb-4 max-md:text-body-xs">We will also send you our discount coupons!</p>
					<form action={action}>
						<div className="mb-4 flex gap-2">
							<label htmlFor="footer-newsletter-email" className="sr-only">
								Email address
							</label>
							<input
								id="footer-newsletter-email"
								type="email"
								name="email"
								required
								autoComplete="email"
								placeholder="Your email"
								className="h-9 min-w-0 flex-1 rounded-xs border border-grayscale-200 bg-background px-4 text-body-xs placeholder:text-grayscale-500 transition-colors hover:border-grayscale-500 focus:border-grayscale-500 focus:outline-none"
							/>
							<button
								type="submit"
								disabled={isPending || !marketingConsent}
								className="h-9 shrink-0 rounded-xs bg-foreground px-4 text-body-xs text-background transition-colors hover:bg-grayscale-800 disabled:cursor-not-allowed"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
							</button>
						</div>
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
							className="text-grayscale-500 [&_span]:text-body-xs [&_span]:opacity-100"
						/>
					</form>
					{state?.error && <p className="mt-3 text-body-xs text-sale">{state.error}</p>}
				</>
			)}
		</div>
	);
}
