"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="border-y border-border bg-bone/40">
			<div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-10">
				<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
					<div className="max-w-xl">
						<p className="eyebrow text-mushroom">The Letter</p>
						<h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl lg:text-[40px] lg:tracking-[-0.02em]">
							New stories, edits, and arrivals.
						</h2>
						<p className="mt-3 text-sm text-mushroom">
							Subscribe for early access to drops, atelier dispatches, and editor's notes — sent quietly,
							never loudly.
						</p>
					</div>

					{state?.success ? (
						<div className="flex items-center gap-3 text-foreground">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
								<CheckIcon className="h-4 w-4" />
							</div>
							<p className="text-sm">{state.message ?? "You're on the list."}</p>
						</div>
					) : (
						<form action={action} className="w-full max-w-md">
							<div className="relative flex items-end gap-4 border-b border-foreground/40 focus-within:border-foreground transition-colors">
								<input
									type="email"
									name="email"
									placeholder="Your email address"
									required
									className="h-12 w-full bg-transparent pr-10 text-sm text-foreground outline-none placeholder:text-mushroom/80"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="utility-caps inline-flex h-12 shrink-0 items-center gap-2 pr-1 text-foreground transition-opacity hover:opacity-70 disabled:opacity-50"
								>
									{isPending ? "Sending" : "Subscribe"}
									<ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
								</button>
							</div>
							{state?.error && <p className="mt-3 text-sm text-destructive">{state.error}</p>}
							<p className="mt-3 text-[11px] text-mushroom">
								By subscribing you agree to receive marketing emails. Unsubscribe at any time.
							</p>
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
