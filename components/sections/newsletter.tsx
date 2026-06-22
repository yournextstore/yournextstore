"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
			<div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 sm:p-14">
				<div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-yns-sun/15 blur-3xl" />
				<div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-yns-rose/15 blur-3xl" />

				<div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
					<div>
						<p className="text-xs tracking-[0.22em] uppercase text-background/60 mb-3">— The Sunday letter</p>
						{state?.success ? (
							<>
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-background/10 mb-5">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="yns-display text-4xl sm:text-5xl leading-[1.02]">You&apos;re on the list.</h2>
								<p className="mt-3 text-background/70 max-w-md">{state.message}</p>
							</>
						) : (
							<>
								<h2 className="yns-display text-4xl sm:text-5xl leading-[1.02]">
									Slower mornings,
									<br />
									<span className="italic">delivered Sundays.</span>
								</h2>
								<p className="mt-4 text-background/70 max-w-md leading-relaxed">
									Studio notes, new arrivals before they go public, and the occasional reading list. No noise
									— just things we&apos;d send a friend.
								</p>
							</>
						)}
					</div>
					{!state?.success && (
						<form action={action} className="w-full">
							<div className="flex flex-col gap-3">
								<label className="text-xs tracking-[0.18em] uppercase text-background/50">
									Email address
								</label>
								<div className="flex flex-col sm:flex-row gap-3">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 rounded-full border border-background/20 bg-background/5 px-5 text-background outline-none transition-all placeholder:text-background/30 focus:border-background/40 focus:ring-2 focus:ring-background/10"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-yns-sun px-7 font-medium text-foreground transition-all hover:opacity-90 disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</div>
								<p className="text-xs text-background/40 mt-1">
									By subscribing you agree to our privacy policy. Unsubscribe anytime.
								</p>
								{state?.error && <p className="mt-1 text-sm text-red-300">{state.error}</p>}
							</div>
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
