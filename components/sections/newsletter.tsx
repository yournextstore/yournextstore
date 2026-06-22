"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[var(--ivory)] border-t border-foreground/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="max-w-xl mx-auto text-center">
					{state?.success ? (
						<div className="muse-fade-up">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
								<CheckIcon className="h-5 w-5" />
							</div>
							<h2 className="font-serif italic text-4xl font-light text-foreground">A pleasure.</h2>
							<p className="mt-3 text-foreground/60">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] uppercase tracking-[0.32em] text-foreground/55">The Letter</p>
							<h2 className="mt-4 font-serif italic text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
								Soft news, rarely sent.
							</h2>
							<p className="mt-5 text-[15px] leading-[1.7] text-foreground/70">
								New scents, restocks, and the occasional dispatch from the studio. One letter a month, never
								more.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col sm:flex-row sm:items-center gap-3 sm:gap-0"
							>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 border-b border-foreground/30 bg-transparent px-1 text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="h-12 shrink-0 sm:ml-4 px-7 rounded-full bg-foreground text-background text-[12px] uppercase tracking-[0.22em] transition-colors hover:bg-foreground/85 disabled:opacity-50"
								>
									{isPending ? "Sending…" : "Subscribe"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-[var(--terracotta)]">{state.error}</p>}
							<p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-foreground/40">
								By subscribing you agree to our gentle terms.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
