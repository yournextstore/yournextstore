"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative skylrk-aurora py-20 sm:py-28 overflow-hidden">
			<div className="absolute inset-0 skylrk-grain pointer-events-none" />
			<div className="relative max-w-[1400px] mx-auto px-6">
				<div className="max-w-2xl mx-auto text-center">
					<p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-300/70 mb-4">
						[ 004 — signal ]
					</p>
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10">
								<CheckIcon className="h-5 w-5 text-cyan-200" />
							</div>
							<h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">
								Signal received.
							</h2>
							<p className="mt-3 text-foreground/60 text-sm">{state.message}</p>
						</div>
					) : (
						<>
							<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
								Get drop alerts before
								<br />
								they reach the public.
							</h2>
							<p className="mt-5 text-sm sm:text-base leading-relaxed text-foreground/60 max-w-md mx-auto">
								Join the wait-list for unannounced drops, restocks, and members-only releases. No noise.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
							>
								<div className="flex flex-1 items-center rounded-full border border-border bg-background/40 backdrop-blur-md focus-within:border-cyan-300/40 transition-colors">
									<span className="pl-5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/40">
										[
									</span>
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-foreground/40"
									/>
									<span className="pr-5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/40">
										]
									</span>
								</div>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-7 font-mono text-[11px] uppercase tracking-[0.24em] text-background transition-all hover:bg-cyan-200 disabled:opacity-50"
								>
									{isPending ? "[ syncing… ]" : "[ Join ]"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
							<p className="mt-6 text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/40">
								[ ~ 1,800 dreamers already on the list ]
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
