"use client";

import { ArrowRightIcon, CheckIcon, LeafIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="relative overflow-hidden rounded-[28px] bg-[#0f2412] text-leaf-50 px-6 py-14 sm:px-14 sm:py-20">
					{/* decorative gradient orbs */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full"
						style={{
							background: "radial-gradient(circle, rgba(168, 193, 144, 0.35) 0%, transparent 70%)",
						}}
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full"
						style={{
							background: "radial-gradient(circle, rgba(91, 122, 58, 0.45) 0%, transparent 70%)",
						}}
					/>

					<div className="relative max-w-2xl mx-auto text-center">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-leaf-50/10 ring-1 ring-leaf-50/20">
									<CheckIcon className="h-7 w-7" />
								</div>
								<h2 className="font-display text-3xl sm:text-4xl tracking-tight">You&apos;re on the list</h2>
								<p className="mt-3 text-leaf-50/70">{state.message}</p>
							</div>
						) : (
							<>
								<div className="mx-auto inline-flex items-center gap-2 rounded-full bg-leaf-50/10 px-3 py-1.5 text-xs font-medium ring-1 ring-leaf-50/20">
									<LeafIcon className="h-3.5 w-3.5 text-leaf-300" />
									The Field Notes
								</div>
								<h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-balance">
									Letters from the <span className="italic font-light text-leaf-200">garden</span>
								</h2>
								<p className="mt-5 text-base sm:text-lg leading-relaxed text-leaf-50/70 max-w-md mx-auto text-pretty">
									Seasonal rituals, harvest stories, and quiet early access — once a month, never more.
								</p>
								<form
									action={action}
									className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center"
								>
									<input
										type="email"
										name="email"
										placeholder="you@email.com"
										required
										className="h-12 w-full flex-1 rounded-full border border-leaf-50/20 bg-leaf-50/5 px-5 text-leaf-50 outline-none transition-all placeholder:text-leaf-50/30 focus:border-leaf-300/60 focus:bg-leaf-50/10"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-leaf-50 px-7 font-semibold text-[#0f2412] transition-all hover:bg-white disabled:opacity-50"
									>
										{isPending ? "Subscribing…" : "Subscribe"}
										{!isPending && (
											<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
										)}
									</button>
								</form>
								{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
								<p className="mt-5 text-xs text-leaf-50/45">No spam. Unsubscribe anytime.</p>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
