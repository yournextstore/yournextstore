"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	if (state?.success) {
		return (
			<div className="flex items-center gap-2 neo-border bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] px-4 py-3">
				<CheckIcon className="h-4 w-4" />
				<span className="text-sm">{state.message}</span>
			</div>
		);
	}

	return (
		<form action={action} className="flex flex-col gap-2">
			<div className="flex w-full">
				<input
					type="email"
					name="email"
					required
					placeholder="Email address"
					className="bg-transparent neo-border border-r-0 border-[var(--color-on-tertiary)] text-[var(--color-on-tertiary)] placeholder:text-[var(--color-on-tertiary)]/50 focus:outline-none focus:ring-0 px-4 py-2 w-full text-sm"
				/>
				<button
					type="submit"
					disabled={isPending}
					className="bg-[var(--color-surface)] text-foreground neo-border label-caps px-4 py-2 hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] transition-colors disabled:opacity-50"
				>
					{isPending ? "..." : "Join"}
				</button>
			</div>
			{state?.error && <p className="text-sm text-[var(--color-secondary-container)]">{state.error}</p>}
		</form>
	);
}
