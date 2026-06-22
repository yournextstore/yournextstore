"use client";

import { ArrowUpRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="mt-4 sm:mt-5 relative overflow-hidden rounded-[2rem] bg-[#0f0f0f] text-white">
			{/* Glow accents */}
			<div
				aria-hidden="true"
				className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[#ff6b35]/30 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#2f62f6]/25 blur-3xl"
			/>

			<div className="relative px-6 sm:px-10 lg:px-14 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
				{state?.success ? (
					<div className="lg:col-span-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
							<CheckIcon className="h-6 w-6" />
						</div>
						<h2 className="font-display uppercase text-3xl sm:text-4xl">You&apos;re on the list</h2>
						<p className="mt-3 text-white/60">{state.message}</p>
					</div>
				) : (
					<>
						<div>
							<span className="inline-flex items-center gap-2 rounded-full bg-[#d9f560] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0f0f0f]">
								Newsletter
							</span>
							<h2 className="mt-5 font-display uppercase text-3xl sm:text-4xl lg:text-5xl leading-[0.95]">
								Drop into
								<br /> our inbox
							</h2>
							<p className="mt-4 text-white/60 text-base max-w-md">
								Early access to drops, design notes from our studios, and the occasional summer sale.
							</p>
						</div>
						<form action={action} className="w-full">
							<div className="flex flex-col sm:flex-row gap-3 rounded-full bg-white/5 ring-1 ring-white/15 p-2">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-11 flex-1 rounded-full bg-transparent px-5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 font-semibold text-white transition-all hover:bg-[#ff8a5b] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowUpRightIcon className="h-4 w-4" />}
								</button>
							</div>
							{state?.error && <p className="mt-3 text-sm text-red-300">{state.error}</p>}
							<p className="mt-3 text-xs text-white/40">We only send the good stuff. Unsubscribe anytime.</p>
						</form>
					</>
				)}
			</div>
		</section>
	);
}
