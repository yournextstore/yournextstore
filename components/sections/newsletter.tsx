"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-foreground text-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 items-center">
					<div>
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-background/10">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">You&apos;re on the list</h2>
								<p className="mt-3 text-background/60 max-w-md">{state.message}</p>
							</div>
						) : (
							<>
								<span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--butter)] mb-5">
									<span aria-hidden="true" className="h-px w-6 bg-[var(--butter)]" />
									The Slow Bake
								</span>
								<h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-medium tracking-tight leading-[1.1]">
									Get a heads up on every fresh batch — and 10% off your first order.
								</h2>
								<p className="mt-5 text-background/60 max-w-lg leading-relaxed">
									Recipes-in-progress, restock alerts, and the occasional kitchen-table essay. One email a
									month, no filler.
								</p>
							</>
						)}
					</div>

					{!state?.success && (
						<form action={action} className="flex flex-col gap-3">
							<label
								htmlFor="newsletter-email"
								className="text-xs uppercase tracking-[0.2em] text-background/50"
							>
								Email address
							</label>
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									id="newsletter-email"
									type="email"
									name="email"
									placeholder="you@email.com"
									required
									className="h-12 w-full flex-1 border border-background/20 bg-background/5 px-4 text-background outline-none transition-all placeholder:text-background/30 focus:border-[var(--butter)] focus:ring-2 focus:ring-[var(--butter)]/30"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-[var(--butter)] px-8 font-medium text-foreground transition-all hover:brightness-95 disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</div>
							{state?.error && <p className="text-sm text-red-300">{state.error}</p>}
							<p className="text-xs text-background/40 mt-1">
								No spam. Unsubscribe in one click. We&apos;ll send a coupon code right after you confirm.
							</p>
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
