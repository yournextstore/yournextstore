"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="yns-navy-bg text-[#F5EFE6] overflow-hidden relative">
			{/* Decorative bubbles */}
			<div className="absolute inset-0 pointer-events-none opacity-50" aria-hidden="true">
				<svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none">
					<circle cx="80" cy="60" r="3" fill="#8FB1C7" />
					<circle cx="200" cy="240" r="5" fill="#8FB1C7" opacity="0.6" />
					<circle cx="1280" cy="100" r="4" fill="#8FB1C7" />
					<circle cx="1340" cy="220" r="6" fill="#8FB1C7" opacity="0.5" />
					<circle cx="640" cy="40" r="2" fill="#F5EFE6" opacity="0.4" />
					<circle cx="900" cy="280" r="3" fill="#F5EFE6" opacity="0.3" />
				</svg>
			</div>
			<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#8FB1C7]/20 border border-[#8FB1C7]/40">
							<CheckIcon className="h-7 w-7" />
						</div>
						<h2 className="headline-display text-3xl sm:text-4xl">You&apos;re on the list</h2>
						<p className="mt-4 text-[#F5EFE6]/70">{state.message}</p>
					</div>
				) : (
					<>
						<p className="script-tag text-2xl sm:text-3xl text-[#8FB1C7] mb-3">don&apos;t miss a thing</p>
						<h2 className="headline-display text-3xl sm:text-5xl lg:text-6xl leading-[0.95]">
							Get the dirt before
							<br />
							everyone else
						</h2>
						<p className="mt-6 text-base sm:text-lg leading-relaxed text-[#F5EFE6]/70 max-w-lg mx-auto">
							New drops, refill restocks and the occasional thought piece on why we&apos;re obsessed with
							soap. 10% off your first order when you sign up.
						</p>
						<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full border border-[#F5EFE6]/20 bg-[#F5EFE6]/5 px-5 text-[#F5EFE6] outline-none transition-all placeholder:text-[#F5EFE6]/40 focus:border-[#8FB1C7] focus:ring-2 focus:ring-[#8FB1C7]/30"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#F5EFE6] px-8 text-sm uppercase tracking-[0.18em] font-semibold text-[#1F2A33] transition-all hover:bg-white disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
