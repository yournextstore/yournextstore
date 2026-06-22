"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-[var(--pink)] overflow-hidden">
			<div className="absolute inset-0 pointer-events-none opacity-30">
				<svg width="100%" height="100%" aria-hidden="true">
					<title>pattern</title>
					<defs>
						<pattern id="hearts" width="60" height="60" patternUnits="userSpaceOnUse">
							<text x="10" y="40" fontSize="22" fill="white" opacity="0.4">
								♥
							</text>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#hearts)" />
				</svg>
			</div>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--pink)]">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="font-display uppercase text-white text-[clamp(2rem,4vw,3rem)] leading-[1]">
								You're on the list, baby
							</h2>
							<p className="mt-3 text-white/85">{state.message}</p>
						</div>
					) : (
						<>
							<p className="font-display uppercase tracking-[0.32em] text-white/80 text-xs">
								Slide into our inbox
							</p>
							<h2 className="mt-4 font-display uppercase text-white text-[clamp(2.25rem,5vw,4rem)] leading-[1]">
								Don't be a stranger
							</h2>
							<p className="mt-5 text-white/90 max-w-md mx-auto leading-relaxed">
								Get first dibs on new drops, flirty offers, and the spiciest dispatches from the studio.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:gap-2"
							>
								<input
									type="email"
									name="email"
									placeholder="hi@yournextstore.com"
									required
									className="h-12 w-full flex-1 rounded-full bg-white px-6 text-[var(--burgundy)] placeholder:text-[var(--burgundy)]/40 outline-none focus:ring-4 focus:ring-white/40"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[var(--burgundy)] px-8 font-display uppercase tracking-[0.2em] text-xs text-white hover:bg-[var(--burgundy)]/90 disabled:opacity-50 transition-all"
								>
									{isPending ? "Sending…" : "Sign me up"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-white/90">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
