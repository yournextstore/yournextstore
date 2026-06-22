"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-cream-grain">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] rounded-sm overflow-hidden border hairline">
					{/* Left: deep forest panel */}
					<div className="bg-forest-warm text-[var(--cream)] p-10 sm:p-14 lg:p-16 relative overflow-hidden">
						<svg
							aria-hidden="true"
							viewBox="0 0 200 200"
							className="absolute -right-10 -bottom-16 w-80 h-80 text-[var(--cream)]/6"
						>
							<title>Decorative</title>
							<circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.6" />
							<circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="0.6" />
							<circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" strokeWidth="0.6" />
							<circle cx="100" cy="100" r="24" fill="none" stroke="currentColor" strokeWidth="0.6" />
						</svg>
						{state?.success ? (
							<div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border hairline-light">
									<CheckIcon className="h-5 w-5" />
								</div>
								<p className="eyebrow text-[var(--cream)]/60 mb-4">In the loop</p>
								<h2 className="font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
									You&apos;re on the list.
								</h2>
								<p className="mt-5 text-[var(--cream)]/70 leading-relaxed max-w-md">{state.message}</p>
							</div>
						) : (
							<div className="relative">
								<p className="eyebrow text-[var(--cream)]/60 mb-5">Stay close</p>
								<h2 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.02] tracking-tight">
									In the loop —
									<br />
									<span className="font-display italic text-[var(--clay)]">for our latest</span>
								</h2>
								<p className="mt-6 max-w-md leading-relaxed text-[var(--cream)]/70">
									New arrivals, private trade events, and the occasional letter from the workshop. No more
									than once a month.
								</p>
								<form action={action} className="mt-10 max-w-md">
									<div className="flex items-center gap-0 rounded-sm border hairline-light bg-[var(--cream)]/5 backdrop-blur-sm focus-within:border-[var(--cream)]/50 transition-colors">
										<input
											type="email"
											name="email"
											placeholder="your@email.com"
											required
											className="h-12 w-full bg-transparent px-5 text-[var(--cream)] outline-none placeholder:text-[var(--cream)]/35"
										/>
										<button
											type="submit"
											disabled={isPending}
											className="h-12 shrink-0 inline-flex items-center gap-2 px-6 bg-[var(--cream)] text-[var(--forest)] text-[0.78rem] tracking-[0.16em] uppercase hover:bg-background transition-colors disabled:opacity-50"
										>
											{isPending ? "Subscribing…" : "Subscribe"}
											{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
										</button>
									</div>
									{state?.error && <p className="mt-4 text-sm text-red-200/90">{state.error}</p>}
									<p className="mt-5 text-xs tracking-wide text-[var(--cream)]/45">
										By subscribing you agree to receive marketing emails from Your Next Store.
									</p>
								</form>
							</div>
						)}
					</div>

					{/* Right: warm interior image */}
					<div className="relative aspect-[4/3] lg:aspect-auto bg-[var(--cream-deep)] min-h-[320px]">
						<Image
							src="/scraped-5.jpg"
							alt="Warm interior styling with woven baskets and ceramics"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute bottom-5 right-5 font-display italic text-sm text-background bg-foreground/40 backdrop-blur-md px-3 py-1.5 rounded-sm">
							Styled at Atelier Nord — Issue 04
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
