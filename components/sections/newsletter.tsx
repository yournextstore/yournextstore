"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-background border-t border-border/70">
			<div className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
				<div className="grid lg:grid-cols-12 gap-8 items-end">
					<div className="lg:col-span-6">
						<p className="uppercase-display text-[10.5px] tracking-[0.24em] text-muted-foreground">
							Field Notes
						</p>
						<h2 className="mt-3 uppercase-display text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-[1.05]">
							Letters from the laboratory.
						</h2>
						<p className="mt-5 max-w-md text-foreground/70 leading-relaxed">
							Quarterly dispatches on new formulations, ingredient deep-dives, and limited drops. No noise.
							Unsubscribe in one click.
						</p>
					</div>

					<div className="lg:col-span-6">
						{state?.success ? (
							<div className="flex items-center gap-3 border-b border-foreground pb-3">
								<CheckIcon className="size-5 text-foreground" />
								<p className="text-foreground">{state.message}</p>
							</div>
						) : (
							<form action={action} className="flex items-center gap-3 border-b border-foreground pb-3">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="flex-1 bg-transparent text-foreground placeholder:text-foreground/40 outline-none text-base py-2"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="uppercase-display text-[11px] tracking-[0.22em] text-foreground hover:text-foreground/60 transition-colors disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe →"}
								</button>
							</form>
						)}
						{state?.error && <p className="mt-3 text-sm text-red-700">{state.error}</p>}
						<p className="mt-4 text-[11px] text-muted-foreground leading-relaxed max-w-md">
							By signing up you agree to our privacy policy. We won&apos;t share your email.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
