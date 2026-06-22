"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-cyan-wave text-white overflow-hidden">
			{/* Decorative ripples */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 w-full h-full opacity-20"
				viewBox="0 0 1200 400"
				preserveAspectRatio="none"
			>
				{Array.from({ length: 6 }).map((_, i) => (
					<path
						key={`ripple-${i}`}
						d={`M0 ${60 + i * 60} Q300 ${20 + i * 60} 600 ${60 + i * 60} T1200 ${60 + i * 60}`}
						stroke="white"
						strokeWidth="2"
						fill="none"
					/>
				))}
			</svg>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-fizz-yellow text-fizz-ink">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="font-display uppercase text-3xl sm:text-5xl tracking-tight">
								You&apos;re on the list
							</h2>
							<p className="mt-3 text-white/80 font-medium">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-xs uppercase tracking-[0.4em] font-bold text-fizz-yellow mb-4">
								Pour Newsletter
							</p>
							<h2 className="font-display uppercase text-fizz-yellow text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
								Stay Fizz Free.
							</h2>
							<p className="mt-6 text-base sm:text-lg text-white/90 font-semibold max-w-md mx-auto">
								Get launches, party invites, and the occasional poolside playlist. No spam, ever.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md gap-2 rounded-full bg-white/95 p-1.5 sticker-shadow"
							>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 flex-1 bg-transparent px-5 text-fizz-ink placeholder:text-fizz-ink/40 outline-none text-sm font-semibold"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 items-center justify-center rounded-full bg-fizz-yellow px-6 sm:px-8 text-sm font-bold text-fizz-ink transition-all hover:bg-white disabled:opacity-50"
								>
									{isPending ? "Joining…" : "Subscribe"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-fizz-yellow">{state.error}</p>}
							<p className="mt-5 text-[0.7rem] uppercase tracking-[0.25em] text-white/70 font-bold">
								Must be 21+ to subscribe · Drink responsibly
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
