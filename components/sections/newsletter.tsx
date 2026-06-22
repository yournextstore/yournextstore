"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative border-t border-foreground/10 bg-ink">
			<div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-24 lg:px-12">
				<div>
					<p className="text-[10px] tracking-microcaps text-foreground/55">The Dispatches</p>
					<h2 className="mt-3 font-serif-display text-4xl leading-[1.02] text-foreground sm:text-5xl lg:text-6xl">
						Letters
						<br />
						<span className="italic text-peach">from the atelier.</span>
					</h2>
				</div>
				<div className="flex flex-col justify-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15">
								<CheckIcon className="h-4 w-4 text-saffron" />
							</div>
							<p className="font-serif-display text-2xl text-foreground">You&rsquo;re on the list.</p>
							<p className="mt-3 text-sm text-foreground/60">{state.message}</p>
						</div>
					) : (
						<>
							<p className="max-w-md text-[15px] leading-relaxed text-foreground/65">
								Slow, quarterly letters from the perfumer. New chapters, batch releases, and notes from things
								we&rsquo;re reading. No mass mail.
							</p>
							<form
								action={action}
								className="mt-8 flex max-w-md items-end gap-4 border-b border-foreground/25 pb-3"
							>
								<input
									type="email"
									name="email"
									placeholder="your@address"
									required
									className="flex-1 bg-transparent text-base text-foreground placeholder:text-foreground/35 focus:outline-none"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="shrink-0 text-[10px] tracking-microcaps text-foreground/80 transition-colors hover:text-saffron disabled:opacity-50"
								>
									{isPending ? "Sending…" : "Subscribe →"}
								</button>
							</form>
							{state?.error && <p className="mt-3 text-sm text-rust">{state.error}</p>}
							<p className="mt-5 text-[10px] tracking-microcaps text-foreground/40">
								By subscribing you agree to receive ~4 letters per year.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
