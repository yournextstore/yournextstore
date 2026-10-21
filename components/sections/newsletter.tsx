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
		<section className="bg-primary text-white">
			<div className="uk-container py-10">
				<div className="mx-auto max-w-[600px] text-center">
					{state?.success ? (
						<div className="animate-in fade-in duration-500">
							<div className="mx-auto mb-[15px] flex size-10 items-center justify-center rounded-full bg-white/15">
								<CheckIcon aria-hidden className="size-5" />
							</div>
							<h2 className="text-uk-h2 text-white">You&apos;re on the list</h2>
							<p className="mt-[5px] text-uk-sm text-white">{state.message}</p>
						</div>
					) : (
						<>
							<h2 className="text-uk-h2 text-white lg:text-[2rem]">Subscribe for updates</h2>
							<p className="text-uk-sm text-white">Be aware of new products and special offers.</p>
							<form action={action} className="mx-auto mt-5 flex max-w-[440px] flex-col gap-[15px]">
								<div className="flex flex-col gap-[10px] sm:flex-row">
									<label htmlFor="newsletter-email" className="sr-only">
										Email address
									</label>
									<input
										id="newsletter-email"
										type="email"
										name="email"
										placeholder="Your email"
										required
										className="h-10 w-full flex-1 rounded-[4px] border border-white/40 bg-[#115eab] px-[10px] text-uk-sm text-white outline-none placeholder:text-white/90 focus:border-white"
									/>
									<button
										type="submit"
										disabled={isPending || !marketingConsent}
										className="uk-btn bg-white text-primary hover:bg-white/90"
									>
										{isPending ? "Subscribing\u2026" : "Subscribe"}
									</button>
								</div>
								<NewsletterConsent
									checked={marketingConsent}
									onCheckedChange={setMarketingConsent}
									disabled={isPending}
									className="text-white [&_button]:border-white [&_span]:text-uk-xs [&_span]:opacity-100"
								/>
							</form>
							{state?.error && <p className="mt-[10px] text-uk-sm text-white">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
