"use client";

import { Loader2, SendHorizontal } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The original's JoinNewsletterForm: one input with a send button tucked inside it. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return <p className="text-sm text-muted-foreground">{state.message || "You have been subscribed."}</p>;
	}

	return (
		<form action={action} className="grid w-full gap-3" autoComplete="off">
			<div className="relative">
				<label htmlFor={inputId} className="sr-only">
					Email
				</label>
				<input
					id={inputId}
					type="email"
					name="email"
					required
					placeholder="you@example.com"
					className="h-9 w-full rounded-md border border-input bg-transparent px-3 pr-12 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className="absolute top-1 right-1 inline-flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
				>
					{isPending ? (
						<Loader2 className="size-3 animate-spin" aria-hidden="true" />
					) : (
						<SendHorizontal className="size-3" aria-hidden="true" />
					)}
					<span className="sr-only">Join newsletter</span>
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className="text-muted-foreground [&_span]:text-xs [&_span]:opacity-100"
			/>
			{state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
		</form>
	);
}
