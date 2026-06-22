"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[#a8e0dc] border-y border-[#1b2a2e]/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
					<div>
						<span className="inline-flex items-center gap-2 rounded-full bg-[#1b2a2e] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fbe9d7]">
							<span className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
							The Sprinkle List
						</span>
						<h2 className="mt-4 font-display text-3xl sm:text-5xl font-black tracking-tight text-[#1b2a2e] leading-[1.05]">
							Get a free recipe every <em className="text-[#9f9cf5] not-italic">Sunday.</em>
						</h2>
						<p className="mt-4 text-base sm:text-lg text-[#1b2a2e]/75 leading-relaxed max-w-md">
							New flavors, stockist drops, and one zero-fuss recipe per week. Unsubscribe with one click — no
							hard feelings.
						</p>
					</div>

					<div>
						{state?.success ? (
							<div className="rounded-3xl bg-[#fbe9d7] p-8 border border-[#1b2a2e]/15 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b2a2e] text-[#fbe9d7]">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h3 className="mt-4 font-display text-2xl font-bold text-[#1b2a2e]">
									You&apos;re on the list
								</h3>
								<p className="mt-2 text-sm text-[#1b2a2e]/70">{state.message}</p>
							</div>
						) : (
							<form
								action={action}
								className="rounded-3xl bg-[#fbe9d7] p-6 sm:p-8 border border-[#1b2a2e]/15 shadow-[0_25px_60px_-25px_rgba(27,42,46,0.4)]"
							>
								<label
									htmlFor="newsletter-email"
									className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1b2a2e]/60"
								>
									Email
								</label>
								<div className="mt-2 flex flex-col gap-3 sm:flex-row">
									<input
										id="newsletter-email"
										type="email"
										name="email"
										placeholder="hello@example.com"
										required
										className="h-12 w-full flex-1 rounded-full border border-[#1b2a2e]/15 bg-white px-5 text-[#1b2a2e] outline-none transition-all placeholder:text-[#1b2a2e]/40 focus:border-[#1b2a2e]/40 focus:ring-2 focus:ring-[#9f9cf5]/40"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1b2a2e] px-6 font-semibold text-[#fbe9d7] transition-all hover:bg-[#0f1c1f] disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</div>
								<p className="mt-3 text-[11px] text-[#1b2a2e]/55">
									By subscribing you agree to receive marketing emails. We&apos;ll never share your address.
								</p>
								{state?.error && <p className="mt-2 text-sm text-red-700">{state.error}</p>}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
