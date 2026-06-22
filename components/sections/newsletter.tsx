"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-[var(--yns-red)] text-white overflow-hidden">
			<div className="absolute inset-0 yns-hero-gradient opacity-95" aria-hidden="true" />
			<div
				className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[var(--yns-oxblood)]/40 blur-3xl"
				aria-hidden="true"
			/>
			<div
				className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-[var(--yns-cream)]/10 blur-3xl"
				aria-hidden="true"
			/>
			<div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="max-w-3xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/30">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-[family-name:var(--font-display)] italic text-5xl sm:text-6xl tracking-tight">
								welcome, sleeper.
							</h2>
							<p className="mt-4 text-white/80">{state.message}</p>
						</div>
					) : (
						<>
							<span className="text-[10px] uppercase tracking-[0.35em] text-white/70">
								the waitlist · 42,381 strong
							</span>
							<h2 className="mt-5 font-[family-name:var(--font-display)] italic text-[14vw] sm:text-[9vw] lg:text-[7rem] leading-[0.85] tracking-tight">
								join the <span className="text-[var(--yns-cream)]">cult</span>
								<br />
								of sleep<span className="not-italic">.</span>
							</h2>
							<p className="mt-6 text-base sm:text-lg leading-relaxed text-white/85 max-w-lg mx-auto lowercase">
								letters, rituals, and first-access to every drop. no spam, no algorithms, just a tiny love
								note in your inbox at sundown.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-xl flex-col sm:flex-row items-stretch border-b border-white/40 focus-within:border-white transition-colors"
							>
								<input
									type="email"
									name="email"
									placeholder="your email · lowercase only"
									required
									className="h-14 w-full flex-1 bg-transparent px-2 text-white outline-none placeholder:text-white/40 text-base sm:text-lg lowercase"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="group inline-flex h-14 shrink-0 items-center justify-center gap-3 px-4 text-white text-xs uppercase tracking-[0.3em] disabled:opacity-50 hover:text-[var(--yns-cream)] transition-colors"
								>
									{isPending ? "sending…" : "subscribe"}
									{!isPending && (
										<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
									)}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-[var(--yns-cream)]">{state.error}</p>}
							<p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/50">
								by joining you agree to receive sleepy notes · unsubscribe whenever
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
