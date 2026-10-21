"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's "Subscribe newsletter" column: a hard-shadowed field over an orange button. */
export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div>
			<h2 className="font-title mb-[30px] text-sp-10">Subscribe newsletter</h2>
			{state?.success ? (
				<p role="status" className="text-base">
					{state.message || "You are on the list."}
				</p>
			) : (
				<form action={action}>
					<label htmlFor={inputId} className="sr-only">
						Email address
					</label>
					<input
						id={inputId}
						type="email"
						name="email"
						placeholder="Enter your email address"
						required
						autoComplete="email"
						className="mb-4 w-full border-2 border-ink bg-background px-[30px] py-[15px] text-base shadow-brut outline-none transition-shadow placeholder:text-muted-foreground focus:shadow-none"
					/>
					<NewsletterConsent
						checked={marketingConsent}
						onCheckedChange={setMarketingConsent}
						disabled={isPending}
						className="mb-[25px]"
					/>
					<button
						type="submit"
						disabled={isPending || !marketingConsent}
						className="btn-brut btn-orange btn-brut-md text-base [--btn-px-md:40px] [--btn-px:40px]"
					>
						{isPending ? "Subscribing…" : "Subscribe"}
					</button>
					{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
				</form>
			)}
		</div>
	);
}
