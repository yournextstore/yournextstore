"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-[var(--brand-ember)] text-[var(--brand-cream)]">
			{/* Faint paper grain */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
				style={{
					backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
					backgroundSize: "4px 4px",
				}}
			/>
			<div className="relative mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20 lg:px-10 lg:py-28">
				<div>
					<p className="font-mono-ed text-[10px] uppercase tracking-[0.32em] text-[var(--brand-cream)]/80">
						The Drop — Issue 04
					</p>
					<h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.01em]">
						Get the next recipe before everyone else.
					</h2>
					<p className="mt-6 max-w-md font-mono-ed text-[12px] leading-relaxed text-[var(--brand-cream)]/85">
						One short letter, every other Sunday. Recipes, restock alerts, and the occasional strong opinion
						about garlic.
					</p>
				</div>

				<div>
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--brand-cream)]/40 bg-[var(--brand-cream)]/10">
								<Check className="h-5 w-5" />
							</div>
							<h3 className="font-display text-3xl font-medium">You&apos;re on the list.</h3>
							<p className="mt-3 font-mono-ed text-[12px] text-[var(--brand-cream)]/85">{state.message}</p>
						</div>
					) : (
						<form action={action} className="space-y-4">
							<label
								htmlFor="newsletter-email"
								className="block font-mono-ed text-[10px] uppercase tracking-[0.28em] text-[var(--brand-cream)]/70"
							>
								Your email
							</label>
							<div className="flex flex-col gap-3 sm:flex-row">
								<input
									id="newsletter-email"
									type="email"
									name="email"
									placeholder="hello@yournextstore.com"
									required
									className="h-12 flex-1 border-b border-[var(--brand-cream)]/40 bg-transparent px-1 font-mono-ed text-[13px] tracking-wide text-[var(--brand-cream)] outline-none transition-colors placeholder:text-[var(--brand-cream)]/45 focus:border-[var(--brand-cream)]"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 border border-[var(--brand-cream)] bg-[var(--brand-cream)] px-7 font-mono-ed text-[11px] uppercase tracking-[0.18em] text-[var(--brand-ember)] transition-colors hover:bg-[var(--brand-cream)]/90 disabled:opacity-60"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRight className="h-3.5 w-3.5" />}
								</button>
							</div>
							{state?.error && (
								<p className="font-mono-ed text-[11px] text-[var(--brand-cream)]/90">{state.error}</p>
							)}
							<p className="font-mono-ed text-[10px] uppercase tracking-[0.22em] text-[var(--brand-cream)]/55">
								No spam. Unsubscribe anytime.
							</p>
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
