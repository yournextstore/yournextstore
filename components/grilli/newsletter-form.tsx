"use client";

import { CheckIcon, MailIcon } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { BtnLabel } from "@/components/grilli/btn-label";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer panel's signup: one dark field with the gold Subscribe button inset on the right. */
export function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p role="status" className="flex items-center justify-center gap-2 text-label-1 text-white">
				<CheckIcon className="size-4 text-gold" aria-hidden="true" />
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="grid gap-4">
			<div className="relative">
				<label htmlFor={inputId} className="sr-only">
					Email address
				</label>
				<MailIcon
					className="pointer-events-none absolute top-[28px] left-4 size-4 -translate-y-1/2 text-white"
					strokeWidth={1.5}
					aria-hidden="true"
				/>
				<input
					id={inputId}
					type="email"
					name="email"
					required
					autoComplete="email"
					placeholder="Your email"
					className="field-g pl-10 xs:pr-[205px]"
				/>
				<button
					type="submit"
					data-variant="solid"
					disabled={isPending || !consent}
					className="btn-g mt-5 w-full max-w-none xs:absolute xs:inset-y-0 xs:right-0 xs:mt-0 xs:w-auto xs:min-w-max"
				>
					<BtnLabel>{isPending ? "Subscribing…" : "Subscribe"}</BtnLabel>
				</button>
			</div>
			<NewsletterConsent checked={consent} onCheckedChange={setConsent} disabled={isPending} />
			{state?.error && (
				<p role="alert" className="text-label-1 text-destructive">
					{state.error}
				</p>
			)}
		</form>
	);
}
