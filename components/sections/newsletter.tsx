"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section
			className="relative overflow-hidden text-cream"
			style={{
				background:
					"radial-gradient(ellipse at 20% 30%, rgba(216,201,224,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(155,143,184,0.4) 0%, transparent 55%), linear-gradient(135deg, #4A3F58 0%, #2B2530 100%)",
				color: "#F5F1EC",
			}}
		>
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-32">
				<div className="text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div
								className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full"
								style={{ backgroundColor: "rgba(245,241,236,0.12)" }}
							>
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-serif text-3xl sm:text-4xl tracking-tight">You&apos;re on the list</h2>
							<p className="mt-3 text-cream/70" style={{ color: "rgba(245,241,236,0.7)" }}>
								{state.message}
							</p>
						</div>
					) : (
						<>
							<p
								className="text-[10px] sm:text-[11px] font-medium tracking-[0.32em] uppercase"
								style={{ color: "rgba(245,241,236,0.7)" }}
							>
								Join the Ritual
							</p>
							<h2 className="font-serif mt-4 text-[2.1rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.05] tracking-tight">
								Soft moments, sent <span className="italic">straight to you</span>
							</h2>
							<p
								className="mt-5 text-base sm:text-lg leading-relaxed max-w-lg mx-auto"
								style={{ color: "rgba(245,241,236,0.7)" }}
							>
								Affirmations, gentle routines, and first dibs on new arrivals — once a month, never more.
							</p>
							<form action={action} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 border bg-transparent px-5 outline-none transition-all"
									style={{
										color: "#F5F1EC",
										borderColor: "rgba(245,241,236,0.35)",
									}}
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.22em] uppercase transition-all disabled:opacity-50"
									style={{
										backgroundColor: "#F5F1EC",
										color: "#2B2530",
									}}
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
								</button>
							</form>
							{state?.error && (
								<p className="mt-4 text-sm" style={{ color: "#f4b3b3" }}>
									{state.error}
								</p>
							)}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
