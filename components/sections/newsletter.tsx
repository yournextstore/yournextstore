"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-black overflow-hidden">
			<div className="absolute inset-0 yns-noise opacity-60" />
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-[var(--color-yns-yellow)]/15 blur-[120px]"
			/>
			<div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#111] to-[#070707] px-6 sm:px-12 py-14 sm:py-20 text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-yns-yellow)] text-black">
								<CheckIcon className="h-6 w-6" strokeWidth={3} />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl text-white">Welcome to the cool club</h2>
							<p className="mt-3 text-white/60">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] uppercase tracking-[0.22em] text-white/40">Stay refreshed</p>
							<h2 className="font-display mt-3 text-4xl sm:text-5xl lg:text-6xl text-white">
								Get the next drop <br />
								<span className="text-[var(--color-yns-yellow)]">before it goes cold.</span>
							</h2>
							<p className="mt-5 text-white/55 max-w-md mx-auto">
								New flavors, exclusive drops, and a quiet 10% off your first case.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row p-1.5 sm:p-1 sm:bg-white/5 sm:border sm:border-white/10 sm:rounded-full"
							>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full sm:rounded-full bg-white/5 sm:bg-transparent border border-white/10 sm:border-0 px-5 text-white outline-none transition-all placeholder:text-white/30 focus:bg-white/10 sm:focus:bg-transparent"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-black transition-all hover:bg-[var(--color-yns-yellow)] disabled:opacity-50"
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
