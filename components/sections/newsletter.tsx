"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-background border-t border-border">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-espresso text-cream">
							<CheckIcon className="h-5 w-5" />
						</div>
						<h2 className="font-display text-3xl sm:text-4xl text-espresso">You&apos;re on the list</h2>
						<p className="mt-3 text-espresso/65">{state.message}</p>
					</div>
				) : (
					<>
						<p className="font-script text-2xl text-terracotta mb-3">Join the table</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-espresso leading-[1.05]">
							Slow news,
							<br />
							bright flavor.
						</h2>
						<p className="mt-6 text-espresso/65 max-w-md mx-auto leading-relaxed">
							New flavors, seasonal drops and quiet stories from the roastery — sent every other Sunday.
						</p>
						<form
							action={action}
							className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row items-stretch"
						>
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-sm border border-espresso/30 bg-cream-soft px-5 text-espresso outline-none transition-all placeholder:text-espresso/40 focus:border-espresso focus:ring-2 focus:ring-terracotta/30"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="btn-fill-espresso justify-center disabled:opacity-50"
							>
								{isPending ? "Joining…" : "Subscribe"}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
