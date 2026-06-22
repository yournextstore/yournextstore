"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[color:var(--color-yns-blue-300)] text-[color:var(--color-yns-navy)] overflow-hidden">
			<div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 sm:py-20">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
					{state?.success ? (
						<div className="md:col-span-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-yns-navy)]/10">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-serif text-3xl font-light">You&apos;re on the list</h2>
							<p className="mt-3 text-[color:var(--color-yns-navy)]/70">{state.message}</p>
						</div>
					) : (
						<>
							<div>
								<p className="text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-navy)]/60">
									Letters from the kitchen
								</p>
								<h2 className="mt-4 font-serif font-light text-3xl sm:text-4xl leading-[1.1]">
									Brew notes, new harvests, the occasional recipe.
								</h2>
							</div>
							<form action={action} className="flex flex-col gap-3">
								<div className="flex border-b border-[color:var(--color-yns-navy)]/30 focus-within:border-[color:var(--color-yns-navy)] transition-colors">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 bg-transparent text-[color:var(--color-yns-navy)] outline-none placeholder:text-[color:var(--color-yns-navy)]/45"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="shrink-0 px-3 text-[11px] tracking-[0.32em] uppercase text-[color:var(--color-yns-navy)] hover:opacity-70 transition-opacity disabled:opacity-50"
									>
										{isPending ? "Sending…" : "Subscribe"}
									</button>
								</div>
								{state?.error && (
									<p className="text-sm text-[color:var(--color-yns-navy-deep)]">{state.error}</p>
								)}
								<p className="text-xs text-[color:var(--color-yns-navy)]/60">
									No noise, ever. Unsubscribe with a single click.
								</p>
							</form>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
