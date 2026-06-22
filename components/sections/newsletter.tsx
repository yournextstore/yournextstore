"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-hero-lavender overflow-hidden">
			<svg
				className="absolute top-8 left-10 w-28 text-white/55"
				viewBox="0 0 200 100"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M40 70c-16 0-30-12-30-28S24 14 40 14c6 0 12 2 17 5C62 9 71 4 82 4c18 0 32 13 33 31 4-2 9-3 14-3 16 0 28 12 28 28 0 14-10 26-24 28-3 7-10 12-19 12H46c-3 0-5-1-6-3" />
			</svg>
			<svg
				className="absolute bottom-10 right-12 w-32 text-white/45"
				viewBox="0 0 200 100"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M40 70c-16 0-30-12-30-28S24 14 40 14c6 0 12 2 17 5C62 9 71 4 82 4c18 0 32 13 33 31 4-2 9-3 14-3 16 0 28 12 28 28 0 14-10 26-24 28-3 7-10 12-19 12H46c-3 0-5-1-6-3" />
			</svg>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
					<div>
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[var(--cobalt)] text-white mb-5">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="font-display uppercase text-[var(--cobalt)] text-4xl sm:text-5xl leading-[0.95]">
									You&apos;re on the list
								</h2>
								<p className="mt-3 text-[var(--cobalt)]/75 text-lg">{state.message}</p>
							</div>
						) : (
							<>
								<p className="text-[var(--cobalt)] uppercase tracking-[0.25em] text-xs font-semibold mb-3">
									Stay Cozy
								</p>
								<h2 className="font-display uppercase text-[var(--cobalt)] text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
									Snack mail,
									<br />
									freshly baked.
								</h2>
								<p className="mt-5 max-w-md text-[var(--cobalt)]/80 text-lg leading-relaxed">
									New flavors, behind-the-bakery stories, and the occasional early-bird discount. Zero spam,
									pinky promise.
								</p>
								<form
									action={action}
									className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md bg-white rounded-full p-1.5 cloud-shadow"
								>
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-11 flex-1 px-5 rounded-full bg-transparent text-[var(--cobalt)] outline-none placeholder:text-[var(--cobalt)]/40"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--cobalt)] px-6 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--cobalt-light)] disabled:opacity-50"
									>
										{isPending ? "Joining…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</form>
								{state?.error && <p className="mt-4 text-sm text-red-600">{state.error}</p>}
							</>
						)}
					</div>

					<div className="relative aspect-[4/5] max-w-md mx-auto w-full">
						<div className="absolute inset-0 rounded-[40px] overflow-hidden cloud-shadow">
							<Image
								src="/scraped-2.jpg"
								alt="Cozy snack moment"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
