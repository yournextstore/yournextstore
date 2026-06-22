"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-aura-cream overflow-hidden">
			{/* Decorative warm circles */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-caramel/25 blur-3xl"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full bg-clay/20 blur-3xl"
			/>

			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-aura-rise">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-espresso text-cream">
							<CheckIcon className="h-6 w-6" />
						</div>
						<h2 className="font-serif text-3xl sm:text-4xl text-walnut">You&apos;re on the list</h2>
						<p className="mt-3 text-espresso/65">{state.message}</p>
					</div>
				) : (
					<>
						<p className="text-[11px] uppercase tracking-[0.32em] text-clay mb-4">The atelier letter</p>
						<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-walnut text-balance">
							Slower mornings,
							<br />
							<span className="italic text-clay">in your inbox.</span>
						</h2>
						<p className="mx-auto mt-5 max-w-md text-base text-espresso/65 leading-relaxed">
							Once a month: new pieces, studio notes, and a slow recipe — never anything else.
						</p>
						<form
							action={action}
							className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:pl-5 sm:pr-1.5 sm:py-1.5 sm:bg-cream sm:border sm:border-clay/30 sm:rounded-full sm:shadow-sm"
						>
							<input
								type="email"
								name="email"
								placeholder="your email"
								required
								className="h-12 w-full flex-1 rounded-full sm:rounded-none border border-clay/30 sm:border-0 bg-cream px-5 sm:px-0 text-walnut placeholder:text-espresso/40 outline-none focus:ring-2 focus:ring-caramel/40 sm:focus:ring-0"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-espresso px-7 text-[12px] uppercase tracking-[0.22em] font-medium text-cream transition-colors hover:bg-walnut disabled:opacity-50"
							>
								{isPending ? "Joining…" : "Join"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						<p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-espresso/45">
							No spam · Unsubscribe anytime
						</p>
						{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
