"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * The original's email field + "Send": white field and dark button on the grey newsletter band,
 * outlined field and light button in the footer. The platform's consent box sits underneath.
 */
export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const id = useId();
	const dark = tone === "dark";

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p role="status" className="flex items-center gap-2 text-[15px]">
				<CheckIcon className="h-4 w-4" aria-hidden="true" />
				{state.message}
			</p>
		);
	}

	return (
		<form action={action} className="flex w-full flex-col gap-3 text-left">
			<div className="flex gap-3">
				<label htmlFor={`${id}-email`} className="sr-only">
					Email address
				</label>
				<input
					id={`${id}-email`}
					type="email"
					name="email"
					required
					placeholder="Please enter your email"
					className={cn(
						"h-12 w-full min-w-0 flex-1 rounded-md border px-3.5 text-base focus:outline-none sm:text-sm",
						dark
							? "border-line bg-ink-field text-on-ink placeholder:text-line focus:border-on-ink"
							: "border-line bg-white text-foreground placeholder:text-muted-foreground focus:border-foreground",
					)}
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className={cn(
						"h-12 shrink-0 rounded-md px-5 text-sm font-bold transition-opacity disabled:cursor-not-allowed",
						dark
							? "bg-on-ink text-ink-field hover:opacity-90 disabled:opacity-80"
							: "rounded-[16px] bg-primary font-normal text-primary-foreground hover:opacity-90 disabled:opacity-80",
					)}
				>
					{isPending ? "Sending…" : dark ? "Send →" : "Submit"}
				</button>
			</div>
			<div
				className={cn(
					dark ? "text-ink-muted [&_a]:text-on-ink [&_button]:border-line" : "text-muted-foreground",
				)}
			>
				<NewsletterConsent
					checked={marketingConsent}
					onCheckedChange={setMarketingConsent}
					disabled={isPending}
				/>
			</div>
			{state?.error && (
				<p className={cn("text-sm", dark ? "text-red-200" : "text-destructive")}>{state.error}</p>
			)}
		</form>
	);
}
