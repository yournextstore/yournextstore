"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-luxe-frame text-luxe-cream">
			<div
				aria-hidden
				className="absolute inset-0 opacity-60"
				style={{
					background:
						"radial-gradient(60% 80% at 50% 100%, rgba(240,184,200,0.35) 0%, transparent 70%), radial-gradient(50% 60% at 50% 0%, rgba(123,91,214,0.45) 0%, transparent 70%)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-background/10">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="text-2xl sm:text-3xl font-medium tracking-tight">You&apos;re on the list</h2>
							<p className="mt-3 text-background/60">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-lilac)]">
								The Letter
							</p>
							<h2 className="mt-3 font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-white">
								Whispers in your inbox
							</h2>
							<p className="mt-4 max-w-md mx-auto text-base leading-relaxed text-[color:var(--color-luxe-cream)]/70">
								Be the first to know about new arrivals, atelier stories, and private events. Monthly, never
								excessive.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-background/20 bg-background/10 px-5 text-background outline-none transition-all placeholder:text-background/30 focus:border-background/40 focus:ring-2 focus:ring-background/10"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-background px-8 font-medium text-foreground transition-all hover:bg-background/90 disabled:opacity-50"
								>
									{isPending ? "Subscribing\u2026" : "Subscribe"}
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
