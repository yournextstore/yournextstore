"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-background border-t border-foreground/10">
			<div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-10 items-end max-w-5xl mx-auto">
					<div className="lg:col-span-7">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background">
									<CheckIcon className="h-5 w-5" />
								</div>
								<h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] tracking-tight">
									You&apos;re on the list.
								</h2>
								<p className="mt-3 text-foreground/65">{state.message}</p>
							</div>
						) : (
							<>
								<p className="text-eyebrow text-[color:var(--color-terracotta-deep)] mb-4">Stay Close</p>
								<h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.05] tracking-tight text-foreground">
									New shades. Quiet drops. A note every other Sunday.
								</h2>
							</>
						)}
					</div>

					{!state?.success && (
						<div className="lg:col-span-5">
							<form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
								<div className="flex-1">
									<label htmlFor="email" className="text-eyebrow text-foreground/55 mb-2 block">
										Email
									</label>
									<input
										id="email"
										type="email"
										name="email"
										placeholder="you@something.com"
										required
										className="h-12 w-full bg-transparent border-b border-foreground/30 text-foreground outline-none placeholder:text-foreground/35 focus:border-foreground transition-colors"
									/>
								</div>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center bg-foreground px-7 text-[0.78rem] tracking-[0.22em] uppercase font-semibold text-background hover:bg-[color:var(--color-slate-ink)] transition-colors disabled:opacity-50"
								>
									{isPending ? "Joining…" : "Sign Me Up"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
							<p className="mt-4 text-xs text-foreground/55">
								By signing up, you agree to receive emails. Unsubscribe any time.
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
