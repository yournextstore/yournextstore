"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section id="discovery" className="relative bg-ink text-cream overflow-hidden">
			{/* Glow */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none opacity-50"
				style={{
					background: "radial-gradient(circle at 80% 30%, rgba(184,84,44,0.35), transparent 55%)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="grid lg:grid-cols-12 gap-10 items-end">
					<div className="lg:col-span-7">
						<p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-terracotta-light">
							The Field Notes
						</p>
						{state?.success ? (
							<div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
								<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta">
									<CheckIcon className="h-6 w-6 text-cream" />
								</div>
								<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
									You&apos;re on the list.
								</h2>
								<p className="mt-4 text-cream/70 max-w-md">{state.message}</p>
							</div>
						) : (
							<>
								<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
									Notes from the kitchen, the lab, and the long run.
								</h2>
								<p className="mt-5 text-base sm:text-lg leading-relaxed text-cream/70 max-w-lg">
									New formulations, the studies we&apos;re reading, and seasonal protein-forward recipes —
									delivered to your inbox once a month. No spam, no fluff.
								</p>
							</>
						)}
					</div>
					<div className="lg:col-span-5">
						<form action={action} className="flex flex-col gap-3">
							<label
								htmlFor="newsletter-email"
								className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/60"
							>
								Email address
							</label>
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									id="newsletter-email"
									type="email"
									name="email"
									placeholder="you@kitchen.com"
									required
									className="h-12 w-full flex-1 rounded-sm border border-cream/20 bg-transparent px-4 text-cream outline-none transition-all placeholder:text-cream/30 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-sm bg-terracotta px-6 text-[11px] tracking-[0.22em] uppercase font-semibold text-cream transition-all hover:bg-terracotta-light disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</div>
							{state?.error && <p className="text-sm text-red-300">{state.error}</p>}
							<p className="text-[11px] text-cream/40 mt-2">
								By subscribing you agree to receive emails from Your Next Store. Unsubscribe any time.
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
