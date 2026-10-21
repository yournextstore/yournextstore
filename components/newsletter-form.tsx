"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/**
 * The original's pill field with a round black send button inside it. Used by the home
 * newsletter band and the footer column; the consent box keeps the submit disabled until ticked.
 */
export function NewsletterForm({ label, note }: { label: string; note?: React.ReactNode }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<div className="flex items-start gap-3" role="status">
				<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
					<CheckIcon className="h-4 w-4" />
				</span>
				<div>
					<p className="text-sm/6 font-medium uppercase">You&apos;re on the list</p>
					<p className="text-sm/6 text-muted-foreground">{state.message}</p>
				</div>
			</div>
		);
	}

	return (
		<form action={action} className="flex w-full flex-col gap-3">
			<label htmlFor={inputId} className="text-sm/6 uppercase">
				{label}
			</label>
			<div className="relative">
				<input
					id={inputId}
					type="email"
					name="email"
					required
					placeholder="Enter your email..."
					autoComplete="email"
					className="h-11 w-full rounded-full border border-border bg-background pl-4 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-foreground"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					aria-label="Subscribe"
					className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
				>
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
						<path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
					</svg>
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className="[&_span]:text-xs [&_span]:opacity-100 [&_span]:text-muted-foreground"
			/>
			{note}
			{state?.error && <p className="text-sm text-destructive">{state.error}</p>}
		</form>
	);
}
