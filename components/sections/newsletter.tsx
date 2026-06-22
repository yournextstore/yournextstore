"use client";

import { ArrowRightIcon, CheckIcon, MailIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
			<div className="relative overflow-hidden rounded-[28px] bg-[color:var(--mint-deep)] px-6 py-12 sm:px-12 sm:py-16">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[color:var(--mint)]/30 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-[color:var(--peach)]/20 blur-3xl"
				/>
				<div className="relative mx-auto max-w-2xl text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--mint-soft)]/15">
								<CheckIcon className="h-6 w-6 text-[color:var(--mint-soft)]" />
							</div>
							<h2 className="font-display text-2xl font-bold tracking-tight text-[color:var(--mint-soft)] sm:text-3xl">
								You&apos;re on the list
							</h2>
							<p className="mt-3 text-[color:var(--mint-soft)]/70">{state.message}</p>
						</div>
					) : (
						<>
							<span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[color:var(--mint-soft)]">
								<MailIcon className="h-3.5 w-3.5" />
								Stay in good hands
							</span>
							<h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[color:var(--mint-soft)] sm:text-4xl lg:text-5xl">
								Wellness tips, direct to your inbox
							</h2>
							<p className="mx-auto mt-4 max-w-md text-base text-[color:var(--mint-soft)]/70">
								Get pharmacist-approved health tips, exclusive offers, and product launches first.
							</p>
							<form
								action={action}
								className="mx-auto mt-8 flex max-w-md flex-col gap-3 rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/10 sm:flex-row"
							>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-11 w-full flex-1 rounded-full border-0 bg-transparent px-5 text-[color:var(--mint-soft)] outline-none placeholder:text-[color:var(--mint-soft)]/40"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--mint)] px-6 text-sm font-semibold text-[color:var(--mint-deep)] transition-all hover:bg-white disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-200">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
