"use client";

import { ArrowRightIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<div>
			{state?.success ? (
				<p className="mt-6 text-sm text-warm-tan">{state.message}</p>
			) : (
				<form action={action} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md">
					<input
						type="email"
						name="email"
						required
						placeholder="your@email.com"
						className="h-12 flex-1 rounded-full border border-background/25 bg-transparent px-5 text-sm text-background placeholder:text-background/40 outline-none focus:border-background/60"
					/>
					<button
						type="submit"
						disabled={isPending}
						className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-warm-tan px-6 text-sm font-medium text-deep-brown transition-colors hover:bg-warm-tan/90 disabled:opacity-60"
					>
						{isPending ? "Subscribing…" : "Subscribe"}
						{!isPending && <ArrowRightIcon className="h-4 w-4" />}
					</button>
				</form>
			)}
			{state?.error && <p className="mt-3 text-xs text-red-300">{state.error}</p>}
		</div>
	);
}
