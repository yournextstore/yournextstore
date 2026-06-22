"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[#f7e4d4] overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#4b1fb5] text-white">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="text-3xl sm:text-4xl text-[#1a0f4d]">
								You&apos;re <span className="font-marker text-[#4b1fb5] -rotate-1 inline-block">in.</span>
							</h2>
							<p className="mt-3 text-[#1a0f4d]/70">{state.message}</p>
						</div>
					) : (
						<>
							<p className="font-marker text-[#f4884a] text-xl mb-3 -rotate-2">first dibs</p>
							<h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1a0f4d] leading-tight">
								Get 20% off your first order.
							</h2>
							<p className="mt-4 text-[#1a0f4d]/70 text-base leading-relaxed max-w-md mx-auto">
								Subscribe for early access to new flavors, restocks, and the occasional founder-written love
								letter. No spam, ever.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border-2 border-[#1a0f4d]/15 bg-white px-5 text-[#1a0f4d] outline-none transition-all placeholder:text-[#1a0f4d]/40 focus:border-[#4b1fb5] focus:ring-2 focus:ring-[#4b1fb5]/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#4b1fb5] px-8 text-xs font-extrabold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#3a17a0] disabled:opacity-50 shadow-[0_4px_0_#1a0f4d] hover:shadow-[0_2px_0_#1a0f4d] hover:translate-y-[2px]"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-[#e23f3f]">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
