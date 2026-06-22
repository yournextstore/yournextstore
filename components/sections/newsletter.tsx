"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-burgundy-deep text-cream relative overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[radial-gradient(40%_60%_at_75%_30%,oklch(0.42_0.13_8/0.55),transparent_70%)]"
			/>
			<div className="bg-grain absolute inset-0" />
			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-cream/30">
							<CheckIcon className="h-5 w-5" />
						</div>
						<h2 className="font-serif text-3xl sm:text-4xl">You&apos;re on the list.</h2>
						<p className="mt-3 text-cream/70 text-sm">{state.message}</p>
					</div>
				) : (
					<>
						<p className="text-[10px] tracking-[0.32em] uppercase text-cream/65 mb-5">
							— Letters from the apothecary —
						</p>
						<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-cream">
							Stories, formulations, and slow-living rituals.
						</h2>
						<p className="mt-4 text-cream/70 max-w-lg mx-auto text-sm leading-relaxed">
							A quiet monthly note from our founder. New formulations, sleep research worth reading, and first
							access to small-batch releases.
						</p>
						<form action={action} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full border border-cream/25 bg-cream/[0.06] px-5 text-cream outline-none transition-all placeholder:text-cream/35 focus:border-cream/55 focus:ring-2 focus:ring-cream/15"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-cream px-7 text-[11px] tracking-[0.28em] uppercase font-semibold text-burgundy-deep transition-all hover:bg-cream/90 disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-red-200/80">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
