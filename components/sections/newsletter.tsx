"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-ink text-bone overflow-hidden">
			<div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
			<div
				aria-hidden
				className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full opacity-30 blur-3xl"
				style={{ background: "radial-gradient(circle, var(--brick) 0%, transparent 60%)" }}
			/>
			<div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-bone/65">
							<span className="block h-px w-8 bg-brick" />
							The Newsletter
						</span>
						<h2 className="font-display-wide text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] uppercase mt-5 text-balance text-white">
							Roll with us.
						</h2>
						<p className="mt-5 max-w-md text-[15px] leading-relaxed text-bone/75">
							A short note every other Tuesday: new arrivals, a song for the walk, and one neighborhood
							we&apos;re wandering this week. Reply-able.
						</p>
					</div>

					<div>
						{state?.success ? (
							<div className="border border-bone/20 px-6 py-7 bg-bone/5 backdrop-blur-sm">
								<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bone text-ink">
									<Check className="h-5 w-5" />
								</div>
								<div className="font-display-wide text-[13px] tracking-[0.22em] uppercase mt-4">
									You&apos;re on the list
								</div>
								<p className="mt-2 text-sm text-bone/70">{state.message}</p>
							</div>
						) : (
							<form action={action}>
								<label className="block text-[11px] tracking-[0.3em] uppercase text-bone/70 mb-3">
									Your email
								</label>
								<div className="flex items-stretch border border-bone/30 h-12 focus-within:border-bone transition-colors">
									<input
										type="email"
										name="email"
										placeholder="hello@everyday.com"
										required
										className="flex-1 bg-transparent px-5 text-[14px] text-bone outline-none placeholder:text-bone/35"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex items-center gap-2 bg-bone text-ink px-6 text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-brick hover:text-bone transition-colors disabled:opacity-50"
									>
										{isPending ? "Rolling…" : "Roll with us"}
										{!isPending && <ArrowRight className="h-3.5 w-3.5" />}
									</button>
								</div>
								{state?.error && <p className="mt-3 text-xs text-brick">{state.error}</p>}
								<p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-bone/45">
									Unsubscribe with one click. We&apos;ll still be friends.
								</p>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
