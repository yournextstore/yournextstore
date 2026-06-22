"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[var(--cream)] border-t border-[var(--ink)]/12">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--oxblood)] text-[var(--oxblood)]">
							<CheckIcon className="h-5 w-5" />
						</div>
						<h2 className="font-display text-4xl sm:text-5xl tracking-[-0.01em] text-[var(--ink)]">
							You are <em className="italic">on the list</em>
						</h2>
						<p className="mt-4 text-[var(--ink)]/65 italic">{state.message}</p>
					</div>
				) : (
					<>
						<span className="heritage-smallcaps text-[var(--oxblood)]">A quiet correspondence</span>
						<h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.01em] text-[var(--ink)]">
							Letters from the <em className="italic">workshop</em>
						</h2>
						<p className="mt-5 text-[15px] sm:text-base italic leading-relaxed text-[var(--ink)]/70 max-w-xl mx-auto">
							A short dispatch, four times a year, on the goods we are making, the company we keep, and the
							books on the bench. No promotions; no haste.
						</p>

						<form
							action={action}
							className="mx-auto mt-10 flex max-w-xl flex-col sm:flex-row items-stretch gap-4"
						>
							<div className="relative flex-1">
								<input
									type="email"
									name="email"
									placeholder="your.name@example.com"
									required
									className="w-full h-12 bg-transparent border-0 border-b border-[var(--ink)]/40 px-1 text-base text-[var(--ink)] placeholder:text-[var(--ink)]/40 placeholder:italic focus:outline-none focus:border-[var(--oxblood)] transition-colors"
								/>
							</div>
							<button
								type="submit"
								disabled={isPending}
								className="heritage-smallcaps inline-flex h-12 shrink-0 items-center justify-center border border-[var(--ink)] px-6 text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors disabled:opacity-50"
							>
								{isPending ? "Sending…" : "Subscribe"}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm italic text-[var(--oxblood)]">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
