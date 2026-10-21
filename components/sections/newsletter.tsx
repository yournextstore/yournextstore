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
		<section aria-labelledby="newsletter-title" className="bg-accent">
			<div className="shell flex flex-col items-center gap-7 py-12 text-center lg:py-20">
				{state?.success ? (
					<div className="flex flex-col items-center gap-3">
						<CheckIcon aria-hidden="true" className="size-6 text-primary" />
						<h2 id="newsletter-title" className="font-display text-display-sm font-semibold">
							You&apos;re on the list
						</h2>
						<p className="text-body-md text-muted-foreground">{state.message}</p>
					</div>
				) : (
					<>
						<h2
							id="newsletter-title"
							className="font-display text-display-sm font-semibold leading-normal lg:text-display-md"
						>
							News from the shop, in your inbox
						</h2>
						<form
							action={action}
							className="grid w-full max-w-[586px] gap-3 lg:grid-cols-[minmax(0,1fr)_auto]"
						>
							<label className="sr-only" htmlFor="newsletter-email">
								Email address
							</label>
							<input
								id="newsletter-email"
								type="email"
								name="email"
								placeholder="Email address"
								required
								className="h-13 w-full rounded-input border border-border bg-card px-4 text-body-md placeholder:text-muted-foreground"
							/>
							<button
								type="submit"
								disabled={isPending || !marketingConsent}
								className="inline-flex h-13 items-center justify-center rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
							>
								{isPending ? "Subscribing\u2026" : "Subscribe"}
							</button>
							<div className="text-left lg:col-span-2">
								<NewsletterConsent
									checked={marketingConsent}
									onCheckedChange={setMarketingConsent}
									disabled={isPending}
								/>
							</div>
						</form>
						{state?.error && <p className="text-body-sm text-destructive">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
