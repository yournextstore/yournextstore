"use client";

import { CheckIcon, MailIcon } from "lucide-react";
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
		<section className="page-x py-16 lg:py-20">
			<div className="mx-auto max-w-2xl text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-secondary">
							<CheckIcon aria-hidden className="size-6" />
						</div>
						<h2 className="text-heading-lg uppercase">You&apos;re on the list</h2>
						<p className="mt-3 text-body-sm text-muted-foreground">{state.message}</p>
					</div>
				) : (
					<>
						<h2 className="text-heading-lg uppercase text-balance">Join the list. Hear it first.</h2>
						<p className="mx-auto mt-4 max-w-xl text-body-sm">
							New arrivals, restocks and the stories behind them, sent now and then. No noise, just the good
							stuff.
						</p>
						<form action={action} className="mx-auto mt-8 flex max-w-md flex-col gap-4">
							<div className="flex">
								<label htmlFor="newsletter-email" className="sr-only">
									Email address
								</label>
								<div className="relative flex-1">
									<MailIcon
										aria-hidden
										className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
										strokeWidth={1.5}
									/>
									<input
										id="newsletter-email"
										type="email"
										name="email"
										placeholder="Enter your email"
										required
										className="h-11 w-full rounded-l-md border border-r-0 border-line bg-background pr-3 pl-9 text-body-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-line"
									/>
								</div>
								<button
									type="submit"
									disabled={isPending || !marketingConsent}
									className="h-11 shrink-0 rounded-r-md bg-primary px-5 text-body-sm text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-60"
								>
									{isPending ? "Subscribing\u2026" : "Subscribe"}
								</button>
							</div>
							<NewsletterConsent
								checked={marketingConsent}
								onCheckedChange={setMarketingConsent}
								disabled={isPending}
							/>
						</form>
						{state?.error && <p className="mt-4 text-body-sm text-destructive">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
