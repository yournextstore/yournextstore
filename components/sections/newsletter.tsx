"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	if (state?.success) {
		return (
			<div className="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--purple-deep)] shadow-pop">
				<CheckIcon className="h-5 w-5 text-[var(--pink)]" />
				<span>You&apos;re on the list — get ready for jiggles.</span>
			</div>
		);
	}

	return (
		<form action={action} className="w-full max-w-md flex flex-col gap-4">
			<div className="relative flex items-center rounded-full bg-white p-1.5 shadow-pop">
				<input
					type="email"
					name="email"
					placeholder="Enter your email"
					required
					className="h-11 w-full flex-1 rounded-full bg-transparent px-5 text-sm text-[var(--purple-deep)] placeholder:text-[var(--purple-deep)]/50 focus:outline-none"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[var(--pink)] px-5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--pink)]/90 disabled:opacity-50"
				>
					{isPending ? "…" : "Subscribe"}
					{!isPending && <span aria-hidden>▸</span>}
				</button>
				{state?.error && (
					<p className="absolute -bottom-7 left-0 right-0 text-center text-xs text-white/90">{state.error}</p>
				)}
			</div>
			<NewsletterConsent
				checked={marketingConsent}
				onCheckedChange={setMarketingConsent}
				disabled={isPending}
			/>
		</form>
	);
}
