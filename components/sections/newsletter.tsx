"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="cream-bg relative overflow-hidden">
			{/* Decorative flourish */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-terracotta/15 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-walnut/15 blur-3xl"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-terracotta bg-terracotta/10">
								<CheckIcon className="h-5 w-5 text-terracotta" />
							</div>
							<h2 className="font-serif text-4xl sm:text-5xl text-espresso">You're on the list.</h2>
							<p className="mt-4 text-base text-walnut/70">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] tracking-[0.3em] uppercase text-terracotta font-medium mb-5">
								Letters from the atelier
							</p>
							<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-espresso leading-tight">
								Quiet notes, <span className="italic">first dibs</span>
							</h2>
							<p className="mt-5 text-base sm:text-lg text-walnut/70 leading-relaxed max-w-lg mx-auto">
								Be the first to hear about new arrivals, limited-run colourways, and rituals from behind the
								loom.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
							>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 border border-walnut/30 bg-cream/60 px-5 text-espresso outline-none transition-all placeholder:text-walnut/40 focus:border-terracotta focus:bg-cream"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-espresso px-10 text-[11px] tracking-[0.22em] uppercase font-medium text-cream transition-all hover:bg-walnut disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
								</button>
							</form>
							<p className="mt-4 text-xs text-walnut/50 tracking-wider">No spam. Unsubscribe in one click.</p>
							{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
