"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-foreground text-background relative overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.04] pointer-events-none"
				style={{
					backgroundImage: "radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)",
					backgroundSize: "16px 16px",
				}}
			/>
			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-background/30">
								<CheckIcon className="h-5 w-5" strokeWidth={1.4} />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl tracking-[-0.01em]">
								You&rsquo;re on the list.
							</h2>
							<p className="mt-3 text-background/60 text-sm">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[10px] tracking-[0.3em] uppercase text-background/50">The Dispatch</p>
							<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.01em]">
								Receive first looks &<br className="hidden sm:block" /> private invitations.
							</h2>
							<p className="mt-6 text-sm sm:text-base leading-relaxed text-background/60 max-w-md mx-auto">
								A weekly letter on new arrivals, archived discoveries, and the makers behind them. No noise.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-none border-0 border-b border-background/30 bg-transparent px-1 text-background outline-none transition-all placeholder:text-background/30 focus:border-background"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 border border-background px-8 text-[11px] tracking-[0.25em] uppercase font-medium transition-all hover:bg-background hover:text-foreground disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
							<p className="mt-6 text-[10px] tracking-[0.25em] uppercase text-background/40">
								Unsubscribe at any time
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
