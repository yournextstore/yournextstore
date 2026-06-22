"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden border-y border-border bg-black">
			<div
				aria-hidden
				className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-ember/10 blur-3xl"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-ember/15 ring-1 ring-ember/40">
								<CheckIcon className="h-6 w-6 text-ember" />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-bone">
								You&apos;re on the list
							</h2>
							<p className="mt-3 text-muted-foreground">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-xs uppercase tracking-[0.22em] text-ember/90 font-medium">Letters from us</p>
							<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-bone text-balance">
								A monthly note on focus, design, and the slow internet.
							</h2>
							<p className="mt-5 text-[15px] leading-relaxed text-muted-foreground max-w-md mx-auto">
								No marketing, no daily nudges. Just a thoughtful piece once a month.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-bone/15 bg-bone/5 px-5 text-bone outline-none transition-all placeholder:text-muted-foreground/70 focus:border-ember/60 focus:ring-2 focus:ring-ember/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ember px-7 font-medium text-black transition-all hover:bg-ember-soft disabled:opacity-50 shadow-[0_0_40px_-10px_rgba(232,115,44,0.6)]"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
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
