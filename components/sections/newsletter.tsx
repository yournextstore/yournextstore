"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden" style={{ backgroundColor: "#1A1A1A", color: "#F4F1EC" }}>
			<div
				aria-hidden
				className="absolute inset-0 opacity-30"
				style={{
					background:
						"radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201, 122, 43, 0.5), transparent 60%), radial-gradient(ellipse 50% 70% at 10% 20%, rgba(212, 165, 116, 0.25), transparent 60%)",
				}}
			/>
			<div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
				<div className="grid grid-cols-12 gap-6 lg:gap-12 items-center">
					<div className="col-span-12 lg:col-span-7">
						<div className="flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-paper/60 mb-6">
							<span className="block h-px w-10 bg-paper/40" />
							<span>The Dispatch</span>
						</div>
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-paper/30">
									<CheckIcon className="h-5 w-5" />
								</div>
								<h2 className="display-italic text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] leading-[0.95]">
									Welcomed.
								</h2>
								<p className="mt-5 max-w-md text-paper/65 leading-relaxed">{state.message}</p>
							</div>
						) : (
							<>
								<h2 className="display-italic text-5xl sm:text-6xl lg:text-7xl tracking-[-0.02em] leading-[0.95]">
									Letters from the
									<br />
									<span style={{ color: "#d4a574" }}>workshop</span>.
								</h2>
								<p className="mt-5 max-w-md text-paper/65 text-base leading-relaxed">
									A quarterly dispatch — new objects, archive openings, and notes from the studios that still
									bend wood by hand.
								</p>
							</>
						)}
					</div>
					<div className="col-span-12 lg:col-span-5">
						{!state?.success && (
							<form action={action} className="space-y-4">
								<label className="block text-[11px] tracking-[0.22em] uppercase text-paper/50 mb-2">
									Subscribe
								</label>
								<div className="flex gap-0 border-b border-paper/30 focus-within:border-paper transition-colors">
									<input
										type="email"
										name="email"
										placeholder="your.address@studio"
										required
										className="flex-1 h-12 bg-transparent text-paper text-base placeholder:text-paper/30 outline-none"
										style={{ color: "#F4F1EC" }}
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 px-6 text-[11px] tracking-[0.22em] uppercase text-paper hover:text-ember transition-colors disabled:opacity-50"
										style={{ color: isPending ? "rgba(244,241,236,0.5)" : undefined }}
									>
										{isPending ? "Sending" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
									</button>
								</div>
								{state?.error && (
									<p className="text-sm" style={{ color: "#e57373" }}>
										{state.error}
									</p>
								)}
								<p className="text-[11px] tracking-[0.18em] uppercase text-paper/40 pt-2">
									Four letters per year. No more.
								</p>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
