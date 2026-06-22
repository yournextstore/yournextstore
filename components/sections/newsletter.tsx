"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[color:var(--brick-cream)] text-foreground overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-foreground text-background px-6 py-14 sm:px-14 sm:py-16 shadow-[0_40px_80px_-30px_rgba(10,10,10,0.45)]">
					<div
						aria-hidden
						className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(45,91,255,0.5)_0%,transparent_60%)] blur-2xl"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(143,163,255,0.35)_0%,transparent_60%)] blur-2xl"
					/>
					<div className="relative text-center">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
									<CheckIcon className="h-6 w-6 text-[color:var(--brick-lavender)]" />
								</div>
								<h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
									You&apos;re on the list
								</h2>
								<p className="mt-3 text-background/70">{state.message}</p>
							</div>
						) : (
							<>
								<span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--brick-lavender)]">
									Newsletter
								</span>
								<h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
									Less noise.
									<br />
									More signal.
								</h2>
								<p className="mt-4 mx-auto max-w-md text-base text-background/65 leading-relaxed">
									Quiet, occasional dispatches about new arrivals and stories of intentional living.
								</p>
								<form action={action} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 rounded-full border border-background/20 bg-background/10 px-5 text-background outline-none transition-all placeholder:text-background/30 focus:border-[color:var(--brick-lavender)] focus:ring-2 focus:ring-[color:var(--brick-lavender)]/30"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground transition-all hover:bg-[color:var(--brick-cobalt-deep)] disabled:opacity-50"
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
			</div>
		</section>
	);
}
