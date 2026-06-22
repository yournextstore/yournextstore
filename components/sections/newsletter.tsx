"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-olive-grad text-[var(--cream)] relative overflow-hidden">
			{/* decorative ring */}
			<div className="pointer-events-none absolute -right-32 -top-32 w-[480px] h-[480px] rounded-full border border-[var(--cream)]/10" />
			<div className="pointer-events-none absolute -right-10 -top-10 w-[320px] h-[320px] rounded-full border border-[var(--cream)]/10" />
			<div className="pointer-events-none absolute -left-40 -bottom-40 w-[520px] h-[520px] rounded-full border border-[var(--cream)]/10" />

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div>
						<p className="text-[10px] tracking-[0.32em] uppercase text-[var(--cream)]/70 mb-5">
							— Letters from us
						</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
							Slow letters,
							<br />
							for slow homes.
						</h2>
						<p className="mt-6 text-[var(--cream)]/75 max-w-md leading-relaxed">
							Sign up for thoughtful notes on parenting, design and the rituals between. Subscribers receive
							10% off their first order.
						</p>
					</div>

					<div className="lg:pl-10">
						{state?.success ? (
							<div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cream)]/15">
									<CheckIcon className="h-6 w-6" />
								</div>
								<div>
									<h3 className="font-display text-2xl">You&apos;re on the list</h3>
									<p className="text-[var(--cream)]/70 text-sm">{state.message}</p>
								</div>
							</div>
						) : (
							<form action={action} className="flex flex-col gap-4">
								<div className="flex flex-col sm:flex-row gap-3 items-stretch border-b border-[var(--cream)]/30 pb-2">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 bg-transparent px-1 text-[var(--cream)] outline-none placeholder:text-[var(--cream)]/40 text-base"
									/>
									<button type="submit" disabled={isPending} className="btn-olive shrink-0">
										{isPending ? "Subscribing…" : "Subscribe"}
									</button>
								</div>
								<p className="text-[10px] tracking-[0.18em] uppercase text-[var(--cream)]/55">
									By subscribing you agree to our privacy policy.
								</p>
								{state?.error && <p className="text-sm text-red-300">{state.error}</p>}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
