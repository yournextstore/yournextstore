"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's newsletter row: a grey field beside a small sky "Send" button. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p role="status" className="text-sm font-semibold text-ink">
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="flex w-full flex-col gap-3 md:max-w-md">
			<div className="flex w-full gap-2">
				<label htmlFor={inputId} className="sr-only">
					Email address
				</label>
				<input
					id={inputId}
					type="email"
					name="email"
					required
					placeholder="Email"
					autoComplete="email"
					className="h-10 w-full flex-1 rounded border border-input bg-gray-50 px-3 text-gray-800 placeholder:text-muted-foreground outline-none transition focus:ring-2 focus:ring-sky"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className="ds-btn [--btn-fs:0.9375rem] [--btn-fw:600] [--btn-h:2.5rem] [--btn-ls:0] [--btn-r:0.25rem]"
				>
					{isPending ? "Sending…" : "Send"}
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
			/>
			{state?.error && (
				<p role="alert" className="text-sm text-destructive">
					{state.error}
				</p>
			)}
		</form>
	);
}
