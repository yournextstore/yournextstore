"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-cream-soft">
			<div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				{/* Decorative soft circles */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#f2d7d0]/60 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-[#e8b7ae]/40 blur-3xl"
				/>
				<div className="relative mx-auto max-w-xl text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-cream">
								<CheckIcon className="h-5 w-5" />
							</div>
							<h2
								className="font-display text-[36px] italic leading-tight text-foreground sm:text-[44px]"
								style={{ fontFamily: "var(--font-cormorant)" }}
							>
								Welcome in.
							</h2>
							<p className="mt-3 text-[15px] text-muted-foreground">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] font-medium uppercase tracking-[0.28em] text-clay">
								Join the inner circle
							</p>
							<h2
								className="mt-4 font-display text-[42px] italic leading-[1.05] tracking-tight text-foreground sm:text-[56px]"
								style={{ fontFamily: "var(--font-cormorant)" }}
							>
								Little love letters,
								<br />
								straight to your inbox.
							</h2>
							<p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
								Be first to shop new drops, behind-the-seam stories and 10% off your first order.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:gap-0"
							>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-foreground/15 bg-white/80 px-6 text-[14px] text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-foreground/40 sm:rounded-r-none sm:border-r-0"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-foreground px-8 text-[12px] font-semibold uppercase tracking-[0.22em] text-cream transition-all hover:bg-foreground/85 disabled:opacity-50 sm:rounded-l-none"
								>
									{isPending ? "Joining…" : "Sign Up"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-500">{state.error}</p>}
							<p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
								By signing up you agree to our privacy policy.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
