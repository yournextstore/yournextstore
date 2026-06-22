"use client";

import { ArrowRightIcon, CheckIcon, Mail } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
			<div
				className="relative overflow-hidden rounded-3xl border border-white/8 px-6 sm:px-10 py-14 sm:py-16"
				style={{
					background:
						"radial-gradient(80% 100% at 50% 0%, rgba(217,70,196,0.18), transparent 60%), linear-gradient(180deg, #15141a 0%, #0f0e12 100%)",
				}}
			>
				<div className="bg-grid absolute inset-0 opacity-40" aria-hidden="true" />

				<div className="relative max-w-xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div
								className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full"
								style={{
									background: "linear-gradient(135deg, #d946c4, #a855f7)",
									boxShadow: "0 0 24px rgba(217,70,196,0.55)",
								}}
							>
								<CheckIcon className="h-6 w-6 text-white" />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
								Locked in.
							</h2>
							<p className="mt-3 text-muted-foreground">{state.message}</p>
						</div>
					) : (
						<>
							<div className="inline-flex items-center gap-2 mb-5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
								<Mail className="h-3 w-3 text-primary" />
								<span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
									Drop watch
								</span>
							</div>
							<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight">
								First dibs on{" "}
								<span className="bg-gradient-to-r from-[#d946c4] to-[#a855f7] bg-clip-text text-transparent">
									limited drops
								</span>
							</h2>
							<p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
								New silicon, restocks, and subscriber-only build kits — delivered the moment they ship.
							</p>
							<form action={action} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-white/10 bg-white/5 px-5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="btn-neon inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-white transition-all disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
