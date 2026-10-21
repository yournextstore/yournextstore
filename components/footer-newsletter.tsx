"use client";

import { CheckIcon, Loader2, Send } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The original's footer sign-up: a pill input joined to a round send button. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p className="flex items-center gap-2 pl-2.5 text-sm font-medium">
				<CheckIcon aria-hidden="true" className="size-4" />
				{state.message || "You're on the list."}
			</p>
		);
	}

	return (
		<form action={action} className="flex flex-col gap-3">
			<div className="flex h-10 w-full items-center">
				<label htmlFor={inputId} className="sr-only">
					Email
				</label>
				<input
					id={inputId}
					type="email"
					name="email"
					required
					placeholder="your@email.com"
					className="h-10 w-full min-w-0 rounded-l-full border border-r-0 border-input bg-background px-4 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className="inline-flex size-10 shrink-0 items-center justify-center rounded-r-full bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
				>
					{isPending ? (
						<Loader2 aria-hidden="true" className="size-4 animate-spin" />
					) : (
						<Send aria-hidden="true" className="size-4" />
					)}
					<span className="sr-only">Join the newsletter</span>
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className="[&>span]:text-xs [&>span]:opacity-100 [&>span]:text-foreground/80"
			/>
			{state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
		</form>
	);
}
