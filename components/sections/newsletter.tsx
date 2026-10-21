"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";
import { cn } from "@/lib/utils";

/** Email field + Subscribe button, shared by the home band and the footer column. */
export function NewsletterForm({ variant = "band" }: { variant?: "band" | "footer" }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p
				role="status"
				className={cn("mt-5 text-base font-semibold text-primary", variant === "footer" && "mt-3 text-sm")}
			>
				Thanks — you&apos;re on the list.
			</p>
		);
	}

	const band = variant === "band";

	return (
		<form action={action} className={cn("flex flex-col gap-3", band ? "mx-auto mt-5 max-w-[30rem]" : "mt-3")}>
			{!band && (
				<label htmlFor={inputId} className="text-xs font-medium text-foreground">
					Email address
				</label>
			)}
			<div className={cn("flex gap-2.5", band ? "flex-col xs:flex-row" : "flex-col sm:flex-row")}>
				{band && (
					<label htmlFor={inputId} className="sr-only">
						Email address
					</label>
				)}
				<input
					id={inputId}
					type="email"
					name="email"
					required
					placeholder={band ? "you@example.com" : "Enter your email"}
					className={cn(
						"h-11 min-w-0 rounded-md border px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary md:h-10 xs:flex-1",
						band ? "border-border bg-canvas" : "border-input bg-background sm:flex-1",
					)}
				/>
				<button type="submit" disabled={isPending || !marketingConsent} className="ed-btn shrink-0">
					{isPending ? "Subscribing…" : "Subscribe"}
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className={cn("text-muted-foreground", band && "mx-auto max-w-[30rem]")}
			/>
			{state?.error && <p className="text-sm text-destructive">{state.error}</p>}
		</form>
	);
}

/** "Stay in the loop" band: centred eyebrow, serif title, short copy, inline form. */
export function Newsletter() {
	return (
		<section className="bg-card">
			<div className="mx-auto max-w-[42rem] px-5 py-[clamp(40px,5vw,64px)] text-center">
				<span className="ed-eyebrow mb-2.5">Stay in the loop</span>
				<h2 className="ed-display m-0 text-display-section">First look, every drop</h2>
				<p className="mx-auto mt-3 max-w-[46ch] text-base leading-[1.55] text-muted-foreground">
					Join the newsletter to hear about new arrivals, offers and the occasional good idea.
				</p>
				<NewsletterForm />
				<p className="mt-3 text-[0.78rem] text-muted-foreground">No spam. Unsubscribe anytime.</p>
			</div>
		</section>
	);
}
