"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

function Heart({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M12 21s-7.5-4.5-9.5-9.2C1.2 8.6 3 5 6.4 5c2 0 3.5 1 4.6 2.5C12.1 6 13.6 5 15.6 5 19 5 20.8 8.6 19.5 11.8 17.5 16.5 12 21 12 21z" />
		</svg>
	);
}

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section id="sustainability" className="relative bg-[var(--maroon)] text-[var(--cream)] overflow-hidden">
			{/* Hearts decoration */}
			<Heart className="absolute top-10 left-[8%] w-10 h-10 text-[var(--candy)]/40" />
			<Heart className="absolute top-24 right-[12%] w-7 h-7 text-[var(--blush)]/50" />
			<Heart className="absolute bottom-10 left-[20%] w-6 h-6 text-[var(--blush)]/40" />
			<Heart className="absolute bottom-16 right-[6%] w-12 h-12 text-[var(--candy)]/30" />

			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--candy)] text-white">
							<CheckIcon className="h-7 w-7" />
						</div>
						<h2 className="font-display italic text-4xl sm:text-5xl tracking-tight">
							You're on the list, sugar.
						</h2>
						<p className="mt-4 text-cream/80">{state.message}</p>
					</div>
				) : (
					<>
						<p className="text-xs font-bold tracking-[0.3em] text-[var(--blush)] uppercase">SWEET MAIL</p>
						<h2 className="mt-3 font-display italic text-4xl sm:text-5xl lg:text-6xl tracking-tight">
							Get a love letter from
							<br />
							our oven, monthly.
						</h2>
						<p className="mt-5 text-cream/80 text-lg max-w-xl mx-auto leading-relaxed">
							New batches, secret recipes, and the occasional pre-launch peek at gift boxes. 10% off your
							first order, plus an actual cookie story or two.
						</p>
						<form
							action={action}
							className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:bg-white sm:rounded-full sm:p-1.5 sm:ring-1 sm:ring-white/20"
						>
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full bg-white px-5 text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/40 focus:ring-2 focus:ring-[var(--candy)]/30 sm:bg-transparent sm:focus:ring-0"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--candy)] px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-[var(--ink)] disabled:opacity-50"
							>
								{isPending ? "Sending…" : "Subscribe"}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-[var(--blush)]">{state.error}</p>}
						<p className="mt-5 text-xs tracking-[0.18em] uppercase text-cream/50">
							No spam — just butter, sugar & love.
						</p>
					</>
				)}
			</div>
		</section>
	);
}
