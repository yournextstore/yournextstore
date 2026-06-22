"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-background pb-20 sm:pb-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[2rem] bg-foreground text-background px-6 sm:px-12 py-14 sm:py-20">
					{/* decorative blobs */}
					<div
						aria-hidden
						className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"
					/>

					<div className="relative max-w-2xl mx-auto text-center">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-foreground">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.035em]">
									You&apos;re on the list
								</h2>
								<p className="mt-3 text-background/70">{state.message}</p>
							</div>
						) : (
							<>
								<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-background/80">
									<span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
									One quiet email a month
								</div>
								<h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em]">
									Slower retail, in your inbox.
								</h2>
								<p className="mt-4 text-base sm:text-lg leading-relaxed text-background/70 max-w-md mx-auto">
									Restocks, new makers, and the occasional note from the studio. No churn, no urgency.
								</p>
								<form
									action={action}
									className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:rounded-full sm:border sm:border-white/15 sm:bg-white/5 sm:p-1"
								>
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 rounded-full bg-white/10 px-5 text-background outline-none transition-all placeholder:text-background/40 focus:bg-white/15 focus:ring-2 focus:ring-accent/50 sm:bg-transparent sm:focus:ring-0"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-foreground transition-all hover:bg-accent/90 disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</form>
								{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
								<p className="mt-4 text-xs text-background/50">No spam. Unsubscribe in one click.</p>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
