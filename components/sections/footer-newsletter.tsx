"use client";

import { ArrowRight, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	if (state?.success) {
		return (
			<div className="rounded-2xl border border-border bg-background p-8">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-[var(--mahogany)] text-[var(--bone)]">
						<CheckIcon className="h-5 w-5" />
					</div>
					<p className="text-base font-medium text-foreground">You&apos;re on the list.</p>
				</div>
				<p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={action} className="w-full">
			<div className="flex flex-col sm:flex-row gap-3">
				<input
					type="email"
					name="email"
					placeholder="your@email.com"
					required
					className="h-13 w-full flex-1 rounded-full border border-border bg-background px-6 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground focus:ring-2 focus:ring-foreground/10"
				/>
				<button
					type="submit"
					disabled={isPending}
					className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-[11px] tracking-[0.22em] uppercase font-medium text-[var(--bone)] transition-all hover:bg-[var(--mahogany)] disabled:opacity-50"
				>
					{isPending ? "Subscribing…" : "Subscribe"}
					{!isPending && <ArrowRight className="h-4 w-4" />}
				</button>
			</div>
			{state?.error && <p className="mt-3 text-xs text-destructive">{state.error}</p>}
			<p className="mt-3 text-xs text-muted-foreground/80">
				By subscribing you agree to receive a monthly letter. Unsubscribe anytime.
			</p>
		</form>
	);
}
