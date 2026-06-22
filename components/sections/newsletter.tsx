"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-charcoal text-bone">
			{/* Decorative SVG ornament */}
			<div aria-hidden="true" className="absolute inset-0 opacity-[0.07] pointer-events-none">
				<svg className="absolute -top-12 -left-12 w-[480px] h-[480px]" viewBox="0 0 200 200">
					<circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.3" />
					<circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.3" />
					<circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="0.3" />
				</svg>
				<svg className="absolute -bottom-32 -right-24 w-[600px] h-[600px]" viewBox="0 0 200 200">
					<circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.3" />
					<circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.3" />
				</svg>
			</div>

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
					<div>
						<p className="text-[11px] tracking-[0.36em] uppercase text-clay">Atelier letters</p>
						<h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.05]">
							The slow
							<br />
							<span className="italic text-clay">correspondence.</span>
						</h2>
						<p className="mt-5 max-w-md text-bone/70 leading-relaxed text-[15px]">
							Quarterly notes from the studio — early access to drops, the occasional behind-the-loom essay,
							and a 20% welcome on your first piece. No fast-fashion noise.
						</p>
					</div>

					<div>
						{state?.success ? (
							<div className="rounded-2xl border border-bone/20 bg-bone/5 backdrop-blur-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-clay/30">
									<CheckIcon className="h-5 w-5" />
								</div>
								<h3 className="font-display text-2xl">You&apos;re on the list.</h3>
								<p className="mt-2 text-bone/60 text-sm">{state.message}</p>
							</div>
						) : (
							<form action={action} className="space-y-4">
								<label
									className="block text-[10px] tracking-[0.32em] uppercase text-bone/60"
									htmlFor="ns-email"
								>
									Subscribe — only when it matters
								</label>
								<div className="flex flex-col sm:flex-row gap-3">
									<input
										id="ns-email"
										type="email"
										name="email"
										placeholder="your name@studio.com"
										required
										className="h-14 w-full flex-1 rounded-full border border-bone/20 bg-bone/[0.04] px-6 text-bone outline-none transition-all placeholder:text-bone/35 focus:border-clay/60 focus:bg-bone/[0.08]"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-bone px-8 text-sm font-medium tracking-wider text-charcoal transition-all hover:bg-clay disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && (
											<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
										)}
									</button>
								</div>
								<p className="text-[11px] text-bone/45">
									By subscribing you agree to our quiet privacy ethic.
								</p>
								{state?.error && <p className="text-sm text-red-300/90">{state.error}</p>}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
