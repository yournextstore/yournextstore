"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section id="contact" className="relative granite border-t border-white/5 overflow-hidden">
			<div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#d9cde6]/10 blur-[180px]" />
			<div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32">
				<div className="max-w-3xl">
					<div className="text-[10px] tracking-[0.32em] uppercase text-lilac mb-6">— 05 / Stay Close</div>
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-lilac text-[#1a1a1e]">
								<CheckIcon className="h-5 w-5" />
							</div>
							<h2 className="font-display font-light text-bone text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em]">
								You&apos;re on the <span className="italic">list</span>.
							</h2>
							<p className="mt-6 text-foreground/65 text-lg max-w-md">{state.message}</p>
						</div>
					) : (
						<>
							<h2 className="font-display font-light text-bone text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em]">
								Field <span className="italic">notes</span>, training drops, early flavors.
							</h2>
							<p className="mt-6 text-foreground/65 text-lg max-w-xl">
								One email a month from the lab and the track. No filler, no resends, no algorithms.
							</p>
							<form action={action} className="mt-12 max-w-xl">
								<div className="flex items-center border-b border-white/25 focus-within:border-lilac transition-colors">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										aria-label="Email address"
										className="flex-1 h-14 bg-transparent text-bone text-lg outline-none placeholder:text-foreground/35"
									/>
									<button
										type="submit"
										disabled={isPending}
										aria-label="Subscribe"
										className="inline-flex h-12 w-12 shrink-0 items-center justify-center text-bone hover:text-lilac transition-colors disabled:opacity-40"
									>
										{isPending ? (
											<span className="text-xs tracking-[0.2em] uppercase">…</span>
										) : (
											<ArrowRightIcon className="h-5 w-5" />
										)}
									</button>
								</div>
								<p className="mt-4 text-xs text-foreground/45">
									By subscribing you agree to receive marketing emails. Unsubscribe anytime.
								</p>
								{state?.error && <p className="mt-4 text-sm text-destructive/90">{state.error}</p>}
							</form>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
