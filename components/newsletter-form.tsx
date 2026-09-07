"use client";

import { useActionState, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";

/**
 * The store's newsletter signup, in the section (full) and the footer (compact).
 *
 * Both variants post to the same server action, so a signup is recorded once with the
 * shopper's marketing consent attached — the submit button stays disabled until the box
 * is ticked, and the action refuses a submission without it.
 */
export function NewsletterForm({ compact }: { compact?: boolean }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	if (state?.success) {
		return (
			<p
				className={
					compact
						? "text-sm font-bold uppercase tracking-wide text-foreground"
						: "text-base font-bold uppercase tracking-wide text-black"
				}
			>
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className={compact ? "flex flex-col gap-3" : "flex flex-col gap-3 max-w-md mx-auto"}>
			<div className={compact ? "flex gap-2" : "flex flex-col sm:flex-row gap-3"}>
				<input
					type="email"
					name="email"
					required
					placeholder={compact ? "Email" : "Email Address"}
					className={
						compact
							? "flex-1 h-10 px-4 rounded-full border-[2px] border-foreground bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#5aff24]"
							: "flex-1 h-14 px-6 rounded-full border-[3px] border-black bg-white text-black placeholder:text-black/40 text-base focus:outline-none focus:ring-2 focus:ring-[#5aff24]"
					}
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className={
						compact
							? "h-10 px-5 bg-foreground text-primary-foreground rounded-full text-sm font-bold uppercase border-[2px] border-foreground hover:bg-foreground/90 transition-colors disabled:opacity-50"
							: "h-14 px-8 bg-black text-white rounded-full text-base font-bold uppercase tracking-wide border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
					}
				>
					{isPending ? (compact ? "…" : "Subscribing…") : compact ? "Go" : "Subscribe"}
				</button>
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
				className={compact ? "text-xs" : "text-black"}
			/>
			{state?.error && (
				<p className={compact ? "text-sm text-destructive" : "text-sm font-medium text-black"}>{state.error}</p>
			)}
		</form>
	);
}
