"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's "Stay in touch" signup: white field over a full-width green button. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p role="status" className="mt-5 text-sm font-bold">
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="mt-5 flex flex-col gap-3">
			<label htmlFor={inputId} className="sr-only">
				Email address
			</label>
			<input
				id={inputId}
				type="email"
				name="email"
				required
				placeholder="Enter your email..."
				autoComplete="email"
				className="h-12 w-full rounded border border-white bg-white px-3.5 text-base text-black placeholder:text-[#6b6b6b] focus:outline-2 focus:outline-offset-2 focus:outline-white"
			/>
			<button
				type="submit"
				disabled={isPending || !marketingConsent}
				className="bp-btn w-full [--btn-h:3rem]"
			>
				{isPending ? "Signing up…" : "Sign up"}
			</button>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className="[&_button]:border-white/60"
			/>
			{state?.error && (
				<p role="alert" className="text-sm text-[#ff9b8a]">
					{state.error}
				</p>
			)}
		</form>
	);
}
