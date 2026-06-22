"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-cream pb-16 sm:pb-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative rounded-[2rem] overflow-hidden bg-forest-grain p-10 sm:p-16">
					<svg
						aria-hidden="true"
						className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
						viewBox="0 0 800 400"
						preserveAspectRatio="xMidYMid slice"
					>
						<title>decoration</title>
						<circle cx="650" cy="80" r="180" fill="#C6F26D" opacity="0.1" />
						<circle cx="100" cy="350" r="140" fill="#F4E6D8" opacity="0.08" />
						<path
							d="M-50 200C200 100 400 300 850 100"
							stroke="#C6F26D"
							strokeWidth="2"
							strokeDasharray="4 8"
							opacity="0.3"
							fill="none"
						/>
					</svg>

					<div className="relative max-w-2xl mx-auto text-center text-cream">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-lime text-forest-deep">
									<CheckIcon className="h-7 w-7" />
								</div>
								<h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
									You're on the list
								</h2>
								<p className="mt-3 text-cream/70">{state.message}</p>
							</div>
						) : (
							<>
								<span className="inline-flex items-center gap-2 rounded-full bg-cream/10 border border-cream/20 px-3 py-1 text-xs font-medium">
									<span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
									Weekly farmers' digest
								</span>
								<h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
									What's in season, in your inbox.
								</h2>
								<p className="mt-4 text-base sm:text-lg text-cream/70 max-w-md mx-auto">
									Recipes, vendor stories and early access to seasonal drops — never spammy, always wholesome.
								</p>
								<form action={action} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
									<input
										type="email"
										name="email"
										placeholder="you@kitchen.com"
										required
										className="h-12 w-full flex-1 rounded-full border border-cream/20 bg-cream/10 px-5 text-cream outline-none transition placeholder:text-cream/40 focus:border-lime focus:ring-2 focus:ring-lime/30"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-lime px-6 font-semibold text-forest-deep transition hover:bg-lime/90 disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</form>
								{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
								<p className="mt-4 text-xs text-cream/50">
									No spam. Unsubscribe anytime. Read our privacy policy.
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
