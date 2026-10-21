"use client";

import { Check } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";
import { cn } from "@/lib/utils";

/** The reference's pill field with an amber "Join" button, plus the marketing-consent tick. */
export function NewsletterForm({ className, centered = false }: { className?: string; centered?: boolean }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);
	const id = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return (
			<p
				role="status"
				className={cn("flex items-center gap-2 text-sm text-amber", centered && "justify-center", className)}
			>
				<Check className="h-4 w-4" aria-hidden="true" />
				{state.message}
			</p>
		);
	}

	return (
		<form
			action={action}
			className={cn("flex w-full max-w-sm flex-col gap-3", centered && "mx-auto", className)}
		>
			<div className="flex items-center gap-2">
				<label htmlFor={`${id}-email`} className="sr-only">
					Email address
				</label>
				<input
					id={`${id}-email`}
					type="email"
					name="email"
					required
					autoComplete="email"
					placeholder="you@email.com"
					className="w-full min-w-0 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-base text-bone placeholder:text-[#8a9a9c] focus:border-amber/60 md:text-sm"
				/>
				<button
					type="submit"
					disabled={isPending || !consent}
					className="flex-none rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-80"
				>
					{isPending ? "…" : "Join"}
				</button>
			</div>
			<NewsletterConsent
				checked={consent}
				onCheckedChange={setConsent}
				disabled={isPending}
				className={cn("text-[#a3a3a3] [&_span]:text-xs", centered && "text-left")}
			/>
			{state?.error ? <p className="text-xs text-destructive">{state.error}</p> : null}
		</form>
	);
}
