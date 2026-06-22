"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-background border-t border-border/60">
			<div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div>
						<p className="font-eyebrow text-[10px] text-muted-foreground mb-5">— Correspondence —</p>
						<h2 className="font-serif font-light text-foreground text-[40px] sm:text-[56px] tracking-tight leading-[0.98]">
							Letters from
							<br />
							<em className="not-italic italic text-foreground/70">the studio.</em>
						</h2>
					</div>
					<div>
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
								<div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/30">
									<CheckIcon className="h-4 w-4" />
								</div>
								<p className="font-serif text-[26px] font-light tracking-tight text-foreground">
									You&apos;re on the list.
								</p>
								<p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
							</div>
						) : (
							<>
								<p className="text-[15px] leading-[1.75] text-foreground/80 mb-8 max-w-md">
									A quiet, occasional letter — capsule releases, the journal, and 15% off your first order
									with us.
								</p>
								<form action={action} className="relative">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="w-full h-12 bg-transparent border-0 border-b border-foreground/40 text-foreground px-0 pr-32 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="absolute right-0 top-0 h-12 font-eyebrow text-[11px] text-foreground editorial-underline disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe →"}
									</button>
								</form>
								{state?.error && <p className="mt-3 text-xs text-destructive">{state.error}</p>}
								<p className="mt-5 text-[11px] text-muted-foreground/80">
									By subscribing you agree to receive marketing emails. Unsubscribe at any time.
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
