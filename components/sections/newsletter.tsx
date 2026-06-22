"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-background">
			<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
				<div className="relative mx-auto max-w-3xl text-center">
					<div
						aria-hidden="true"
						className="absolute -inset-x-10 -top-10 -bottom-10 -z-10 opacity-30 mix-blend-multiply"
						style={{
							backgroundImage: "radial-gradient(circle, #0a0a0a 1.2px, transparent 1.4px)",
							backgroundSize: "18px 18px",
							maskImage: "radial-gradient(ellipse, black 0%, transparent 60%)",
							WebkitMaskImage: "radial-gradient(ellipse, black 0%, transparent 60%)",
						}}
					/>
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-zap">
								<CheckIcon className="h-7 w-7 text-foreground" />
							</div>
							<h2 className="font-display text-4xl uppercase tracking-tight sm:text-5xl">You&apos;re in.</h2>
							<p className="mt-3 text-muted-foreground">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/60">
								The Drop List
							</p>
							<h2 className="mt-3 font-display text-5xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
								Get first
								<br />
								<span className="text-foreground">dibs.</span>
							</h2>
							<p className="mx-auto mt-6 max-w-md text-base text-muted-foreground">
								New flavors, restocks, and sweeps drops — straight to your inbox before anyone else.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border-2 border-foreground bg-background px-5 text-sm text-foreground outline-none transition-all placeholder:text-foreground/40 focus:border-foreground focus:ring-4 focus:ring-zap/50"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-7 text-xs font-semibold uppercase tracking-[0.18em] text-background transition-all hover:bg-foreground/85 disabled:opacity-50"
								>
									{isPending ? "Joining…" : "Sign Me Up"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
