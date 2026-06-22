"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="cobalt-bar-bg text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight">
								You&rsquo;re on the list
							</h2>
							<p className="mt-3 text-white/75">{state.message}</p>
						</div>
					) : (
						<>
							<p className="font-label text-white/70">JOIN THE RITUAL</p>
							<h2 className="mt-4 font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.05]">
								Take 15% off your first daily ritual
							</h2>
							<p className="mt-4 text-base leading-relaxed text-white/80 max-w-md mx-auto">
								Sourcing notes, formulation deep-dives, and the occasional early drop — twice a month.
							</p>
							<form action={action} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-[6px] border border-white/25 bg-white/10 px-5 text-white outline-none transition-all placeholder:text-white/55 focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/15"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-white px-7 font-medium text-[#4a5bc4] transition-all hover:bg-[#f5efe3] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Unlock 15% off"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							<p className="mt-4 text-[11px] font-label text-white/55">NO SPAM — UNSUBSCRIBE ANYTIME</p>
							{state?.error && <p className="mt-4 text-sm text-rose-200">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
