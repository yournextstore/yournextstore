"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[#f5e6d3]">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="relative overflow-hidden rounded-[2.5rem] bg-[#fbf4e8] border-4 border-[#fbf4e8] shadow-[0_30px_80px_-30px_rgba(74,44,26,0.4)] px-6 py-12 sm:px-12 sm:py-16">
					{/* Decorative folk illustrations */}
					<svg aria-hidden className="absolute -top-8 -left-8 w-40 h-40 opacity-50" viewBox="0 0 160 160">
						<g fill="#c99a5e">
							<circle cx="40" cy="40" r="4" />
							<circle cx="80" cy="20" r="2.5" />
							<circle cx="100" cy="50" r="3" />
							<circle cx="60" cy="70" r="2.5" />
							<path d="M 20 110 Q 30 90 40 110 Q 50 90 60 110 Z" />
							<path d="M 90 100 L 100 80 L 110 100 Z" />
						</g>
					</svg>
					<svg aria-hidden className="absolute -bottom-8 -right-8 w-40 h-40 opacity-50" viewBox="0 0 160 160">
						<g fill="#a8b5a0">
							<circle cx="120" cy="120" r="4" />
							<circle cx="80" cy="140" r="2.5" />
							<circle cx="60" cy="110" r="3" />
							<circle cx="100" cy="90" r="2.5" />
							<path d="M 100 50 Q 110 30 120 50 Q 130 30 140 50 Z" />
						</g>
					</svg>

					<div className="relative max-w-2xl mx-auto text-center">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#c99a5e] text-[#4a2c1a]">
									<CheckIcon className="h-7 w-7" />
								</div>
								<h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#4a2c1a]">
									Welcome to the family
								</h2>
								<p className="mt-3 text-[#8b5e3c]">{state.message}</p>
							</div>
						) : (
							<>
								<p className="font-display text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8b5e3c]">
									Join the sisterhood
								</p>
								<h2 className="mt-3 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#4a2c1a] leading-[0.95]">
									Get the good stuff <span className="italic">first</span>
								</h2>
								<p className="mt-5 text-base sm:text-lg text-[#8b5e3c] leading-relaxed">
									New flavors, farm postcards, and the occasional cookie recipe — straight to your inbox.
								</p>
								<form
									action={action}
									className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:bg-[#f5e6d3] sm:rounded-full sm:p-1.5 sm:border-2 sm:border-[#c99a5e]"
								>
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 rounded-full border-2 border-[#c99a5e] bg-[#f5e6d3] px-5 text-[#4a2c1a] outline-none transition-all placeholder:text-[#8b5e3c]/60 focus:border-[#8b5e3c] focus:ring-0 sm:border-0 sm:focus:border-0"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#c99a5e] px-7 font-display text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#4a2c1a] border-2 border-[#8b5e3c] shadow-[0_4px_0_0_#8b5e3c] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#8b5e3c] transition-all sm:border-0 sm:shadow-none sm:hover:translate-y-0 sm:hover:shadow-none disabled:opacity-50"
									>
										{isPending ? "Joining…" : "Sign me up"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</form>
								{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
