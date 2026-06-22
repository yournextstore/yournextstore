"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section
			className="relative border-y border-foreground/10 parchment-noise overflow-hidden"
			style={{ backgroundColor: "#f5efe4" }}
		>
			<div className="grid lg:grid-cols-12 gap-0">
				<div className="lg:col-span-7 px-6 sm:px-10 lg:px-14 py-20 lg:py-28 border-b lg:border-b-0 lg:border-r border-foreground/10">
					{state?.success ? (
						<div className="max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-8 flex h-10 w-10 items-center justify-center border border-ink/30">
								<CheckIcon className="h-4 w-4" strokeWidth={1.25} />
							</div>
							<h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-ink">
								Filed under <span className="italic">subscribers</span>.
							</h2>
							<p className="mt-5 font-mono text-[0.8rem] leading-relaxed text-taupe">{state.message}</p>
						</div>
					) : (
						<div className="max-w-lg">
							<p className="eyebrow text-taupe mb-6">Field journal — issue №07</p>
							<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.02] text-ink">
								The journal,
								<br />
								<span className="italic text-umber/85">delivered cold.</span>
							</h2>
							<p className="mt-6 font-mono text-[0.82rem] leading-relaxed text-taupe max-w-md">
								Monthly dispatches from the lab and the field — new actives, case studies, and quiet drops,
								before they reach the catalogue.
							</p>
							<form action={action} className="mt-10">
								<div className="flex flex-col sm:flex-row sm:items-stretch border-t border-b border-ink/30">
									<input
										type="email"
										name="email"
										placeholder="YOUR.EMAIL@EXAMPLE.COM"
										required
										className="flex-1 bg-transparent py-4 px-1 font-mono text-[0.78rem] tracking-[0.18em] uppercase text-ink placeholder:text-taupe/55 focus:outline-none"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex items-center justify-center gap-3 py-4 sm:py-0 sm:pl-6 sm:border-l border-ink/30 font-mono text-[0.7rem] tracking-[0.32em] uppercase text-ink hover:text-umber transition-colors disabled:opacity-50"
									>
										{isPending ? "Filing…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={1.25} />}
									</button>
								</div>
								{state?.error && (
									<p className="mt-4 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-destructive">
										{state.error}
									</p>
								)}
								<p className="mt-5 font-mono text-[0.6rem] tracking-[0.25em] uppercase text-taupe/65">
									No spam. Unsubscribe in one click. We never share addresses.
								</p>
							</form>
						</div>
					)}
				</div>

				<aside className="lg:col-span-5 px-6 sm:px-10 lg:px-14 py-16 lg:py-28">
					<p className="eyebrow text-taupe mb-6">In this issue</p>
					<ul className="space-y-5">
						{[
							{ n: "01", t: "Notes on Spirulina platensis NB-71" },
							{ n: "02", t: "Why men's sebum runs at 0.61 µg/cm²·h" },
							{ n: "03", t: "Cold-chain logistics, in three diagrams" },
							{ n: "04", t: "A drop from the archive — restocked Friday" },
						].map((row) => (
							<li key={row.n} className="flex items-baseline gap-5 pb-4 border-b border-foreground/10">
								<span className="font-mono text-[0.6rem] tracking-[0.28em] uppercase text-taupe/70">
									{row.n}
								</span>
								<span className="font-serif text-lg lg:text-xl text-ink leading-snug">{row.t}</span>
							</li>
						))}
					</ul>
				</aside>
			</div>
		</section>
	);
}
