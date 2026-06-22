"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-[#e11226] text-[#fbf6ec]">
			<div aria-hidden="true" className="absolute inset-0 yns-grain opacity-25" />
			<svg
				aria-hidden="true"
				className="absolute -top-32 -right-32 h-[420px] w-[420px] opacity-40"
				viewBox="0 0 600 600"
			>
				<title>Newsletter bloom</title>
				<defs>
					<radialGradient id="nl-bloom" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#f2b7c1" stopOpacity="0.8" />
						<stop offset="100%" stopColor="#e11226" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle cx="300" cy="300" r="280" fill="url(#nl-bloom)" />
			</svg>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#fbf6ec]/15 border border-[#fbf6ec]/30">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="font-serif text-4xl sm:text-5xl italic tracking-tight">
								You&apos;re officially hot.
							</h2>
							<p className="mt-4 text-[#fbf6ec]/80">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] tracking-[0.5em] uppercase text-[#fbf6ec]/75 font-semibold">
								Join the list
							</p>
							<h2 className="mt-4 font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95]">
								Stay hot, <span className="italic text-[#f2b7c1]">stay hydrated.</span>
							</h2>
							<p className="mt-5 text-base leading-relaxed text-[#fbf6ec]/80 max-w-md mx-auto">
								Early drops, secret flavors, behind-the-scenes shoots. Straight to your inbox, never spammy.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-[#fbf6ec]/40 bg-[#fbf6ec]/10 px-6 text-[#fbf6ec] outline-none transition-all placeholder:text-[#fbf6ec]/50 focus:border-[#fbf6ec] focus:bg-[#fbf6ec]/15"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#fbf6ec] px-8 text-xs tracking-[0.28em] uppercase font-semibold text-[#0f0f10] transition-all hover:bg-[#f2b7c1] disabled:opacity-50"
								>
									{isPending ? "Joining…" : "Subscribe"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-[#f2b7c1]">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
