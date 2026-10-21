"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { ArrowLongRightIcon } from "@/components/icons";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's newsletter: an underlined email field with the long arrow as its submit. */
export function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return <p className="text-ink-soft">{state.message}</p>;
	}

	return (
		<form action={action}>
			<div className="relative mb-4">
				<label htmlFor={inputId} className="sr-only">
					Email address
				</label>
				<input
					id={inputId}
					type="email"
					name="email"
					required
					autoComplete="email"
					placeholder="email address"
					className="h-12 w-full border-b border-hairline bg-transparent pr-12 pl-4 text-body placeholder:text-ink-soft focus:border-black focus:outline-none"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					aria-label="Subscribe"
					className="absolute top-1/2 right-0 inline-flex h-12 w-10 -translate-y-1/2 items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
				>
					<ArrowLongRightIcon className="size-6" />
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className="text-ink-soft [&_span]:text-caption [&_span]:opacity-100"
			/>
			{state?.error && <p className="mt-3 text-caption text-destructive">{state.error}</p>}
		</form>
	);
}
