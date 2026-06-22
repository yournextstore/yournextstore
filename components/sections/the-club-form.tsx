"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function ClubSubscribeForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	if (state?.success) {
		return (
			<div className="mt-9 flex items-center gap-3 border border-ink/20 bg-background px-5 py-4">
				<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-bone">
					<Check className="h-4 w-4" />
				</span>
				<div>
					<div className="font-display-wide text-[12px] tracking-[0.22em] uppercase">You&apos;re in</div>
					<div className="text-xs text-ink/70">{state.message}</div>
				</div>
			</div>
		);
	}

	return (
		<form action={action} className="mt-9">
			<div className="flex items-stretch border border-ink/25 bg-background h-12 focus-within:border-ink transition-colors">
				<input
					type="email"
					name="email"
					placeholder="your@email.com"
					required
					className="flex-1 bg-transparent px-5 text-[14px] outline-none placeholder:text-ink/40"
				/>
				<button
					type="submit"
					disabled={isPending}
					className="inline-flex items-center gap-2 bg-ink text-bone px-6 text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-brick transition-colors disabled:opacity-50"
				>
					{isPending ? "Joining…" : "Join the club"}
					{!isPending && <ArrowRight className="h-3.5 w-3.5" />}
				</button>
			</div>
			{state?.error && <p className="mt-3 text-xs text-brick">{state.error}</p>}
			<p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-ink/50">
				No spam. Two notes a month. Cancel any time.
			</p>
		</form>
	);
}
