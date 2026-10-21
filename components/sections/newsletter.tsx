"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** Footer signup in the original's shape: a pill field with the button inside it. */
export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const id = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<form action={action} className="newsletter">
			<label htmlFor={id}>News by email</label>
			<div className="newsletter-field">
				<input
					id={id}
					type="email"
					name="email"
					required
					placeholder="Your email address"
					autoComplete="email"
				/>
				<button type="submit" className="button primary sm" disabled={isPending || !marketingConsent}>
					{isPending ? "Subscribing…" : "Subscribe"}
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className="newsletter-consent"
			/>
			{state?.success ? (
				<p role="status">{state.message}</p>
			) : state?.error ? (
				<p role="alert" className="field-error">
					{state.error}
				</p>
			) : (
				<p>New arrivals and offers, now and then.</p>
			)}
		</form>
	);
}
