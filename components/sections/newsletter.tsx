"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-background border-y border-border">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
				<div className="grid gap-10 lg:grid-cols-12 lg:gap-16 items-center">
					<div className="lg:col-span-6">
						<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
							§ 05 — Dispatch
						</span>
						<h2 className="mt-3 display-headline text-[clamp(2rem,5vw,3.5rem)] text-foreground">
							Field notes,
							<br />
							from the workshop.
						</h2>
					</div>
					<div className="lg:col-span-6">
						{state?.success ? (
							<div className="flex items-center gap-4 border border-border bg-[#f2f3f5] px-6 py-5">
								<div className="flex size-10 shrink-0 items-center justify-center bg-foreground text-background">
									<CheckIcon className="h-5 w-5" />
								</div>
								<div>
									<p className="font-semibold text-foreground">You&apos;re on the list.</p>
									<p className="text-sm text-muted-foreground">{state.message}</p>
								</div>
							</div>
						) : (
							<>
								<p className="text-base leading-relaxed text-muted-foreground max-w-md">
									Engineering deep-dives, launch announcements, and the occasional unfiltered note from the
									bench. No marketing fluff.
								</p>
								<form action={action} className="mt-6 flex flex-col gap-3 sm:flex-row">
									<input
										type="email"
										name="email"
										placeholder="you@domain.com"
										required
										className="h-12 w-full flex-1 border border-border bg-background px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-foreground px-8 text-[13px] font-medium uppercase tracking-[0.18em] text-background transition-all hover:bg-[#3d4146] disabled:opacity-50"
									>
										{isPending ? "Sending" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
									</button>
								</form>
								{state?.error && <p className="mt-3 text-sm text-destructive">{state.error}</p>}
								<p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
									One email per month · Unsubscribe anytime
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
