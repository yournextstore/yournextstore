"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[color:var(--cream-deep)] border-t border-[color:var(--border)] overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
					<div>
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--dusty-blue)] text-[color:var(--cream)]">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.94] text-[color:var(--charcoal)]">
									You&apos;re on the list.
								</h2>
								<p className="mt-4 text-[color:var(--muted-foreground)] max-w-md">{state.message}</p>
							</div>
						) : (
							<>
								<p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[color:var(--brown-warm)] mb-3">
									The drop list
								</p>
								<h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.94] text-[color:var(--charcoal)]">
									New flavors,
									<br />
									straight to your inbox.
								</h2>
								<p className="mt-5 text-base sm:text-lg leading-relaxed text-[color:var(--muted-foreground)] max-w-md">
									Early access to limited releases, party recipes, and stops on the summer tour. No spam, no
									gimmicks.
								</p>
							</>
						)}
					</div>

					{!state?.success && (
						<form action={action} className="flex flex-col sm:flex-row gap-3">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-14 w-full flex-1 rounded-full border border-[color:var(--charcoal)]/15 bg-[color:var(--cream)] px-6 text-base text-[color:var(--charcoal)] outline-none placeholder:text-[color:var(--charcoal)]/40 focus:border-[color:var(--dusty-blue)] transition-colors"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--charcoal)] px-8 text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--cream)] transition-all hover:bg-[color:var(--dusty-blue)] disabled:opacity-50"
							>
								{isPending ? "Joining…" : "Subscribe"}
								{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
							</button>
						</form>
					)}
				</div>
				{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
			</div>
		</section>
	);
}
