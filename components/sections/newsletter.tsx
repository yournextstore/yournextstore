"use client";

import { ArrowRightIcon, CheckIcon, Gift } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section id="newsletter" className="relative isolate overflow-hidden bg-chili text-cream">
			<div
				aria-hidden
				className="absolute inset-0 -z-10 opacity-30"
				style={{
					backgroundImage:
						"repeating-linear-gradient(135deg, transparent 0, transparent 40px, rgba(245,229,200,0.05) 40px, rgba(245,229,200,0.05) 80px)",
				}}
			/>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cream/15 border-2 border-cream/30">
							<CheckIcon className="h-7 w-7" />
						</div>
						<h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase">You&apos;re in.</h2>
						<p className="mt-3 text-cream/70">{state.message}</p>
					</div>
				) : (
					<>
						<div className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-4 py-1.5 mb-6">
							<Gift className="h-3.5 w-3.5" />
							<span className="font-display text-[11px] uppercase tracking-[0.28em]">
								Win a year of snacks
							</span>
						</div>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold uppercase leading-[0.95]">
							Enter the
							<br />
							<span className="font-script italic normal-case text-cream/95">giveaway</span>
						</h2>
						<p className="mt-6 text-base sm:text-lg text-cream/80 max-w-lg mx-auto leading-relaxed">
							New flavors, early drops, behind-the-scenes glaze chaos. Plus, one new subscriber every month
							gets a year of snacks on us.
						</p>
						<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:gap-2">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-14 w-full flex-1 rounded-full border-2 border-cream/30 bg-cream/10 px-6 text-cream outline-none transition-all placeholder:text-cream/50 focus:border-cream focus:bg-cream/20"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-cream px-8 font-display text-sm uppercase tracking-[0.18em] text-chili transition-all hover:bg-charcoal hover:text-cream disabled:opacity-50"
							>
								{isPending ? "Joining…" : "Enter"}
								{!isPending && (
									<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								)}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-cream/90">{state.error}</p>}
						<p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-cream/50">
							No spam · Unsubscribe whenever
						</p>
					</>
				)}
			</div>
		</section>
	);
}
