"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden mush-yellow-gradient">
			{/* Subtle dots pattern */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 w-full h-full opacity-15 mix-blend-multiply"
				viewBox="0 0 800 200"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
						<circle cx="2" cy="2" r="1.2" fill="#3d1f0f" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#dots)" />
			</svg>

			<div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-mush-espresso)]">
								<CheckIcon className="h-7 w-7 text-[color:var(--color-mush-yellow)]" />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl text-[color:var(--color-mush-espresso)]">
								You&apos;re on the list
							</h2>
							<p className="mt-3 text-[color:var(--color-mush-espresso)]/80">{state.message}</p>
						</div>
					) : (
						<>
							<p className="font-script text-3xl text-[color:var(--color-mush-espresso)]">Join the grove</p>
							<h2 className="mt-1 font-display text-4xl sm:text-5xl lg:text-6xl text-[color:var(--color-mush-espresso)] leading-tight">
								Slow letters, seasonal drops.
							</h2>
							<p className="mt-4 text-lg leading-relaxed text-[color:var(--color-mush-espresso)]/80 max-w-xl mx-auto">
								Mushroom dispatches, recipe rituals and 10% off your first harvest. Unsubscribe anytime.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-[color:var(--color-mush-espresso)]/20 bg-white px-5 text-[color:var(--color-mush-espresso)] outline-none transition-all placeholder:text-[color:var(--color-mush-espresso)]/40 focus:border-[color:var(--color-mush-espresso)] focus:ring-2 focus:ring-[color:var(--color-mush-espresso)]/15"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--color-mush-espresso)] px-7 font-display text-xs tracking-[0.22em] uppercase text-[color:var(--color-mush-cream)] transition-all hover:bg-[color:var(--color-mush-caramel)] disabled:opacity-50"
								>
									{isPending ? "Sending…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && (
								<p className="mt-4 text-sm text-[color:var(--color-mush-espresso)]/90">{state.error}</p>
							)}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
