"use client";

import { ArrowRight, Check, Mail } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-[--ink] text-white">
			<div
				aria-hidden
				className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sunset opacity-30 blur-3xl"
			/>
			<div
				aria-hidden
				className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[--teal] opacity-20 blur-3xl"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-[--sun]">The Dispatch</p>
						<h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
							Get first look at every drop, <span className="italic text-[--sun]">no spam</span>.
						</h2>
						<p className="mt-4 text-white/65 text-lg max-w-md leading-relaxed">
							Notes from the studio, member-only pieces, and the occasional 50% off something we'll never
							restock.
						</p>
					</div>

					<div className="lg:pl-8">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 backdrop-blur">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[--ember]">
									<Check className="h-6 w-6 text-white" strokeWidth={3} />
								</div>
								<h3 className="font-display text-2xl font-semibold">You're on the list</h3>
								<p className="mt-2 text-white/65">{state.message}</p>
							</div>
						) : (
							<form
								action={action}
								className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-2 sm:p-3 backdrop-blur"
							>
								<div className="flex flex-col sm:flex-row items-stretch gap-2">
									<div className="relative flex-1">
										<Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
										<input
											type="email"
											name="email"
											placeholder="your@email.com"
											required
											className="h-12 sm:h-14 w-full rounded-2xl bg-white/0 pl-11 pr-4 text-white placeholder:text-white/35 outline-none focus:bg-white/5 transition-colors"
										/>
									</div>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-2xl bg-[--ember] px-7 font-medium text-white transition-all hover:bg-[--sun] hover:text-[--ink] disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && <ArrowRight className="h-4 w-4" />}
									</button>
								</div>
								{state?.error && <p className="mt-3 px-2 text-sm text-[--sun]">{state.error}</p>}
								<p className="mt-3 px-2 text-xs text-white/40">
									By subscribing you agree to occasional emails. Unsubscribe anytime.
								</p>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
