"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-cream-gradient relative overflow-hidden">
			<div aria-hidden className="absolute inset-0 bg-dot-pattern opacity-25 mix-blend-multiply" />
			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sage text-cream">
							<CheckIcon className="h-6 w-6" />
						</div>
						<h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground">
							You&rsquo;re on the list
						</h2>
						<p className="mt-4 text-muted-foreground">{state.message}</p>
					</div>
				) : (
					<>
						<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-coral">
							<span className="h-px w-8 bg-coral" />
							Letters from the kitchen
							<span className="h-px w-8 bg-coral" />
						</span>
						<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground">
							Field notes, <span className="italic text-coral">once a month.</span>
						</h2>
						<p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto">
							New harvests, slow recipes, and the occasional postcard from the farms we visit. No spam, no
							marketing-speak — just the good stuff, on the first of each month.
						</p>
						<form
							action={action}
							className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row p-1.5 sm:rounded-full sm:bg-white/70 sm:backdrop-blur sm:border sm:border-border"
						>
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full border border-border bg-white sm:border-transparent sm:bg-transparent px-5 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-sage/40"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold uppercase tracking-[0.18em] text-cream transition-all hover:bg-ink/90 disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-coral">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
