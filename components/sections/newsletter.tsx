"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[color:var(--color-yns-bone)] border-y border-[color:var(--color-yns-ink)]/10">
			<div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
					<div className="lg:col-span-7">
						<p className="text-xs tracking-utility font-semibold text-[color:var(--color-yns-wood)] mb-4">
							DISPATCH №07
						</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-[68px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[color:var(--color-yns-ink)]">
							Letters from
							<br />
							the workshop.
						</h2>
						<p className="mt-6 text-base sm:text-lg leading-relaxed text-[color:var(--color-yns-ink)]/65 max-w-md">
							A short note when something new leaves the bench. New colors, restocks, the occasional field
							story. No filler.
						</p>
					</div>
					<div className="lg:col-span-5">
						{state?.success ? (
							<div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-yns-ink)] text-[color:var(--color-yns-cream)] shrink-0">
									<CheckIcon className="h-5 w-5" />
								</div>
								<div>
									<p className="font-display text-2xl font-black uppercase text-[color:var(--color-yns-ink)] leading-none">
										You&apos;re on the list
									</p>
									<p className="mt-1 text-sm text-[color:var(--color-yns-ink)]/65">{state.message}</p>
								</div>
							</div>
						) : (
							<form action={action} className="flex flex-col gap-3">
								<label
									htmlFor="newsletter-email"
									className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]/55"
								>
									EMAIL ADDRESS
								</label>
								<div className="flex border-b-2 border-[color:var(--color-yns-ink)] focus-within:border-[color:var(--color-yns-wood)] transition-colors">
									<input
										id="newsletter-email"
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 bg-transparent text-lg text-[color:var(--color-yns-ink)] outline-none placeholder:text-[color:var(--color-yns-ink)]/30 font-display tracking-tight"
									/>
									<button
										type="submit"
										disabled={isPending}
										aria-label="Subscribe"
										className="h-12 shrink-0 inline-flex items-center justify-center px-2 text-[color:var(--color-yns-ink)] font-display text-2xl font-black disabled:opacity-50 hover:text-[color:var(--color-yns-wood)] transition-colors"
									>
										{isPending ? "…" : "→"}
									</button>
								</div>
								<p className="text-[11px] text-[color:var(--color-yns-ink)]/45">
									Unsubscribe whenever. We won&apos;t share your address.
								</p>
								{state?.error && <p className="text-sm text-red-700 font-medium">{state.error}</p>}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
