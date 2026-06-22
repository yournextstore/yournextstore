"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-yns-pink">
			<div className="absolute inset-0 yns-grain pointer-events-none" aria-hidden="true" />
			<div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-yns-ink text-yns-cream">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="yns-display text-4xl sm:text-5xl text-yns-ink not-italic uppercase">
								You&apos;re on the list
							</h2>
							<p className="mt-4 text-yns-ink/70">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] tracking-[0.28em] uppercase font-bold text-yns-ink/70">
								The YNS Letter
							</p>
							<h2 className="mt-4 yns-display text-4xl sm:text-5xl lg:text-6xl text-yns-ink not-italic uppercase leading-[0.95]">
								First dibs, soft drops,
								<br />
								<em className="italic">salon secrets</em>.
							</h2>
							<p className="mt-6 text-base leading-relaxed text-yns-ink/70 max-w-md mx-auto">
								Subscribe for early access to new launches, restocks, and stylist-only routines.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-yns-ink/15 bg-yns-cream/70 px-5 text-yns-ink outline-none transition-all placeholder:text-yns-ink/40 focus:border-yns-ink focus:ring-2 focus:ring-yns-ink/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-yns-ink px-8 text-[11px] tracking-[0.22em] uppercase font-bold text-yns-cream transition-all hover:bg-yns-ink/85 disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
