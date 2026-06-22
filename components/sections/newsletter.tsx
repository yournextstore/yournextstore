"use client";

import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-bone-deep">
			<div className="absolute inset-0 opacity-50 mix-blend-multiply">
				<Image src="/scraped-2.jpg" alt="" fill sizes="100vw" className="object-cover" />
			</div>
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40"
			/>
			<div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">The dispatch</p>
						<h2 className="mt-5 font-display text-[2.1rem] sm:text-[2.8rem] leading-[1.05] tracking-[-0.03em] text-balance">
							Quiet letters on cellular health, sent every other Sunday.
						</h2>
						<p className="mt-5 max-w-md text-[0.95rem] text-muted-foreground">
							Research summaries, practitioner conversations, and the occasional protocol update. No subject
							lines in all caps.
						</p>
					</div>
					<div className="lg:pl-8">
						{state?.success ? (
							<div className="animate-float-up rounded-xl bg-background p-8">
								<div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-moss text-bone">
									<CheckIcon className="h-5 w-5" />
								</div>
								<h3 className="font-display text-[1.4rem] tracking-tight">You&apos;re on the list.</h3>
								<p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
							</div>
						) : (
							<form action={action} className="rounded-xl bg-background p-8 shadow-sm">
								<label
									htmlFor="newsletter-email"
									className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground"
								>
									Email address
								</label>
								<div className="mt-3 flex flex-col gap-3 sm:flex-row">
									<input
										id="newsletter-email"
										type="email"
										name="email"
										placeholder="you@home.com"
										required
										className="h-12 w-full flex-1 rounded-full border border-border bg-background px-5 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-moss focus:ring-2 focus:ring-moss/20"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-foreground px-7 text-sm font-medium text-primary-foreground transition-all hover:bg-moss disabled:opacity-50"
									>
										{isPending ? "Sending…" : "Subscribe"}
									</button>
								</div>
								<p className="mt-4 text-[0.72rem] text-muted-foreground">
									By subscribing you agree to our Privacy Policy. Unsubscribe in one click.
								</p>
								{state?.error && <p className="mt-3 text-sm text-destructive">{state.error}</p>}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
