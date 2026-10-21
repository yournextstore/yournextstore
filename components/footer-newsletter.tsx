"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's ruled email field with a "Send" text button, as in the original. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return <p className="mt-auto border border-border p-4 text-center text-body">{state.message}</p>;
	}

	return (
		<form action={action} className="mt-8 xl:mt-auto">
			<div className="flex items-center border-b border-border">
				<label htmlFor="footer-email" className="sr-only">
					Email address
				</label>
				<input
					id="footer-email"
					type="email"
					name="email"
					required
					placeholder="Email Address"
					className="h-11 min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-foreground"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className="cursor-pointer rounded-full px-2 py-1 text-micro font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isPending ? "Sending…" : "Send"}
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className="mt-4 [&>span]:text-micro [&>span]:leading-[1.6] [&>span]:opacity-100"
			/>
			{state?.error && (
				<p role="alert" className="mt-3 text-micro font-semibold">
					{state.error}
				</p>
			)}
		</form>
	);
}
