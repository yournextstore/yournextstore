"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The drop band's sign-up: a mono coral label, a foam-outlined pill field and the coral pill. */
export function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p role="status" className="text-[1.3rem] font-bold text-foam">
				You&rsquo;re on it. Go back outside.
				<span className="label-mono mt-2 block font-normal text-coral">{state.message}</span>
			</p>
		);
	}

	return (
		<form action={action} className="on-ink flex flex-col">
			<label htmlFor="newsletter-email" className="label-mono mb-3 block tracking-[0.2em] text-coral">
				Get one email when it drops
			</label>
			<div className="flex flex-wrap gap-2.5">
				<input
					id="newsletter-email"
					required
					type="email"
					name="email"
					autoComplete="email"
					placeholder="you@somewhere-quiet.com"
					aria-describedby="newsletter-fine"
					className="min-w-0 flex-1 basis-[220px] rounded-full border-[1.5px] border-foam/35 bg-foam/[0.07] px-5 py-[13px] text-[0.95rem] text-foam outline-none transition-colors placeholder:text-[#8d9aa2] focus-visible:border-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
				/>
				<button type="submit" disabled={isPending || !consent} className="btn btn-coral">
					{isPending ? "Adding you…" : "Put me on the list"}
				</button>
			</div>
			<NewsletterConsent
				checked={consent}
				onCheckedChange={setConsent}
				className="mt-4 text-[0.8rem] text-[#c3ccd2]"
			/>
			<p
				id="newsletter-fine"
				className="label-mono mt-3 text-[0.66rem] leading-[2] tracking-[0.1em] text-[#a8b4bc]"
			>
				One email when something new lands. Nothing in between.
			</p>
			{state?.error && (
				<p role="alert" className="mt-3 rounded-full bg-foam px-4 py-1.5 text-xs text-coral-text">
					{state.error}
				</p>
			)}
		</form>
	);
}
