"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative isolate overflow-hidden bg-satin">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-gradient-to-br from-blush-soft/60 via-blush/40 to-peach/50 mix-blend-soft-light pointer-events-none"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-magenta text-white shadow-[0_18px_50px_-20px_rgba(232,51,110,0.6)]">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground">
								You&apos;re on the <span className="italic">list</span>.
							</h2>
							<p className="mt-3 text-foreground/70">{state.message}</p>
						</div>
					) : (
						<>
							<span className="text-[11px] tracking-[0.28em] uppercase text-magenta font-semibold">
								Join the Inner Circle
							</span>
							<h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]">
								Soft drops, <span className="italic">sweet perks</span>.
							</h2>
							<p className="mt-5 text-[16px] leading-relaxed text-foreground/70 max-w-md mx-auto">
								Get 10% off your first order, plus first access to restocks, new shades, and the occasional
								love note.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-foreground/15 bg-white/90 px-5 text-foreground outline-none transition-all placeholder:text-foreground/35 focus:border-magenta focus:ring-2 focus:ring-magenta/30"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-magenta px-7 text-[12px] tracking-[0.18em] uppercase font-semibold text-white transition-all hover:bg-magenta-deep disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-magenta-deep">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
