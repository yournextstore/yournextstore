"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const id = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div className="max-w-md">
			<h2 className="mb-5 text-xl font-light">Sign up to Our Newsletter</h2>
			{state?.success ? (
				<p className="text-sm">{state.message}</p>
			) : (
				<form action={action} className="space-y-5">
					<div className="space-y-3">
						<label htmlFor={id} className="block text-sm font-medium">
							Email*
						</label>
						<input
							id={id}
							type="email"
							name="email"
							required
							placeholder="Email"
							autoComplete="email"
							className="h-10 w-full rounded-sm border border-input bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
						/>
					</div>
					<NewsletterConsent
						checked={marketingConsent}
						onCheckedChange={setMarketingConsent}
						disabled={isPending}
					/>
					<button
						type="submit"
						disabled={isPending || !marketingConsent}
						className="inline-flex h-11 items-center justify-center rounded-sm border border-input px-8 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
					>
						{isPending ? "Submitting…" : "Submit"}
					</button>
					{state?.error && <p className="text-sm text-destructive">{state.error}</p>}
				</form>
			)}
		</div>
	);
}
