"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section
			className="relative isolate overflow-hidden text-mahogany"
			style={{
				backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #ffe39a 0%, #f2a516 50%, #e87211 100%)",
			}}
		>
			<svg
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 mix-blend-overlay opacity-40"
				preserveAspectRatio="none"
				viewBox="0 0 1440 400"
			>
				<defs>
					<radialGradient id="nl-glow" cx="50%" cy="0%" r="60%">
						<stop offset="0%" stopColor="#fffaee" stopOpacity="0.8" />
						<stop offset="100%" stopColor="#fffaee" stopOpacity="0" />
					</radialGradient>
				</defs>
				<ellipse cx="720" cy="0" rx="700" ry="200" fill="url(#nl-glow)" />
			</svg>
			<div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-mahogany text-honey">
							<CheckIcon className="h-6 w-6" />
						</div>
						<h2
							className="font-display text-4xl font-medium tracking-tight sm:text-5xl"
							style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
						>
							you&apos;re on the list.
						</h2>
						<p className="font-mono mt-4 text-sm uppercase tracking-[0.2em] text-mahogany/70">
							{state.message}
						</p>
					</div>
				) : (
					<>
						<p className="font-mono mb-5 text-[11px] uppercase tracking-[0.3em] text-mahogany/70">
							/ the substack
						</p>
						<h2
							className="font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
							style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
						>
							recipes, slow letters,
							<br />
							jar drops first.
						</h2>
						<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-2 sm:flex-row">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 border border-mahogany/30 bg-honey/30 px-5 font-mono text-sm text-mahogany placeholder:text-mahogany/40 outline-none transition-all focus:border-mahogany focus:bg-honey/60"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="font-mono inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-mahogany px-8 text-xs uppercase tracking-[0.25em] text-honey transition-all hover:bg-amber-deep disabled:opacity-50"
							>
								{isPending ? "subscribing…" : "subscribe"}
							</button>
						</form>
						<p className="font-mono mt-4 text-[10px] uppercase tracking-[0.3em] text-mahogany/55">
							no spam · unsubscribe any time
						</p>
						{state?.error && <p className="font-mono mt-4 text-sm text-mahogany">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
