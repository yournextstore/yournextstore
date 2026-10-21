"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section className="shop-container py-16 md:py-24">
			<div className="rounded-2xl border border-border bg-card px-8 py-14 text-center md:px-16 md:py-20">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand-soft-foreground">
							<CheckIcon className="size-6" aria-hidden />
						</div>
						<h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold text-foreground">
							You&apos;re on the list
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
					</div>
				) : (
					<>
						<p className="kicker mb-4">Stay in the loop</p>
						<h2 className="mb-2 font-display text-[clamp(2rem,4vw,3rem)] font-semibold text-foreground">
							Join the community
						</h2>
						<p className="mx-auto mb-8 max-w-sm text-sm text-muted-foreground">
							Get early access to new arrivals and curated picks delivered to your inbox.
						</p>
						<form action={action} className="mx-auto flex max-w-md flex-col gap-4">
							<div className="flex flex-col gap-3 sm:flex-row">
								<label htmlFor="home-newsletter-email" className="sr-only">
									Email address
								</label>
								<input
									id="home-newsletter-email"
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-brand-display focus:outline-none sm:flex-1"
								/>
								<button
									type="submit"
									disabled={isPending || !marketingConsent}
									className="whitespace-nowrap rounded-full bg-primary px-7 py-3 text-sm font-semibold tracking-[0.08em] text-primary-foreground transition-colors hover:bg-brand hover:text-brand-foreground disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
								</button>
							</div>
							<NewsletterConsent
								checked={marketingConsent}
								onCheckedChange={setMarketingConsent}
								disabled={isPending}
								className="text-muted-foreground [&>span]:opacity-100"
							/>
						</form>
						{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
