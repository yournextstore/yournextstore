"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-cocoa text-cream">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at 15% 30%, rgba(231, 138, 76, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(201, 220, 191, 0.5) 0%, transparent 50%)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sage text-cocoa">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-cream">
								You're on the list
							</h2>
							<p className="mt-3 text-cream/70">{state.message}</p>
						</div>
					) : (
						<>
							<span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-cream/80 ring-1 ring-cream/15">
								<span className="h-1 w-1 rounded-full bg-peach" aria-hidden="true" />
								The Quiet Letter
							</span>
							<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cream">
								Slow notes from the garden.
							</h2>
							<p className="mt-5 text-base sm:text-lg leading-relaxed text-cream/70 max-w-md mx-auto">
								Seasonal recipes, new arrivals, and the occasional reminder to drink your water. Once a
								fortnight — never more.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-cream/15 bg-cream/5 px-5 text-cream outline-none transition-all placeholder:text-cream/30 focus:border-sage/60 focus:bg-cream/10 focus:ring-2 focus:ring-sage/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-sage px-7 font-medium text-cocoa transition-all hover:bg-sage/85 disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-peach">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
