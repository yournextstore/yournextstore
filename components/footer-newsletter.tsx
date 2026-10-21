"use client";

import { ArrowRight, CheckIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { BrandName } from "@/components/wordmark";
import { trackIdentify } from "@/lib/track";

/** "GET OUR LATEST DEALS AND DISCOUNTS!": only rendered when the store's newsletter module is on. */
export function FooterNewsletter({ storeName }: { storeName: string }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div>
			<h2 className="text-[1.75rem] leading-tight font-light uppercase sm:text-4xl">
				Get our latest news
				<br />
				and offers!
			</h2>
			{state?.success ? (
				<p className="mt-6 flex items-center gap-2 text-sm">
					<CheckIcon className="h-4 w-4" /> {state.message}
				</p>
			) : (
				<form action={action} className="mt-6 max-w-md space-y-3">
					<div className="flex h-12 items-center rounded-md bg-[#2a2a2a] pr-1.5 pl-4">
						<label htmlFor="footer-email" className="sr-only">
							Email address
						</label>
						<input
							id="footer-email"
							type="email"
							name="email"
							required
							placeholder="Enter your email"
							className="h-full min-w-0 flex-1 bg-transparent text-sm text-page outline-none placeholder:text-[#b9bec6]"
						/>
						<button
							type="submit"
							disabled={isPending || !marketingConsent}
							aria-label="Subscribe"
							className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-page text-ink disabled:opacity-60"
						>
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
					<div className="[&_*]:text-[#d4d8de]">
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
						/>
					</div>
					{state?.error && <p className="text-sm text-[#ff9a9e]">{state.error}</p>}
					<p className="text-xs">
						Become a <BrandName name={storeName} className="[&>span]:text-[#ff6b70]" /> insider!
					</p>
				</form>
			)}
		</div>
	);
}
