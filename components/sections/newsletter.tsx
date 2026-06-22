"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

function Star({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
		</svg>
	);
}

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[var(--tizz-orange)] tizz-noise relative overflow-hidden">
			{/* Decorative stars / bursts */}
			<Star className="absolute top-10 left-[8%] w-12 h-12 text-[var(--tizz-yellow)] tizz-spin-slow" />
			<Star className="absolute bottom-10 right-[6%] w-16 h-16 text-[var(--tizz-yellow)] tizz-spin-slow" />
			<Star className="absolute top-1/3 right-[15%] w-7 h-7 text-[var(--tizz-cream)] tizz-spin-slow" />
			<Star className="absolute bottom-20 left-[18%] w-8 h-8 text-[var(--tizz-deep)] tizz-spin-slow" />

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="max-w-3xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tizz-yellow)] border-2 border-[var(--tizz-deep)]">
								<CheckIcon className="h-7 w-7 text-[var(--tizz-deep)]" strokeWidth={3} />
							</div>
							<h2 className="tizz-display text-[var(--tizz-cream)] text-5xl sm:text-6xl">You&apos;re in.</h2>
							<p className="mt-4 text-[var(--tizz-cream)]/85 text-lg">{state.message}</p>
						</div>
					) : (
						<>
							<p className="tizz-overline text-[var(--tizz-yellow)] text-xs mb-4">
								★ Letters from the fridge ★
							</p>
							<h2 className="tizz-display text-[var(--tizz-cream)] text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">
								Get the
								<br />
								good fizz <span className="text-[var(--tizz-yellow)] italic">first.</span>
							</h2>
							<p className="mt-6 text-[var(--tizz-cream)]/85 text-lg max-w-xl mx-auto leading-relaxed">
								Drops, restocks, behind-the-scenes weirdness — straight to your inbox. No spam, no shouting,
								no five-emoji subject lines (probably).
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="you@somewhere.cool"
									required
									className="h-14 w-full flex-1 rounded-full border-2 border-[var(--tizz-deep)] bg-[var(--tizz-cream)] px-6 text-[var(--tizz-deep)] tizz-overline text-sm placeholder:text-[var(--tizz-deep)]/40 focus:outline-none focus:bg-white"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--tizz-deep)] px-8 tizz-overline text-sm text-[var(--tizz-cream)] hover:bg-[var(--tizz-yellow)] hover:text-[var(--tizz-deep)] disabled:opacity-60 transition-colors border-2 border-[var(--tizz-deep)]"
								>
									{isPending ? "Subscribing…" : "Sign me up"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-[var(--tizz-yellow)]">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
