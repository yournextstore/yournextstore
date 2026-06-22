"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative border-t border-border/60 bg-foreground text-background overflow-hidden">
			{/* faint amber wash bottom-right */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -right-32 -bottom-32 h-[420px] w-[420px] rounded-full"
				style={{
					background: "radial-gradient(circle, oklch(0.78 0.155 60 / 0.35), transparent 60%)",
				}}
			/>

			<div className="relative mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-32">
				<div className="grid grid-cols-12 gap-6 lg:gap-10">
					<div className="col-span-12 lg:col-span-6">
						<p className="text-[11px] tracking-[0.22em] uppercase text-background/50">
							(04) — Correspondence
						</p>
						<h2 className="mt-6 font-serif text-5xl lg:text-7xl leading-[0.95] tracking-[-0.03em]">
							Letters
							<br />
							<span className="italic text-amber-accent">from</span> the studio.
						</h2>
						<p className="mt-6 max-w-md text-[15px] leading-relaxed text-background/60">
							One thoughtful letter every fortnight — workshop notes, new editions, and the occasional
							meditation on light and grain. No noise, no urgency.
						</p>
					</div>

					<div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-6">
						{state?.success ? (
							<div className="drift-in">
								<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-accent text-foreground">
									<CheckIcon className="h-5 w-5" />
								</div>
								<h3 className="font-serif text-3xl italic">You&apos;re on the list.</h3>
								<p className="mt-3 text-background/60">{state.message}</p>
							</div>
						) : (
							<form action={action} className="space-y-5">
								<label className="block">
									<span className="text-[11px] tracking-[0.22em] uppercase text-background/50">
										Your name (optional)
									</span>
									<input
										type="text"
										name="name"
										placeholder="Jane Holt"
										className="mt-3 h-11 w-full border-b border-background/30 bg-transparent px-0 text-[15px] text-background outline-none transition-colors placeholder:text-background/30 focus:border-amber-accent"
									/>
								</label>
								<label className="block">
									<span className="text-[11px] tracking-[0.22em] uppercase text-background/50">
										Email address
									</span>
									<input
										type="email"
										name="email"
										placeholder="jane@studio.dk"
										required
										className="mt-3 h-11 w-full border-b border-background/30 bg-transparent px-0 text-[15px] text-background outline-none transition-colors placeholder:text-background/30 focus:border-amber-accent"
									/>
								</label>
								<button
									type="submit"
									disabled={isPending}
									className="mt-4 inline-flex h-12 items-center gap-3 border border-background/40 px-7 text-[12px] tracking-[0.22em] uppercase text-background transition-all hover:bg-amber-accent hover:text-foreground hover:border-amber-accent disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe to the letter"}
									<span aria-hidden="true">→</span>
								</button>
								{state?.error && <p className="text-sm text-amber-accent">{state.error}</p>}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
