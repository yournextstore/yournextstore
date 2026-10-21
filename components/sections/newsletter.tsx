"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** Soul's subscribe band: deep green, lime-tinted serif heading, a white inline email field. */
export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section className="bg-lime-shadow">
			<div className="container-soul flex flex-col gap-10 py-10 sm:py-14 lg:flex-row lg:gap-16 lg:py-20">
				<div className="flex-1">
					<h2 className="mb-4 text-2xl leading-none text-lime-highlight sm:text-3xl lg:text-4xl">
						Sign up for our newsletter
					</h2>
					<p className="text-lime-highlight/75">
						Stay up to date with the latest news and offers from our store.
					</p>
				</div>
				<div className="flex-1">
					{state?.success ? (
						<p role="status" className="rounded-xl bg-lime px-5 py-4 font-medium text-foreground">
							You have been subscribed to our newsletter!
						</p>
					) : (
						<form action={action} className="space-y-3">
							<div className="relative rounded-xl border border-foreground bg-background text-base transition-colors focus-within:border-lime">
								<label htmlFor="newsletter-email" className="sr-only">
									Email address
								</label>
								<input
									id="newsletter-email"
									type="email"
									name="email"
									required
									placeholder="Enter your email"
									className="h-14 w-full rounded-xl bg-transparent pr-16 pl-5 text-foreground placeholder:text-contrast-500 focus:outline-none"
								/>
								<div className="absolute top-1/2 right-0 -translate-y-1/2 pr-2">
									<button
										type="submit"
										aria-label="Subscribe"
										disabled={isPending || !marketingConsent}
										className="btn-soul btn-secondary size-10 p-0"
									>
										{isPending ? (
											<Loader2 className="size-5 animate-spin" />
										) : (
											<ArrowRight className="size-5" strokeWidth={1.5} />
										)}
									</button>
								</div>
							</div>
							<NewsletterConsent
								checked={marketingConsent}
								onCheckedChange={setMarketingConsent}
								disabled={isPending}
								className="text-lime-highlight [&_button]:border-lime-highlight/60 [&_button[data-state=checked]]:border-lime [&_button[data-state=checked]]:bg-lime [&_button[data-state=checked]]:text-foreground"
							/>
							{state?.error && (
								<p role="alert" className="text-sm text-[#ff9b9b]">
									{state.error}
								</p>
							)}
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
