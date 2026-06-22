"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-sky-scene">
			<div
				className="absolute inset-0 pointer-events-none opacity-50"
				style={{
					backgroundImage:
						"radial-gradient(circle at 18% 30%, #ffffff80 0 50px, transparent 70px), radial-gradient(circle at 82% 18%, #ffffff80 0 40px, transparent 60px), radial-gradient(circle at 50% 88%, #ffffff80 0 60px, transparent 80px)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="mx-auto max-w-2xl">
					<div className="relative rounded-[32px] bg-foreground text-background p-8 sm:p-12 border-2 border-foreground shadow-[8px_8px_0_#131316]">
						{state?.success ? (
							<div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[--color-sun-pop] text-foreground">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
									You&apos;re in the hive
								</h2>
								<p className="mt-3 text-background/70">{state.message}</p>
							</div>
						) : (
							<div className="text-center">
								<span className="inline-flex items-center gap-2 rounded-full bg-[--color-sun-pop] text-foreground px-3 py-1 text-[10px] font-bold tracking-[0.25em]">
									JOIN THE HIVE
								</span>
								<h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-[0.95]">
									Get 10% off your
									<br />
									<span className="text-[--color-sun-pop]">first buzz</span>
								</h2>
								<p className="mt-4 text-base text-background/70 max-w-md mx-auto">
									New drops, restock alerts, and the occasional bee joke. Unsubscribe whenever.
								</p>
								<form action={action} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 rounded-full border-2 border-background/30 bg-background/10 px-5 text-background outline-none transition-all placeholder:text-background/40 focus:border-[--color-sun-pop] focus:ring-2 focus:ring-[--color-sun-pop]/40"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[--color-sun-pop] px-7 font-display font-extrabold uppercase text-sm tracking-wide text-foreground border-2 border-foreground transition-all hover:bg-white disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</form>
								{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
