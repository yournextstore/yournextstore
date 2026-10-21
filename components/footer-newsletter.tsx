"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The original's footer signup: one line of pitch over a ruled email field with a word for a button. */
export function FooterNewsletter({ pitch }: { pitch: string }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div id="newsletter" className="scroll-mt-24">
			<h2 className="text-foot">{pitch}</h2>
			{state?.success ? (
				<p className="mt-4 text-foot">{state.message}</p>
			) : (
				<form action={action} className="mt-2">
					<div className="flex items-center border-b-2 border-snow">
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
							className="h-11 min-w-0 flex-1 bg-transparent text-foot text-snow placeholder:text-snow/80 focus:outline-none"
						/>
						<button
							type="submit"
							disabled={isPending || !marketingConsent}
							className="h-11 shrink-0 pl-4 text-foot underline-offset-[0.3em] hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
						>
							{isPending ? "Subscribing…" : "Subscribe"}
						</button>
					</div>
					<NewsletterConsent
						checked={marketingConsent}
						onCheckedChange={setMarketingConsent}
						disabled={isPending}
						className="mt-4 text-muted-foreground [&_span]:opacity-100"
					/>
				</form>
			)}
			{state?.error && <p className="mt-3 text-foot text-destructive">{state.error}</p>}
		</div>
	);
}
