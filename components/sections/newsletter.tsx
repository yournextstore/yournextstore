"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-accent text-accent-foreground border-y border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
					<div className="lg:col-span-7">
						<p className="text-[11px] uppercase tracking-[0.22em] text-foreground/70">
							Letter from the atelier
						</p>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
							The new edit, the first drops, and notes from our studios.
						</h2>
					</div>
					<div className="lg:col-span-5 lg:pl-10">
						{state?.success ? (
							<div className="border-t border-foreground/30 pt-6">
								<p className="text-[11px] uppercase tracking-[0.22em] text-foreground/70">Welcome</p>
								<p className="mt-3 font-display text-2xl text-foreground">{state.message}</p>
							</div>
						) : (
							<>
								<p className="text-sm text-foreground/80 mb-5">
									Twice a month. Always considered. Unsubscribe whenever.
								</p>
								<form
									action={action}
									className="flex border-b border-foreground/30 focus-within:border-foreground transition-colors"
								>
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										aria-label="Email address"
										className="h-12 flex-1 bg-transparent px-1 text-base text-foreground outline-none placeholder:text-foreground/50"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="px-4 text-[11px] uppercase tracking-[0.22em] text-foreground font-medium hover:opacity-70 disabled:opacity-50 transition-opacity"
									>
										{isPending ? "Sending…" : "Subscribe"}
									</button>
								</form>
								{state?.error && <p className="mt-3 text-xs text-destructive">{state.error}</p>}
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
