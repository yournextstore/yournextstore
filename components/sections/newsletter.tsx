"use client";

import { CheckIcon, MailIcon } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { Button } from "@/components/ui/button";
import { trackIdentify } from "@/lib/track";

/** The original's muted newsletter panel: envelope, big headline, inline field and button. */
export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const emailId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section className="bg-muted px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl">
				<div className="text-center">
					{state?.success ? (
						<CheckIcon aria-hidden className="mx-auto size-12 text-muted-foreground" strokeWidth={1.5} />
					) : (
						<MailIcon aria-hidden className="mx-auto size-12 text-muted-foreground" strokeWidth={1.5} />
					)}
					<h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
						{state?.success ? "You're subscribed" : "Subscribe to Newsletter"}
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						{state?.success
							? state.message
							: "Subscribe to our newsletter and be the first to get updates on new products and promotions."}
					</p>
				</div>
				{!state?.success && (
					<form action={action} className="mt-8 grid gap-3">
						<div className="items-end gap-4 sm:flex">
							<div className="grid flex-1 gap-2">
								<label htmlFor={emailId} className="text-sm font-medium">
									Email Address
								</label>
								<input
									id={emailId}
									type="email"
									name="email"
									required
									placeholder="john.doe@example.com"
									className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
								/>
							</div>
							<Button type="submit" disabled={isPending || !marketingConsent} className="mt-3 sm:mt-0">
								{isPending ? "Subscribing…" : "Subscribe"}
							</Button>
						</div>
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
						/>
						{state?.error && <p className="text-sm text-destructive">{state.error}</p>}
					</form>
				)}
			</div>
		</section>
	);
}
