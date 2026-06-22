"use client";

import { ArrowRight, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-[#ffcc00] text-[#0e0e0e]">
			{/* Decorative diagonal stripes */}
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(45deg, #0e0e0e 0, #0e0e0e 2px, transparent 2px, transparent 16px)",
				}}
			/>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid items-center gap-10 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<span className="jolt-eyebrow text-[#0e0e0e]/70">— Subscribe & save</span>
						{state?.success ? (
							<div className="mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0e0e0e] text-[#ffcc00]">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="jolt-headline text-4xl sm:text-5xl">You&rsquo;re in.</h2>
								<p className="mt-3 text-[#0e0e0e]/70">{state.message}</p>
							</div>
						) : (
							<>
								<h2 className="jolt-headline mt-3 text-4xl sm:text-5xl lg:text-6xl">
									Never run <br className="hidden sm:block" />
									out of coffee.
								</h2>
								<p className="mt-5 max-w-md text-base text-[#0e0e0e]/75 leading-relaxed">
									Sign up for the drop list. New roasts, secret blends and 15% off your first delivery.
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
									className="h-14 w-full flex-1 border border-[#0e0e0e] bg-transparent px-5 text-[#0e0e0e] outline-none transition-all placeholder:text-[#0e0e0e]/40 focus:bg-[#0e0e0e]/5 focus:ring-2 focus:ring-[#0e0e0e]/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 bg-[#0e0e0e] px-8 text-sm font-bold uppercase tracking-[0.18em] text-[#ffcc00] transition-all hover:translate-y-[-2px] hover:bg-[#1a1a1a] disabled:opacity-50"
								>
									{isPending ? "Joining…" : "Subscribe"}
									{!isPending && (
										<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
									)}
								</button>
							</form>
							{state?.error && <p className="mt-3 text-sm text-red-900">{state.error}</p>}
							<p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-[#0e0e0e]/55">
								No spam. Unsubscribe whenever. Probably won&rsquo;t happen.
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
