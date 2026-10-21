"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The coral band's sign-up: an outlined pill field beside the ink "Sign me up" pill, consent underneath. */
export function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p role="status" className="serif mx-auto max-w-md text-2xl italic">
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="on-coral mx-auto flex max-w-[520px] flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
					className="h-[54px] w-full min-w-0 flex-1 rounded-full border border-white/70 bg-transparent px-[18px] text-white outline-none placeholder:text-white/85 focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/40"
				/>
				<button
					type="submit"
					disabled={isPending || !consent}
					className="btn-pill shrink-0 [--btn-hover:#141e19]"
				>
					{isPending ? "Signing up…" : "Sign me up"} <span aria-hidden="true">↗</span>
				</button>
			</div>
			<NewsletterConsent checked={consent} onCheckedChange={setConsent} className="text-xs text-white" />
			{state?.error && (
				<p role="alert" className="rounded-full bg-white/95 px-4 py-1.5 text-xs text-[#9b3324]">
					{state.error}
				</p>
			)}
		</form>
	);
}
