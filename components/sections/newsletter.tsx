"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-[color:var(--yns-ink)] text-[color:var(--yns-cream)]">
			<div className="yns-hero-grain absolute inset-0 opacity-30" aria-hidden />
			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
					<div className="lg:col-span-7">
						<p className="yns-eyebrow text-[color:var(--yns-terracotta)]">The dispatch</p>
						{state?.success ? (
							<div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95] text-[color:var(--yns-cream)]">
									You're on the list.
								</h2>
								<p className="mt-5 inline-flex items-center gap-2 text-base text-[color:var(--yns-cream)]/70">
									<CheckIcon className="h-5 w-5" />
									{state.message}
								</p>
							</div>
						) : (
							<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95]">
								Letters from
								<br />
								the workshop<span className="text-[color:var(--yns-terracotta)]">.</span>
							</h2>
						)}
					</div>

					<div className="lg:col-span-5">
						<p className="text-[15px] leading-relaxed text-[color:var(--yns-cream)]/70 max-w-md">
							One short note each season — new releases, behind-the-bench stories, and the occasional
							subscriber-only object. No newsletters about newsletters.
						</p>

						{!state?.success && (
							<form action={action} className="mt-7 flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 border-b border-[color:var(--yns-cream)]/30 bg-transparent px-1 text-[color:var(--yns-cream)] outline-none transition-colors placeholder:text-[color:var(--yns-cream)]/40 focus:border-[color:var(--yns-cream)]"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--yns-cream)] px-7 text-sm font-medium text-[color:var(--yns-ink)] transition-all hover:bg-white disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
						)}
						{state?.error && <p className="mt-3 text-sm text-[color:var(--yns-peach)]">{state.error}</p>}
					</div>
				</div>
			</div>
		</section>
	);
}
