"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-foreground text-background">
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none opacity-30"
				style={{
					background:
						"radial-gradient(ellipse 50% 60% at 15% 80%, oklch(0.71 0.165 50 / 0.4), transparent 70%), radial-gradient(ellipse 60% 70% at 85% 20%, oklch(0.46 0.085 50 / 0.5), transparent 70%)",
				}}
			/>
			<div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-24 sm:py-32">
				<div className="grid grid-cols-12 gap-6 items-center">
					<div className="col-span-12 md:col-span-7">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-background/10">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="font-editorial italic font-light text-5xl md:text-6xl tracking-tight leading-[0.95]">
									You&apos;re on the list.
								</h2>
								<p className="mt-4 font-grotesk text-sm text-background/60">{state.message}</p>
							</div>
						) : (
							<>
								<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-background/50 mb-6 flex items-center gap-3">
									<span aria-hidden className="block h-px w-8 bg-background/50" />
									<span className="text-accent">(</span>
									<span className="px-1">the dispatch</span>
									<span className="text-accent">)</span>
								</div>
								<h2 className="font-editorial italic font-light text-5xl md:text-6xl tracking-tight leading-[0.95]">
									Letters from
									<br />
									<span className="not-italic font-normal">the studio.</span>
								</h2>
								<p className="mt-6 font-grotesk text-sm leading-relaxed text-background/60 max-w-md">
									Six pieces a year, slowly written. Archive openings, new editions, and the occasional studio
									visit — never marketing.
								</p>
							</>
						)}
					</div>

					{!state?.success && (
						<div className="col-span-12 md:col-span-5">
							<form action={action} className="flex flex-col gap-4">
								<label
									htmlFor="newsletter-email"
									className="font-grotesk text-[10px] uppercase tracking-eyebrow text-background/50"
								>
									your address
								</label>
								<input
									id="newsletter-email"
									type="email"
									name="email"
									placeholder="name@studio.com"
									required
									className="h-12 w-full border-b border-background/30 bg-transparent px-0 font-editorial italic text-lg text-background placeholder:text-background/30 outline-none transition-all focus:border-accent"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="mt-2 inline-flex h-12 w-fit items-center gap-3 rounded-full bg-background px-7 font-grotesk text-[11px] uppercase tracking-eyebrow text-foreground transition-all hover:bg-accent hover:text-background disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe to dispatch"}
									{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
								</button>
								{state?.error && <p className="font-grotesk text-sm text-accent">{state.error}</p>}
							</form>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
