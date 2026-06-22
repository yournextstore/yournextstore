"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-[#050817] overflow-hidden">
			{/* aurora glow */}
			<div
				className="absolute inset-0 pointer-events-none opacity-60"
				style={{
					background:
						"radial-gradient(ellipse 50% 60% at 50% 100%, rgba(46,92,255,0.18) 0%, transparent 60%)",
				}}
			/>
			<div className="absolute inset-0 bg-stardust opacity-25 pointer-events-none" />

			<div className="relative max-w-3xl mx-auto px-6 py-24 sm:py-32 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#4a76ff]/15 ring-1 ring-[#4a76ff]/40">
							<CheckIcon className="h-5 w-5 text-[#4a76ff]" />
						</div>
						<h2 className="font-serif text-3xl sm:text-4xl font-light">You&apos;re on the list.</h2>
						<p className="mt-3 text-muted-foreground font-light">{state.message}</p>
					</div>
				) : (
					<>
						<p className="font-sans text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-6">
							Dispatches
						</p>
						<h2 className="font-serif text-balance text-4xl sm:text-5xl md:text-6xl font-light leading-tight">
							Letters from the late hours.
						</h2>
						<p className="mt-6 max-w-md mx-auto text-base text-muted-foreground font-light leading-relaxed">
							One short note a month. New editions, behind-the-scenes, the occasional playlist.
						</p>
						<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full border border-border bg-[#0b1024]/60 backdrop-blur-md px-5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[#4a76ff]/50 focus:ring-2 focus:ring-[#4a76ff]/20"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="btn-cobalt inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium text-white disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
						<p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
							No noise. Unsubscribe anytime.
						</p>
					</>
				)}
			</div>
		</section>
	);
}
