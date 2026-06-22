"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="hayati-band relative overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(217,164,65,0.18)_0%,transparent_70%)]"
			/>
			<div className="relative max-w-3xl mx-auto px-6 sm:px-8 py-20 sm:py-28 text-center">
				<div className="hayati-divider mb-6 text-xs">
					<span className="hayati-star" />
					<span className="hayati-star" />
					<span className="hayati-star" />
				</div>
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#b81e26] text-[#fbe5ea]">
							<CheckIcon className="h-6 w-6" />
						</div>
						<h2 className="font-display italic text-3xl sm:text-4xl text-[#7a0e15]">Ahlan wa sahlan</h2>
						<p className="mt-3 text-[#7a0e15]/80">{state.message}</p>
					</div>
				) : (
					<>
						<h2 className="font-display italic text-3xl sm:text-5xl text-[#7a0e15] leading-tight">
							Letters from the spice mill.
						</h2>
						<p className="mt-4 text-[15px] leading-relaxed text-[#7a0e15]/70 max-w-md mx-auto">
							New blends, recipe letters, and first looks at limited-edition tins — once or twice a month,
							never more.
						</p>
						<form
							action={action}
							className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center"
						>
							<input
								type="email"
								name="email"
								placeholder="you@kitchen.com"
								required
								className="h-12 w-full flex-1 rounded-full border border-[#b81e26]/30 bg-white/80 px-5 text-[#2b2120] placeholder:text-[#7a0e15]/40 outline-none transition-all focus:border-[#b81e26] focus:ring-2 focus:ring-[#b81e26]/20"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#b81e26] px-8 text-sm font-medium tracking-wide text-[#fbe5ea] transition-all hover:bg-[#7a0e15] disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Join the letter"}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-[#7a0e15]">{state.error}</p>}
					</>
				)}
				<div className="hayati-divider mt-8 text-xs">
					<span className="hayati-star" />
				</div>
			</div>
		</section>
	);
}
