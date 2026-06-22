"use client";

import { ArrowRightIcon, CheckIcon, Leaf } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
			<div className="relative overflow-hidden rounded-[28px] bg-mint-wash p-8 shadow-card sm:p-12">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-[var(--brand)]/15 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -left-12 -bottom-16 h-60 w-60 rounded-full bg-[var(--accent-saffron)]/30 blur-3xl"
				/>

				<div className="relative max-w-2xl">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)] text-white">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-display text-3xl font-bold tracking-tight text-[var(--brand-deep)] sm:text-4xl">
								You&apos;re on the list
							</h2>
							<p className="mt-3 text-[var(--muted-foreground)]">{state.message}</p>
						</div>
					) : (
						<>
							<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-deep)] shadow-soft ring-1 ring-[var(--border)]">
								<Leaf className="h-3.5 w-3.5 text-[var(--brand)]" />
								Weekly harvest dispatch
							</span>
							<h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--brand-deep)] sm:text-4xl lg:text-[42px]">
								Fresh deals, every Sunday.
							</h2>
							<p className="mt-3 max-w-md text-base text-[var(--muted-foreground)]">
								Get seasonal recipes, exclusive coupons, and farm-to-door news delivered to your inbox.
							</p>
							<form action={action} className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-[var(--border)] bg-white px-5 text-[var(--brand-deep)] outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--brand-deep)] px-7 font-semibold text-white transition-all hover:bg-[var(--brand)] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-3 text-sm text-[var(--destructive)]">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
