"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section aria-label="Newsletter" className="bg-hero-mint overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<svg
					aria-hidden="true"
					className="absolute -top-10 -left-10 h-44 w-44 text-white/50 float-soft"
					viewBox="0 0 64 64"
				>
					<title>cloud</title>
					<path d="M20 40h26a8 8 0 0 0 0-16 10 10 0 0 0-19-3 8 8 0 1 0-7 19z" fill="currentColor" />
				</svg>
				<svg
					aria-hidden="true"
					className="absolute -bottom-12 right-2 h-52 w-52 text-[var(--color-blush)] float-soft"
					viewBox="0 0 64 64"
				>
					<title>star</title>
					<path
						d="M32 4l7.3 19.7L60 26l-15 13.3 4.3 19.7L32 49l-17.3 10L19 39.3 4 26l20.7-2.3L32 4z"
						fill="currentColor"
						opacity="0.7"
					/>
				</svg>
				<div className="relative max-w-2xl mx-auto text-center text-[var(--color-ink)]">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2
								className="font-heading text-3xl sm:text-4xl"
								style={{ fontVariationSettings: "'SOFT' 100" }}
							>
								You&apos;re on the list!
							</h2>
							<p className="mt-3 text-[var(--color-ink)]/70">{state.message}</p>
						</div>
					) : (
						<>
							<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-ink)]/70">
								The YNS Post
							</span>
							<h2
								className="mt-3 font-heading text-3xl sm:text-4xl lg:text-5xl leading-tight"
								style={{ fontVariationSettings: "'SOFT' 100" }}
							>
								Cuddles &amp; news, posted straight to your inbox.
							</h2>
							<p className="mt-4 text-base sm:text-lg text-[var(--color-ink)]/70 max-w-md mx-auto">
								Be the first to meet new friends, peek behind-the-seams, and snag early-bird gifts.
							</p>
							<form action={action} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full bg-white px-5 text-[var(--color-ink)] outline-none ring-1 ring-black/5 placeholder:text-[var(--color-ink)]/40 focus:ring-2 focus:ring-[var(--color-peach)]"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-7 text-sm font-semibold tracking-wide text-[var(--color-cream)] hover:bg-[var(--color-ink)]/85 disabled:opacity-50 transition-colors"
								>
									{isPending ? "Joining…" : "Join the post"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
							<p className="mt-4 text-xs text-[var(--color-ink)]/60">
								Unsubscribe any time. We promise zero spam, just stitched-smile updates.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
