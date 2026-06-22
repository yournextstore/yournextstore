"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative isolate overflow-hidden bg-cocoa text-cream">
			{/* subtle gradient glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-70"
				style={{
					background:
						"radial-gradient(ellipse at 80% 20%, oklch(0.55 0.06 50 / 0.45), transparent 55%), radial-gradient(ellipse at 10% 90%, oklch(0.18 0.025 250 / 0.55), transparent 60%)",
				}}
			/>
			<div className="relative mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
				<div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-16">
					<div className="lg:col-span-7">
						{state?.success ? (
							<div className="drift-up">
								<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 ring-1 ring-cream/20">
									<CheckIcon className="h-5 w-5" />
								</div>
								<h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
									You&rsquo;re on the list.
								</h2>
								<p className="mt-4 max-w-md text-cream/70">{state.message}</p>
							</div>
						) : (
							<>
								<p className="eyebrow text-cream/60">The Insider List</p>
								<h2 className="mt-4 font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
									Get the look
									<br />
									before everyone else.
								</h2>
								<p className="mt-6 max-w-md text-base leading-relaxed text-cream/70">
									Early access to new drops, behind-the-scenes from our campaigns, and 15% off your first
									order.
								</p>
							</>
						)}
					</div>

					{!state?.success && (
						<div className="lg:col-span-5">
							<form action={action} className="flex flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									aria-label="Email address"
									className="h-12 w-full flex-1 border-b border-cream/30 bg-transparent px-1 text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-cream"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="eyebrow inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-cream px-8 text-ink transition-colors hover:bg-dune disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-200">{state.error}</p>}
							<p className="mt-5 text-[11px] tracking-wide text-cream/40">
								By subscribing you agree to receive marketing emails. Unsubscribe anytime.
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
