"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The newsletter band's inline sign-up: email + "Sign up", consent underneath. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p role="status" className="max-w-md text-sm text-ink">
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="flex w-full max-w-md flex-col gap-2 lg:w-auto">
			<div className="flex w-full items-center gap-3">
				<label htmlFor="newsletter-email" className="sr-only">
					Your email address
				</label>
				<input
					id="newsletter-email"
					required
					type="email"
					name="email"
					autoComplete="email"
					placeholder="Your email address"
					className="h-11 w-full min-w-0 rounded-form border border-input bg-surface px-4 text-sm text-ink outline-none placeholder:text-muted-foreground focus:border-primary lg:w-64"
				/>
				<button
					type="submit"
					disabled={isPending || !consent}
					className="h-11 shrink-0 rounded-form bg-primary px-6 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isPending ? "Signing up…" : "Sign up"}
				</button>
			</div>
			<NewsletterConsent checked={consent} onCheckedChange={setConsent} className="text-xs text-ink" />
			{state?.error && (
				<p role="alert" className="text-xs text-destructive">
					{state.error}
				</p>
			)}
		</form>
	);
}
