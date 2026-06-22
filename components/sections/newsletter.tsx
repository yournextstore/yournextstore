"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section id="contact" className="relative bg-ember text-cream overflow-hidden">
			<div aria-hidden className="absolute inset-0 bg-fire-soft opacity-95" />
			<div aria-hidden className="absolute inset-0 flame-noise opacity-50" />
			<div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-soot">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="font-display text-5xl text-cream">You&apos;re on the list.</h2>
							<p className="mt-3 text-cream/80">{state.message}</p>
						</div>
					) : (
						<>
							<span className="inline-flex items-center gap-3 text-[11px] font-condensed tracking-[0.32em] text-gold">
								<span aria-hidden className="h-px w-10 bg-gold/70" />
								The Heat Letter
								<span aria-hidden className="h-px w-10 bg-gold/70" />
							</span>
							<h2 className="mt-5 font-display text-5xl sm:text-6xl text-cream leading-[1.02] heading-shadow">
								Subscribe or starve.
							</h2>
							<p className="mt-5 text-cream/85 max-w-md mx-auto leading-relaxed">
								New drops, secret recipes, and the occasional rant. One email a month. We promise to never be
								polite.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 border-2 border-cream/30 bg-soot/40 px-5 text-cream outline-none transition-all placeholder:text-cream/40 focus:border-gold focus:bg-soot/60 font-body"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-gold px-7 font-condensed tracking-[0.18em] text-sm text-soot border-2 border-gold hover:bg-cream hover:border-cream transition-colors disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Sign Me Up"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && (
								<p className="mt-4 text-sm text-cream/95 bg-soot/40 inline-block px-3 py-1">{state.error}</p>
							)}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
