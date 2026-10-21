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
		<section className="mx-4 my-28 flex flex-col items-center sm:my-36">
			<div className="flex flex-col items-center text-center">
				<h2 className="text-2xl font-semibold text-slate-800">Join Newsletter</h2>
				<p className="mt-2 max-w-lg text-sm text-slate-600">
					Subscribe to hear about new arrivals and updates from the shop, straight to your inbox.
				</p>
			</div>
			{state?.success ? (
				<div className="my-10 flex items-center gap-3 rounded-full bg-green-100 px-6 py-3 text-sm text-green-800">
					<CheckIcon className="size-4" aria-hidden />
					{state.message}
				</div>
			) : (
				<form action={action} className="my-10 flex w-full max-w-xl flex-col items-center gap-4">
					<div className="flex w-full rounded-full border-2 border-white bg-slate-100 p-1 text-sm ring ring-slate-200">
						<label htmlFor="newsletter-email" className="sr-only">
							Email address
						</label>
						<input
							id="newsletter-email"
							type="email"
							name="email"
							required
							placeholder="Enter your email address"
							className="min-w-0 flex-1 bg-transparent pl-5 text-slate-700 outline-none placeholder:text-slate-600"
						/>
						<button
							type="submit"
							disabled={isPending || !marketingConsent}
							className="shrink-0 rounded-full bg-go-green-ink px-5 py-3 font-medium text-white transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:px-7"
						>
							{isPending ? "Subscribing…" : "Get Updates"}
						</button>
					</div>
					<NewsletterConsent
						checked={marketingConsent}
						onCheckedChange={setMarketingConsent}
						disabled={isPending}
					/>
					{state?.error && <p className="text-sm text-destructive">{state.error}</p>}
				</form>
			)}
		</section>
	);
}
