"use client";

import { ArrowRight, Check, Mail } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The original's footer news signup: an outlined field with a mail icon and an arrow submit. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p className="mb-8 flex items-center gap-2 text-primary">
				<Check className="size-5" strokeWidth={1.5} aria-hidden="true" />
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="mb-8 space-y-3">
			<div className="relative">
				<label htmlFor={inputId} className="sr-only">
					Email address
				</label>
				<Mail
					className="pointer-events-none absolute left-2.5 top-1/2 size-6 -translate-y-1/2 text-primary"
					strokeWidth={1.5}
					aria-hidden="true"
				/>
				<input
					id={inputId}
					type="email"
					name="email"
					required
					placeholder="Enter your email"
					className="h-12 w-full rounded-md border border-primary bg-transparent px-12 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					aria-label="Subscribe"
					className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-primary transition-colors hover:bg-secondary-foreground/10 disabled:opacity-40"
				>
					<ArrowRight className="size-6" strokeWidth={1.5} aria-hidden="true" />
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className="text-primary"
			/>
			{state?.error && <p className="text-sm text-destructive">{state.error}</p>}
		</form>
	);
}
