"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-[var(--yns-cyan)] text-black overflow-hidden">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-25"
				style={{
					backgroundImage: "url(/hero-bg-2.svg)",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			<div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-display uppercase text-4xl sm:text-5xl">You&apos;re in.</h2>
							<p className="mt-3 text-black/70 text-lg">{state.message}</p>
						</div>
					) : (
						<>
							<div className="font-display uppercase tracking-[0.22em] text-xs text-black/60">
								Get on the list
							</div>
							<h2 className="mt-3 font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
								New flavors drop
								<br />
								first to your inbox.
							</h2>
							<p className="mt-5 text-black/70 max-w-xl mx-auto text-lg">
								No spam. No 11 emails a week. Just the new drops, the rare restocks, and the occasional free
								pint.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-14 w-full flex-1 rounded-full border-2 border-black/30 bg-white/40 px-6 text-black outline-none transition-all placeholder:text-black/40 focus:border-black focus:bg-white"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-black px-8 font-display uppercase tracking-[0.14em] text-[13px] text-white transition-all hover:bg-[#111] disabled:opacity-50"
								>
									{isPending ? "Sending…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-900">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
