"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The original's plum "Join the family" band: serif pitch on the left, joined email field on the right. */
export function NewsletterBand({ storeName }: { storeName: string }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section aria-labelledby="newsletter-heading" className="bg-plum text-plum-foreground">
			<div className="mx-auto grid max-w-[70rem] gap-8 px-5 py-14 md:grid-cols-2 md:items-center md:gap-12 md:px-10 lg:py-16">
				<div>
					<h2 id="newsletter-heading" className="text-title-lg">
						Join the {storeName} family
					</h2>
					<p className="mt-3 max-w-md text-sm leading-relaxed text-plum-foreground/85">
						Subscribe to hear about new blends and seasonal batches, and the occasional note from us.
					</p>
				</div>
				{state?.success ? (
					<p role="status" className="flex items-center gap-3 text-sm">
						<span className="flex size-8 items-center justify-center rounded-full bg-plum-foreground/15">
							<CheckIcon className="size-4" aria-hidden="true" />
						</span>
						{state.message}
					</p>
				) : (
					<form action={action} className="grid gap-3">
						<div className="flex h-11 overflow-hidden rounded-md border border-plum-foreground/60">
							<label htmlFor="newsletter-email" className="sr-only">
								Email address
							</label>
							<input
								id="newsletter-email"
								type="email"
								name="email"
								required
								autoComplete="email"
								placeholder="Enter your email address..."
								className="min-w-0 flex-1 bg-transparent px-4 text-sm text-plum-foreground placeholder:text-plum-foreground/70 focus:outline-none"
							/>
							<button
								type="submit"
								disabled={isPending || !marketingConsent}
								className="shrink-0 bg-plum-foreground px-5 text-sm font-semibold text-plum transition-colors hover:bg-white disabled:cursor-not-allowed"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
							</button>
						</div>
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
							className="text-plum-foreground [&_button]:border-plum-foreground/70 [&_span]:text-xs"
						/>
						{state?.error && (
							<p role="alert" className="text-sm text-[#ffd2c9]">
								{state.error}
							</p>
						)}
					</form>
				)}
			</div>
		</section>
	);
}
