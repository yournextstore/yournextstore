"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-cocoa-gradient border-t border-bronze/20 overflow-hidden">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-24 sm:py-32">
				<div className="max-w-3xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-bronze/40 bg-bronze/10">
								<CheckIcon className="h-6 w-6 text-bronze-light" />
							</div>
							<h2 className="font-display text-4xl sm:text-5xl text-cream">YOU'RE IN.</h2>
							<p className="mt-4 text-cream/60">{state.message}</p>
						</div>
					) : (
						<>
							<p className="font-display tracking-[0.32em] text-[11px] text-bronze-light mb-6">
								THE INSIDER LIST
							</p>
							<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-cream leading-[0.9]">
								New drops.
								<br />
								<span className="text-bronze-light">First taste.</span>
							</h2>
							<p className="mt-6 text-base sm:text-lg leading-relaxed text-cream/60 max-w-md mx-auto">
								Limited flavor drops, behind-the-kitchen stories, and the occasional 15% off.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="YOUR EMAIL"
									required
									className="h-13 w-full flex-1 border border-cream/15 bg-cream/5 px-5 text-cream outline-none transition-all placeholder:text-cream/30 placeholder:tracking-widest placeholder:text-xs focus:border-bronze-light focus:bg-cream/10"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-13 shrink-0 items-center justify-center px-10 bg-cream font-display tracking-[0.18em] text-sm text-espresso transition-all hover:bg-bronze-light disabled:opacity-50"
								>
									{isPending ? "SUBSCRIBING…" : "SUBSCRIBE"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
