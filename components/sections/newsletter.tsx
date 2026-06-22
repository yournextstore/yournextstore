"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[var(--tropic-cream)] overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
				<div className="relative rounded-[40px] bg-[var(--tropic-cyan)] text-white px-6 sm:px-12 py-16 sm:py-24 overflow-hidden">
					{/* Decorative leaves */}
					<svg
						className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 w-[260px] opacity-25 hidden md:block"
						viewBox="0 0 200 200"
						fill="none"
						aria-hidden="true"
					>
						<title>Leaf left</title>
						<path
							d="M30 180 C 50 130, 90 90, 160 60"
							stroke="#f7e9c9"
							strokeWidth="1.6"
							strokeLinecap="round"
						/>
						<path d="M60 160 L 70 130" stroke="#f7e9c9" strokeWidth="1.2" strokeLinecap="round" />
						<path d="M100 110 L 120 80" stroke="#f7e9c9" strokeWidth="1.2" strokeLinecap="round" />
						<path d="M130 90 L 150 60" stroke="#f7e9c9" strokeWidth="1.2" strokeLinecap="round" />
					</svg>

					<div className="relative max-w-2xl mx-auto text-center">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tropic-yellow)] text-[#15323b]">
									<CheckIcon className="h-7 w-7" />
								</div>
								<h2 className="font-display italic text-4xl sm:text-5xl font-light tracking-tight">
									You’re in. Welcome.
								</h2>
								<p className="mt-3 text-white/85">{state.message}</p>
							</div>
						) : (
							<>
								<span className="text-[11px] uppercase tracking-[0.32em] text-[var(--tropic-yellow)] font-semibold">
									Field notes from the wild
								</span>
								<h2 className="font-display italic mt-3 text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight">
									Get the adventure dispatch.
								</h2>
								<p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85 max-w-md mx-auto">
									Once-a-month emails with new drops, trail-tested gear, and 10% off your first order.
								</p>
								<form
									action={action}
									className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center"
								>
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-14 w-full flex-1 rounded-full bg-white/15 border border-white/30 px-6 text-white outline-none transition-all placeholder:text-white/60 focus:border-[var(--tropic-yellow)] focus:bg-white/20"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--tropic-yellow)] px-8 font-semibold text-[#15323b] transition-all hover:bg-[#ffd62b] hover:scale-[1.02] disabled:opacity-50 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</form>
								{state?.error && <p className="mt-4 text-sm text-[var(--tropic-yellow)]">{state.error}</p>}
								<p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/60">
									No spam. Unsubscribe anytime.
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
