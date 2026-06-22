"use client";

import { ArrowUpRight, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-olive-gradient text-[var(--cream)] overflow-hidden">
			{/* Botanical pattern */}
			<svg
				aria-hidden="true"
				className="absolute -top-24 -right-24 w-[500px] h-[500px] text-[var(--cream)] opacity-[0.08]"
				viewBox="0 0 200 200"
				fill="none"
				stroke="currentColor"
				strokeWidth="0.5"
			>
				<path d="M100 20 C 60 60, 50 100, 100 180 C 150 100, 140 60, 100 20 Z" />
				<path d="M100 20 L 100 180" />
				<path d="M100 50 L 75 38" />
				<path d="M100 70 L 130 55" />
				<path d="M100 90 L 70 75" />
				<path d="M100 110 L 135 95" />
				<path d="M100 130 L 75 115" />
			</svg>

			<div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32">
				<div className="max-w-2xl">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cream)]/15 border border-[var(--cream)]/20">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-display text-5xl sm:text-6xl tracking-tight">You&apos;re on the list</h2>
							<p className="mt-4 text-[var(--cream)]/70">{state.message}</p>
						</div>
					) : (
						<>
							<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[var(--cream)]/70 mb-6">
								<span className="h-px w-8 bg-[var(--cream)]/50" />
								Letters from the Atelier
							</span>
							<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1]">
								Notes from a <em className="italic font-light">slower</em> shop.
							</h2>
							<p className="mt-6 text-lg leading-relaxed text-[var(--cream)]/70 max-w-md">
								Seasonal letters with new editions, refill drops, and field notes. Two emails a month, max.
							</p>
							<form action={action} className="mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-[var(--cream)]/20 bg-[var(--cream)]/10 px-6 text-[var(--cream)] outline-none transition-all placeholder:text-[var(--cream)]/40 focus:border-[var(--cream)]/50 focus:bg-[var(--cream)]/15"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--cream)] px-8 font-medium text-[var(--olive-deep)] transition-all hover:bg-[var(--clay)] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && (
										<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
									)}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-200">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
