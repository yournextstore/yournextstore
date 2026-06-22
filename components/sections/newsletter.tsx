"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

const FAQS = [
	{
		q: "How do I prepare a frozen PB&J?",
		a: "Toast for 90 seconds, microwave for 30 seconds, or let it thaw in your lunchbox for an hour. The bread stays soft, the jelly stays jammy.",
	},
	{
		q: "What makes the jelly different?",
		a: "We cook real strawberries and berries low and slow with just cane sugar — no high-fructose corn syrup, no artificial color, no shortcuts.",
	},
	{
		q: "Are these school-safe?",
		a: "Yes — peanut-butter forward, but we're working on a sun-butter version. Sign up below to be first in line.",
	},
	{
		q: "Where can I buy them?",
		a: "We're in 12,000+ freezer aisles nationwide including Target, Walmart, Whole Foods, Kroger, Publix, and Sprouts. Use the store locator up top.",
	},
];

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<>
			<section className="bg-[#fff7f0]">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
					<div className="text-center">
						<span className="inline-block bg-[#ffe9ec] text-[#c8132b] text-[11px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
							Frequently asked
						</span>
						<h2 className="font-display uppercase text-4xl sm:text-6xl mt-5 text-[#1a0810] leading-[0.9]">
							Questions
						</h2>
					</div>

					<dl className="mt-12 space-y-3">
						{FAQS.map((faq, i) => (
							<details
								key={faq.q}
								className="group bg-white rounded-full open:rounded-[28px] border border-[#f7d4d9] overflow-hidden transition-all"
								open={i === 0}
							>
								<summary className="flex items-center justify-between gap-4 cursor-pointer px-6 sm:px-8 py-5 list-none">
									<span className="font-display uppercase text-sm sm:text-base text-[#1a0810] tracking-tight">
										{faq.q}
									</span>
									<span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffe9ec] text-[#c8132b] text-xl font-bold transition-transform group-open:rotate-45">
										+
									</span>
								</summary>
								<div className="px-6 sm:px-8 pb-6 text-sm sm:text-base text-[#7a4b53] leading-relaxed">
									{faq.a}
								</div>
							</details>
						))}
					</dl>
				</div>
			</section>

			<section className="relative jam-hero-bg text-white overflow-hidden">
				<div className="absolute inset-0 jam-noise opacity-30 pointer-events-none" aria-hidden />
				<div
					aria-hidden
					className="pointer-events-none absolute left-[5%] top-[20%] w-40 h-14 jam-capsule jam-anim-a"
					style={{ transform: "rotate(-15deg)" }}
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute right-[7%] bottom-[15%] w-48 h-16 jam-capsule jam-anim-b"
					style={{ transform: "rotate(20deg)" }}
				/>

				<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#c8132b]">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="font-display uppercase text-4xl sm:text-6xl leading-[0.95]">You&apos;re in</h2>
							<p className="mt-3 text-white/80">{state.message}</p>
						</div>
					) : (
						<>
							<span className="font-script text-4xl sm:text-5xl text-white/95 -rotate-2 inline-block">
								Your Next Store
							</span>
							<h2 className="font-display uppercase text-4xl sm:text-6xl lg:text-7xl mt-4 leading-[0.9]">
								Get the
								<br />
								<span className="text-white">First Bite</span>
							</h2>
							<p className="mt-5 text-base sm:text-lg text-white/80 max-w-md mx-auto">
								Drops, new flavors, and the occasional freezer-aisle scavenger hunt. No spam, ever.
							</p>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row p-1.5 sm:p-1.5 bg-white rounded-full"
							>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-11 w-full flex-1 rounded-full bg-transparent px-5 text-[#1a0810] outline-none placeholder:text-[#7a4b53]/60"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#c8132b] px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#1a0810] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-white/90">{state.error}</p>}
						</>
					)}
				</div>
			</section>
		</>
	);
}
