"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-[var(--color-butter)] overflow-hidden border-b-2 border-foreground/10">
			{/* Halftone backdrop */}
			<div className="halftone absolute inset-0 text-foreground" />

			{/* Floating cow doodle */}
			<svg
				aria-hidden
				className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-48 h-48 sm:w-72 sm:h-72 text-foreground/15"
				viewBox="0 0 200 200"
				fill="none"
				stroke="currentColor"
				strokeWidth="3"
			>
				<title>cow doodle</title>
				<ellipse cx="100" cy="120" rx="65" ry="50" fill="currentColor" />
				<ellipse cx="100" cy="120" rx="65" ry="50" />
				<ellipse cx="75" cy="115" rx="8" ry="9" fill="white" />
				<ellipse cx="125" cy="115" rx="8" ry="9" fill="white" />
				<circle cx="75" cy="115" r="3" fill="black" />
				<circle cx="125" cy="115" r="3" fill="black" />
				<ellipse cx="100" cy="140" rx="22" ry="14" fill="#FFE4EC" />
				<circle cx="92" cy="138" r="2" fill="black" />
				<circle cx="108" cy="138" r="2" fill="black" />
			</svg>

			<div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-leaf-deep)] text-white">
							<CheckIcon className="h-7 w-7" />
						</div>
						<h2 className="display text-4xl sm:text-5xl uppercase leading-[0.95]">You&rsquo;re in!</h2>
						<p className="mt-4 text-foreground/70 text-lg">{state.message}</p>
					</div>
				) : (
					<>
						<p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-pink)] mb-4">
							<span className="inline-block w-8 h-px bg-current align-middle mr-3" />
							Happy mail
							<span className="inline-block w-8 h-px bg-current align-middle ml-3" />
						</p>
						<h2 className="display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.92]">
							Be the first to <span className="text-[var(--color-cobalt)] italic">sip</span>
							<br />
							new flavors.
						</h2>
						<p className="mt-6 text-foreground/70 text-lg max-w-xl mx-auto leading-relaxed">
							Get $5 off your first 6-pack when you join the Happy Tummy Club. New drops, recipes, and the
							occasional cow pic.
						</p>
						<form
							action={action}
							className="mt-10 max-w-lg mx-auto flex flex-col sm:flex-row gap-3 bg-white rounded-full p-1.5 border-2 border-foreground/10 shadow-[4px_4px_0_var(--color-espresso)]"
						>
							<input
								type="email"
								name="email"
								required
								placeholder="your@email.com"
								aria-label="Email address"
								className="flex-1 h-11 px-5 rounded-full bg-transparent text-foreground outline-none placeholder:text-foreground/40 font-medium"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="h-11 inline-flex shrink-0 items-center justify-center px-7 bg-[var(--color-espresso)] text-[var(--color-cream)] rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--color-espresso-deep)] transition-colors disabled:opacity-60"
							>
								{isPending ? "Joining…" : "Join the club"}
							</button>
						</form>
						{state?.error && (
							<p className="mt-4 text-sm text-[var(--color-pink)] font-medium">{state.error}</p>
						)}
						<p className="mt-5 text-xs uppercase tracking-widest text-foreground/50">
							No spam, ever. Unsubscribe anytime.
						</p>
					</>
				)}
			</div>
		</section>
	);
}
