"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-pop-pink-block text-white">
			<div aria-hidden className="absolute inset-0 bg-pop-dots opacity-20 mix-blend-overlay" />

			{/* floating shapes */}
			<svg aria-hidden viewBox="0 0 200 200" className="absolute -top-10 -left-10 h-44 w-44 opacity-40">
				<title>shape</title>
				<circle cx="100" cy="100" r="90" fill="#FFC107" />
			</svg>
			<svg aria-hidden viewBox="0 0 200 200" className="absolute -bottom-12 right-0 h-56 w-56 opacity-50">
				<title>shape</title>
				<path d="M40 100 Q100 20 160 100 Q100 180 40 100" fill="#7FD9CF" />
			</svg>

			<div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				{state?.success ? (
					<div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-pop-yellow text-pop-ink">
							<CheckIcon className="h-7 w-7" />
						</div>
						<h2 className="font-display text-4xl sm:text-5xl uppercase">You&apos;re on the list</h2>
						<p className="mt-3 text-white/80">{state.message}</p>
					</div>
				) : (
					<div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
						<div>
							<p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-pop-yellow">
								Inbox party
							</p>
							<h2 className="mt-3 font-display text-5xl sm:text-7xl uppercase leading-[0.9]">
								Pop into <br />
								<span className="text-pop-yellow">our list</span>
							</h2>
							<p className="mt-5 max-w-md text-white/85 leading-relaxed">
								Get 10% off your first 12-pack, plus first dibs on seasonal flavors, pop-up parties, and
								unreleased cocktail builds. No spam — only sticky fingers.
							</p>
						</div>
						<form action={action} className="w-full">
							<div className="rounded-3xl bg-white p-2 shadow-[8px_8px_0_rgba(47,47,47,0.92)]">
								<div className="flex flex-col sm:flex-row items-stretch gap-2">
									<input
										type="email"
										name="email"
										placeholder="you@cocktail.club"
										required
										className="h-14 flex-1 rounded-2xl bg-transparent px-5 text-pop-ink placeholder:text-pop-ink/40 outline-none"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-pop-ink px-8 text-sm font-semibold uppercase tracking-[0.22em] text-white transition-all hover:bg-primary disabled:opacity-50"
									>
										{isPending ? "Sending…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</div>
							</div>
							<p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-white/70 font-semibold">
								By subscribing you confirm you&apos;re 21+ and ready to party responsibly.
							</p>
							{state?.error && <p className="mt-3 text-sm text-pop-yellow">{state.error}</p>}
						</form>
					</div>
				)}
			</div>
		</section>
	);
}
