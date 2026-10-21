"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** Horizon's footer signup: one bordered field with the arrow button inside it. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p className="mt-6 flex items-center gap-2 text-copy text-plum">
				<Check className="h-4 w-4 text-ink" aria-hidden />
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="mt-6 w-full max-w-[22rem] space-y-3">
			<div className="relative">
				<label htmlFor="footer-email" className="sr-only">
					Email address
				</label>
				<input
					id="footer-email"
					type="email"
					name="email"
					required
					placeholder="Email address"
					className="h-12 w-full rounded-lg border border-input bg-background pl-4 pr-12 text-copy text-ink outline-none placeholder:text-plum focus-visible:border-ink"
				/>
				<button
					type="submit"
					disabled={isPending || !consent}
					aria-label="Subscribe"
					className="absolute right-1 top-1 inline-flex size-10 items-center justify-center text-ink disabled:opacity-40"
				>
					<ArrowRight className="h-5 w-5" strokeWidth={1.75} />
				</button>
			</div>
			<NewsletterConsent
				checked={consent}
				onCheckedChange={setConsent}
				disabled={isPending}
				className="text-plum"
			/>
			{state?.error && <p className="text-copy text-destructive">{state.error}</p>}
		</form>
	);
}
