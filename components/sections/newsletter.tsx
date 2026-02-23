"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-foreground text-background overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
								Stay in the loop
							</h2>
							<p className="mt-4 text-lg leading-relaxed text-background/60 max-w-md mx-auto">
								Be the first to know about new arrivals, exclusive offers, and stories from behind the scenes.
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
