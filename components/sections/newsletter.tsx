"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-foreground text-background border-b-2 border-foreground overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 relative">
				{/* corner sparkles */}
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					className="absolute top-8 right-8 w-10 h-10 text-[#d4ff3a]"
				>
					<title>Sparkle</title>
					<path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" fill="currentColor" />
				</svg>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					className="absolute bottom-8 left-8 w-6 h-6 text-[#e8b7c9]"
				>
					<title>Sparkle</title>
					<path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" fill="currentColor" />
				</svg>

				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border-2 border-[#d4ff3a] bg-[#d4ff3a]/10">
								<CheckIcon className="h-7 w-7 text-[#d4ff3a]" />
							</div>
							<h2 className="font-display uppercase text-3xl sm:text-4xl leading-tight">
								You're on the list
							</h2>
							<p className="mt-3 text-background/60">{state.message}</p>
						</div>
					) : (
						<>
							<div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#d4ff3a] mb-4">
								Members Only · Newsletter
							</div>
							<h2 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl leading-[0.95]">
								Be the first
								<br />
								<span className="text-[#d4ff3a]">to know.</span>
							</h2>
							<p className="mt-4 text-base sm:text-lg leading-relaxed text-background/70 max-w-md mx-auto">
								New drops, restocks and behind-the-scenes from our makers — straight to your inbox. No fluff.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="YOUR@EMAIL.COM"
									required
									className="h-14 w-full flex-1 border-2 border-background bg-transparent px-5 text-background outline-none transition-all placeholder:text-background/40 focus:border-[#d4ff3a] uppercase text-sm tracking-wider"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-14 shrink-0 items-center justify-center gap-2 bg-[#d4ff3a] px-8 font-display tracking-[0.15em] uppercase text-sm text-foreground transition-all hover:bg-background hover:text-foreground disabled:opacity-50 border-2 border-[#d4ff3a]"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
