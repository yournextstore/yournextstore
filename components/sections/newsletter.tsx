"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden grain" style={{ background: "var(--cobalt)" }}>
			{/* yellow blob */}
			<div
				aria-hidden
				className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-90"
				style={{ background: "var(--chartreuse)" }}
			/>
			<div
				aria-hidden
				className="absolute -left-32 bottom-0 w-64 h-64 rounded-full opacity-30"
				style={{ background: "var(--marigold)" }}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="max-w-2xl mx-auto text-center text-cream">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-chartreuse">
								<CheckIcon className="h-7 w-7 text-ink" />
							</div>
							<h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
								You&rsquo;re on the list.
							</h2>
							<p className="mt-4 text-cream/80">{state.message}</p>
						</div>
					) : (
						<>
							<span className="inline-block text-[11px] tracking-[0.22em] uppercase font-semibold text-chartreuse mb-6">
								— A weekly question, in your inbox
							</span>
							<h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1] font-black tracking-tight">
								Receive a question{" "}
								<span className="italic font-light" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
									in your inbox
								</span>{" "}
								each week.
							</h2>
							<p className="mt-6 text-base sm:text-lg leading-relaxed text-cream/75 max-w-md mx-auto">
								One small prompt. One new title. Sent quietly on Sundays. Unsubscribe whenever the question is
								no longer the right one.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="you@somewhere.com"
									required
									className="h-12 w-full flex-1 rounded-full border-2 border-cream/30 bg-cobalt-dark/40 px-5 text-cream outline-none transition-all placeholder:text-cream/40 focus:border-chartreuse focus:bg-cobalt-dark/60"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-chartreuse px-7 text-sm font-semibold tracking-[0.18em] uppercase text-ink transition-all hover:bg-chartreuse/90 disabled:opacity-50"
								>
									{isPending ? "Sending…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-chartreuse">{state.error}</p>}
							<p className="mt-6 text-xs tracking-wide text-cream/50">
								No spam. No tracking. Just a question.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
