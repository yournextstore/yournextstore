"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-foreground text-background">
			{/* Soft warm wash */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none opacity-50"
				style={{
					background:
						"radial-gradient(ellipse 60% 50% at 90% 10%, oklch(0.6 0.18 55 / 0.45), transparent 60%), radial-gradient(ellipse 50% 40% at 5% 90%, oklch(0.55 0.12 70 / 0.4), transparent 70%)",
				}}
			/>
			{/* Dot grid */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none opacity-25"
				style={{
					backgroundImage: "radial-gradient(circle at 1px 1px, oklch(1 0 0 / 0.2) 1px, transparent 0)",
					backgroundSize: "26px 26px",
				}}
			/>

			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
					<div className="lg:col-span-7">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-background/10 mb-6">
									<CheckIcon className="h-5 w-5" />
								</div>
								<h2 className="font-display italic text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
									You're on the list.
								</h2>
								<p className="mt-4 text-background/60 max-w-lg">{state.message}</p>
							</div>
						) : (
							<>
								<p className="editorial-eyebrow text-background/50">The Dispatch · Monthly</p>
								<h2 className="mt-4 font-display italic text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
									Letters from
									<br />
									the studio.
								</h2>
								<p className="mt-6 max-w-md text-sm leading-relaxed text-background/70">
									Slow notes on new pieces, material studies, and the makers behind the catalog. One short
									email each month — never more.
								</p>
							</>
						)}
					</div>

					{!state?.success && (
						<form action={action} className="lg:col-span-5 flex flex-col gap-3">
							<label className="editorial-eyebrow text-background/50">Subscribe</label>
							<div className="relative">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-14 w-full rounded-full border border-background/20 bg-background/5 px-6 pr-40 text-background outline-none transition-all placeholder:text-background/30 focus:border-background/50 focus:bg-background/10"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="absolute right-1.5 top-1.5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-background px-6 text-[0.7rem] uppercase tracking-[0.22em] font-medium text-foreground transition-all hover:bg-background/90 disabled:opacity-50"
								>
									{isPending ? "Sending…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
								</button>
							</div>
							{state?.error && <p className="text-sm text-red-300/90">{state.error}</p>}
							<p className="text-[11px] text-background/40 tracking-wide">
								No promotional spam. Unsubscribe in a click.
							</p>
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
