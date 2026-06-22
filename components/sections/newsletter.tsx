"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-[var(--color-coral)] text-[var(--color-navy)]">
			{/* decorative dots */}
			<div aria-hidden className="absolute inset-0">
				<span className="absolute -top-16 -left-12 h-72 w-72 rounded-full bg-[var(--color-yellow)] yns-blob" />
				<span className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[var(--color-sky)] yns-blob" />
				<span className="absolute top-10 right-1/4 h-3 w-3 rounded-full bg-white" />
				<span className="absolute bottom-12 left-1/3 h-2 w-2 rounded-full bg-white" />
				<span className="absolute top-1/3 left-12 h-4 w-4 rounded-full bg-[var(--color-mint)]" />
			</div>

			<div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
				<div className="text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white">
								<CheckIcon className="h-7 w-7 text-[var(--color-coral)]" />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
								You&apos;re on the list.
							</h2>
							<p className="mt-3 text-[var(--color-navy)]/75">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-navy)]/70 mb-4">
								The good stuff, in your inbox
							</p>
							<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.95]">
								Pinky-promise:
								<br /> no spam, just sparkle.
							</h2>
							<p className="mt-6 text-base sm:text-lg max-w-md mx-auto text-[var(--color-navy)]/75">
								Drops, flavor releases, and the occasional dentist gossip — straight to your inbox.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:rounded-full sm:bg-white sm:p-1.5 sm:shadow-[0_10px_40px_-15px_rgba(30,36,54,0.4)]"
							>
								<input
									type="email"
									name="email"
									placeholder="you@yournextstore.com"
									required
									className="h-12 w-full flex-1 rounded-full bg-white px-5 text-[var(--color-navy)] outline-none placeholder:text-[var(--color-navy)]/40 sm:bg-transparent sm:px-4"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-navy)] px-7 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-[var(--color-navy)]/90 disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-rose-900">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
