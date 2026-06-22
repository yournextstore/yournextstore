"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-[color:var(--yns-pink)] overflow-hidden">
			<div className="absolute inset-0 yns-grain opacity-30 pointer-events-none" aria-hidden="true" />
			<div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
					<div className="lg:col-span-7">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[color:var(--yns-red)]">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white">
									You&apos;re in the gang
								</h2>
								<p className="mt-3 text-white/90">{state.message}</p>
							</div>
						) : (
							<>
								<span className="font-script text-3xl text-white">join us</span>
								<h2 className="mt-1 font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[0.95]">
									Good hair days,
									<br />
									delivered.
								</h2>
								<p className="mt-5 text-white/90 max-w-md text-lg">
									Drop your email for first-dibs launches, behind-the-scenes mess, and 10% off your first
									order.
								</p>
							</>
						)}
					</div>

					{!state?.success && (
						<form action={action} className="lg:col-span-5 flex flex-col gap-3">
							<label htmlFor="newsletter-email" className="sr-only">
								Email address
							</label>
							<input
								id="newsletter-email"
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-14 w-full border-2 border-white bg-transparent px-5 text-white outline-none placeholder:text-white/60 focus:bg-white/10"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="yns-btn-red h-14 inline-flex items-center justify-center text-[13px] font-extrabold tracking-[0.18em] uppercase disabled:opacity-60"
							>
								{isPending ? "Signing You Up…" : "Send Me The Goods"}
							</button>
							{state?.error && (
								<p className="text-sm text-white bg-[color:var(--yns-red)] px-3 py-1.5">{state.error}</p>
							)}
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
