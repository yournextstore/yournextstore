"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** Email field + "Subscribe" on the dark newsletter band, with the platform's consent box. */
export function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<div className="mt-8 flex flex-col items-center gap-3" role="status">
				<span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
					<CheckIcon className="h-5 w-5" />
				</span>
				<p className="text-white/80">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
			<div className="flex flex-col gap-3 sm:flex-row">
				<label htmlFor="newsletter-email" className="sr-only">
					Email address
				</label>
				<input
					id="newsletter-email"
					type="email"
					name="email"
					required
					placeholder="Enter your email"
					className="h-12 w-full flex-1 rounded-md border border-white/25 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white/60 focus:outline-none"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className="h-12 shrink-0 rounded-md bg-white px-7 text-sm font-medium text-foreground transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/70"
				>
					{isPending ? "Subscribing…" : "Subscribe"}
				</button>
			</div>
			<div className="text-white/80 [&_a]:text-white [&_button]:border-white/60">
				<NewsletterConsent
					checked={marketingConsent}
					onCheckedChange={setMarketingConsent}
					disabled={isPending}
				/>
			</div>
			{state?.error && <p className="text-sm text-red-200">{state.error}</p>}
		</form>
	);
}
