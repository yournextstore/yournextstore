"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** Centred newsletter band at the top of the footer, so it reaches every page. */
export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section className="shell border-b border-border py-16 md:py-24" aria-labelledby="newsletter-heading">
			<div className="mx-auto max-w-[34rem] text-center" data-reveal>
				<h2 id="newsletter-heading" className="type-h2">
					New pieces, one email at a time
				</h2>
				{state?.success ? (
					<p className="mono mt-9 text-[0.75rem] text-walnut" role="status">
						{state.message}
					</p>
				) : (
					<form action={action} className="mx-auto mt-9 max-w-[24rem]">
						<label className="sr-only" htmlFor={inputId}>
							Email address
						</label>
						<input
							id={inputId}
							name="email"
							type="email"
							required
							autoComplete="email"
							placeholder="email@example.com"
							className="field mono text-center text-[0.875rem]"
						/>
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
							className="mt-5 text-muted-foreground [&_span]:text-[0.8125rem] [&_span]:opacity-100"
						/>
						<button
							type="submit"
							disabled={isPending || !marketingConsent}
							className="btn btn-primary mt-5 w-full"
						>
							{isPending ? "Saving" : "Notify me"}
						</button>
						<p className="mono mt-4 min-h-4 text-[0.6875rem] text-destructive" role="status">
							{state?.error}
						</p>
					</form>
				)}
			</div>
		</section>
	);
}
