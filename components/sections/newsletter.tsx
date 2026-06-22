"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative sand-paper overflow-hidden border-t border-border/60">
			<div
				aria-hidden
				className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,_rgba(217,160,122,0.25)_0%,_transparent_70%)]"
			/>
			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--oxblood)] text-cream">
							<CheckIcon className="h-5 w-5" />
						</div>
						<h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
							You&apos;re on the list
						</h2>
						<p className="mt-3 text-muted-foreground">{state.message}</p>
					</div>
				) : (
					<>
						<span className="eyebrow text-[color:var(--oxblood)]">— The Letters</span>
						<h2 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] tracking-tight">
							Quieter dispatches,
							<br />
							<span className="italic font-light">slowly written.</span>
						</h2>
						<p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-md mx-auto">
							Field notes from the kilns and looms, plus first looks at every restock — once a season, nothing
							more.
						</p>
						<form
							action={action}
							className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center"
						>
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full border border-border bg-card px-5 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-[color:var(--oxblood)] focus:ring-0"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--ink)] px-7 text-[12px] tracking-[0.22em] uppercase text-cream transition-all hover:bg-[color:var(--oxblood)] disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
						<p className="mt-6 text-[11px] tracking-[0.2em] uppercase text-muted-foreground/70">
							No spam, ever — unsubscribe anytime.
						</p>
					</>
				)}
			</div>
		</section>
	);
}
