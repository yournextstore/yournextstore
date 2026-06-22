"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[#f2c9a6] overflow-hidden relative">
			<div className="absolute inset-0 scent-grain opacity-40 pointer-events-none" aria-hidden="true" />
			<svg
				className="absolute top-1/2 -translate-y-1/2 left-0 w-32 h-32 opacity-30 -translate-x-1/3"
				viewBox="0 0 100 100"
				fill="none"
				aria-hidden="true"
			>
				<circle cx="50" cy="50" r="40" stroke="#1a1a2e" strokeWidth="0.5" />
				<circle cx="50" cy="50" r="20" stroke="#1a1a2e" strokeWidth="0.5" />
			</svg>
			<svg
				className="absolute top-1/2 -translate-y-1/2 right-0 w-32 h-32 opacity-30 translate-x-1/3"
				viewBox="0 0 100 100"
				fill="none"
				aria-hidden="true"
			>
				<circle cx="50" cy="50" r="40" stroke="#1a1a2e" strokeWidth="0.5" />
				<circle cx="50" cy="50" r="20" stroke="#1a1a2e" strokeWidth="0.5" />
			</svg>
			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a2e] text-[#fdf6ee]">
							<CheckIcon className="h-6 w-6" />
						</div>
						<h2 className="font-display text-4xl sm:text-5xl text-[#1a1a2e]">You&apos;re on the list</h2>
						<p className="mt-3 text-[#1a1a2e]/70">{state.message}</p>
					</div>
				) : (
					<>
						<p className="font-script text-3xl text-[#4d4bc4]">join the club</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a2e] leading-tight">
							Get scent drops &amp; secret deals.
						</h2>
						<p className="mt-4 text-base sm:text-lg text-[#1a1a2e]/70 max-w-xl mx-auto">
							Limited batches, new fragrances, behind-the-scenes ingredient stories. No spam, ever.
						</p>
						<form action={action} className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full border border-[#1a1a2e]/20 bg-[#fdf6ee] px-5 text-[#1a1a2e] placeholder:text-[#1a1a2e]/40 outline-none focus:ring-2 focus:ring-[#4d4bc4]"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1a1a2e] px-8 font-semibold tracking-wide uppercase text-sm text-[#fdf6ee] transition-all hover:bg-[#4d4bc4] disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Sign Me Up"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
