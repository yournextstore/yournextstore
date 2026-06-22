"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-yns-brown text-yns-cream-soft">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-yns-yellow text-yns-brown">
							<CheckIcon className="h-7 w-7" />
						</div>
						<h2 className="font-display text-3xl sm:text-4xl">You&apos;re in.</h2>
						<p className="mt-3 text-yns-cream-soft/70 italic">{state.message}</p>
					</div>
				) : (
					<>
						<p className="font-script text-yns-yellow text-2xl sm:text-3xl">Stay in the loop</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-1 text-yns-cream-soft">
							Snack mail, not spam
						</h2>
						<p className="mt-4 italic text-yns-cream-soft/70 max-w-md mx-auto">
							New flavor drops, secret discounts, and a confetti-worthy welcome treat for joining.
						</p>
						<form action={action} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full border-2 border-yns-cream-soft/30 bg-yns-brown-soft/40 px-5 text-yns-cream-soft outline-none transition-all placeholder:text-yns-cream-soft/40 focus:border-yns-yellow focus:bg-yns-brown-soft/60"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-yns-yellow font-display tracking-wider uppercase px-6 text-yns-brown transition-all hover:bg-yns-cream-soft disabled:opacity-50 text-sm border-2 border-yns-yellow"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-yns-yellow">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
