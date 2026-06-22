"use client";

import { ArrowRightIcon, CheckIcon, MailIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[var(--forest-deep)] border-b border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
				<div className="grid md:grid-cols-12 gap-6 items-center">
					<div className="md:col-span-5">
						<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--lime)]">
							<MailIcon className="size-3" />
							Newsletter
						</div>
						<h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white tracking-tight text-balance">
							Solar updates, install tips, real numbers.
						</h2>
					</div>

					<div className="md:col-span-7">
						{state?.success ? (
							<div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-white">
								<span className="flex size-9 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--forest-deep)]">
									<CheckIcon className="size-4" />
								</span>
								<div>
									<div className="font-semibold">You're on the list</div>
									<div className="text-sm text-white/70">{state.message}</div>
								</div>
							</div>
						) : (
							<form action={action} className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-white outline-none transition-all placeholder:text-white/40 focus:border-[var(--lime)] focus:ring-2 focus:ring-[var(--lime)]/30"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--lime)] px-7 font-semibold text-[var(--forest-deep)] transition hover:brightness-95 disabled:opacity-60"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
						)}
						{state?.error && <p className="mt-3 text-sm text-red-300">{state.error}</p>}
						<p className="mt-3 text-xs text-white/50">
							No spam. Unsubscribe any time. We send roughly one email a month.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
