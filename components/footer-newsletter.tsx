"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** Penny's footer newsletter: label, one line of copy, input + accent button side by side from sm. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<>
			<h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
				Subscribe to our newsletter
			</h3>
			<p className="mt-4 text-base text-gray-600">
				The latest arrivals, offers and stories, sent to your inbox.
			</p>
			{state?.success ? (
				<p className="mt-4 rounded-md bg-green-50 p-4 text-sm font-medium text-green-800">{state.message}</p>
			) : (
				<form action={action} className="mt-4">
					<div className="sm:flex">
						<label htmlFor="footer-email" className="sr-only">
							Email address
						</label>
						<input
							id="footer-email"
							type="email"
							name="email"
							required
							autoComplete="email"
							placeholder="Enter your email"
							className="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
						/>
						<div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:shrink-0">
							<button
								type="submit"
								disabled={isPending || !marketingConsent}
								className="flex w-full items-center justify-center rounded-md border border-transparent bg-brand px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-brand-hover focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
							</button>
						</div>
					</div>
					<NewsletterConsent
						checked={marketingConsent}
						onCheckedChange={setMarketingConsent}
						disabled={isPending}
						className="mt-4 text-gray-900"
					/>
					{state?.error && <p className="mt-2 text-sm text-red-700">{state.error}</p>}
				</form>
			)}
		</>
	);
}
