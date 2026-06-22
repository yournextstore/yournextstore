"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-foreground text-background overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				{/* Decorative glow */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-tan/20 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-24 right-0 h-[22rem] w-[22rem] rounded-full bg-burgundy/30 blur-3xl"
				/>

				<div className="relative max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-background/10">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl tracking-tight">You&apos;re on the list</h2>
							<p className="mt-3 text-background/70">{state.message}</p>
						</div>
					) : (
						<>
							<div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-background/70">
								<span className="h-1.5 w-1.5 rounded-full bg-tan" />
								Atelier letters · monthly
							</div>
							<h2 className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight">
								Get 20% off your first piece
							</h2>
							<p className="mt-5 text-lg leading-relaxed text-background/70 max-w-md mx-auto">
								Use code <span className="font-medium text-background">YNS20</span> at checkout. Plus early
								access to new editions and behind-the-bench stories.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-background/20 bg-background/10 px-5 text-background outline-none transition-all placeholder:text-background/30 focus:border-background/40 focus:ring-2 focus:ring-background/10"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-background px-8 font-medium text-foreground transition-all hover:bg-background/90 disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
							<p className="mt-4 text-xs uppercase tracking-[0.22em] text-background/40">
								No spam · Unsubscribe anytime
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
