"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { Leaf } from "./leaves";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-cream-paper">
			<div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hidden sm:block">
				<Leaf className="w-20 h-32 -rotate-12 leaf-sway" color="#2e7d3a" />
			</div>
			<div className="absolute left-24 top-1/3 opacity-70 hidden sm:block">
				<Leaf className="w-12 h-20 rotate-45" color="#0f3d2e" />
			</div>
			<div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-80 hidden sm:block">
				<Leaf className="w-20 h-32 rotate-12 leaf-sway-slow" color="#2e7d3a" />
			</div>
			<div className="absolute right-28 bottom-10 opacity-70 hidden sm:block">
				<Leaf className="w-14 h-20 -rotate-12" color="#0f3d2e" />
			</div>

			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream">
							<CheckIcon className="h-7 w-7" />
						</div>
						<h2 className="font-display uppercase text-4xl sm:text-5xl text-forest">
							You&apos;re on the list
						</h2>
						<p className="mt-3 text-forest/70">{state.message}</p>
					</div>
				) : (
					<>
						<p className="font-display uppercase tracking-[0.32em] text-leaf text-sm">Stay leafy</p>
						<h2 className="font-display uppercase text-forest text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[0.95]">
							Get the good stuff in your inbox
						</h2>
						<p className="mx-auto mt-5 max-w-lg text-forest/70 leading-relaxed">
							New flavors, recipes, and the occasional discount code — sent only when there&apos;s something
							worth saying.
						</p>
						<form action={action} className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-14 w-full flex-1 rounded-full border-2 border-forest/20 bg-[var(--cream-deep)]/60 px-6 text-forest outline-none transition-all placeholder:text-forest/40 focus:border-forest focus:ring-4 focus:ring-leaf/20"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-forest px-8 font-display uppercase tracking-[0.2em] text-sm text-cream transition-all hover:bg-leaf disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Subscribe"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-tomato">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
