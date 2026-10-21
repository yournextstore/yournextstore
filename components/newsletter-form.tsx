"use client";

import { ArrowRight } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The original's footer signup: a white underline field with an arrow, on the olive footer. */
export function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div id="newsletter" className="scroll-mt-24">
			<h2 className="mb-4 font-bold">Newsletter</h2>
			{state?.success ? (
				<p className="text-sm">{state.message}</p>
			) : (
				<>
					<p className="mb-4">Sign up for our newsletter to only receive good things.</p>
					<form action={action} className="space-y-4">
						<div className="flex items-center border-b border-white">
							<label htmlFor="footer-newsletter-email" className="sr-only">
								Email address
							</label>
							<input
								id="footer-newsletter-email"
								type="email"
								name="email"
								required
								autoComplete="email"
								placeholder="Enter your email"
								className="h-10 min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white focus:outline-none"
							/>
							<button
								type="submit"
								disabled={isPending || !marketingConsent}
								aria-label="Subscribe"
								className="p-2 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
							>
								<ArrowRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
							</button>
						</div>
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
							className="[&_[data-slot=checkbox]]:border-white [&_[data-slot=checkbox]]:data-checked:bg-white [&_[data-slot=checkbox]]:data-checked:text-olive [&>span]:text-xs [&>span]:opacity-100"
						/>
					</form>
					{state?.error && <p className="mt-3 text-sm">{state.error}</p>}
				</>
			)}
		</div>
	);
}
