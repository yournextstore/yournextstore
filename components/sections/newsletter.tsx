"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-cream relative isolate overflow-hidden">
			{/* Decorative botanical line illustration */}
			<svg
				aria-hidden="true"
				className="absolute -top-10 left-1/2 -translate-x-1/2 w-[1200px] h-40 text-forest/15 pointer-events-none"
				viewBox="0 0 1200 200"
				fill="none"
			>
				<path d="M0 100 Q 300 0, 600 100 T 1200 100" stroke="currentColor" strokeWidth="1" />
				<path d="M0 130 Q 300 30, 600 130 T 1200 130" stroke="currentColor" strokeWidth="1" />
				<path d="M0 70 Q 300 -30, 600 70 T 1200 70" stroke="currentColor" strokeWidth="1" />
			</svg>
			<div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="max-w-xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
								<CheckIcon className="h-6 w-6" strokeWidth={1.5} />
							</div>
							<h2 className="font-serif text-3xl sm:text-4xl text-ink">You&apos;re on the list</h2>
							<p className="mt-3 text-muted-foreground font-light">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-3">
								Postcards From The Studio
							</p>
							<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.05]">
								Be the first to hear,
								<br />
								<em className="italic text-forest">first to wear.</em>
							</h2>
							<p className="mt-5 max-w-md mx-auto text-muted-foreground font-light text-sm sm:text-base">
								New arrivals, exclusive previews and stories from the road, delivered to your inbox each
								Sunday.
							</p>
							<form
								action={action}
								className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:gap-0 sm:border-b sm:border-ink/30"
							>
								<input
									type="email"
									name="email"
									placeholder="Your email address"
									required
									className="h-12 w-full flex-1 bg-transparent px-1 sm:px-2 text-ink outline-none placeholder:text-ink/40 border-b border-ink/30 sm:border-b-0 transition-colors focus:border-ink"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center px-8 text-[11px] tracking-[0.22em] uppercase font-semibold text-ink hover:text-forest transition-colors disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Sign Up"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
							<p className="mt-5 text-[10px] tracking-[0.18em] uppercase text-muted-foreground/80">
								By subscribing you agree to our privacy policy
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
