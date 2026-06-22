"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-brand-coral text-white">
			<div aria-hidden className="absolute inset-0 bg-confetti opacity-50 pointer-events-none" />
			<svg
				aria-hidden
				viewBox="0 0 200 200"
				className="absolute -bottom-12 -left-12 h-56 w-56 text-brand-mustard/40"
			>
				<title>blob</title>
				<path
					fill="currentColor"
					d="M48.2,-58.7C61.2,-50.6,69.4,-34.1,71.3,-17.4C73.2,-0.6,68.8,16.4,59.4,29.2C50,42,35.6,50.6,20.3,57.4C5,64.2,-11.2,69.1,-25,64.6C-38.8,60.1,-50.2,46.1,-57.5,30.9C-64.8,15.6,-67.9,-0.9,-63.4,-15C-58.9,-29.1,-46.7,-40.7,-33.5,-49.1C-20.2,-57.4,-5.8,-62.5,8.7,-63.5C23.2,-64.5,46.4,-61.4,48.2,-58.7Z"
					transform="translate(100 100)"
				/>
			</svg>
			<svg
				aria-hidden
				viewBox="0 0 200 200"
				className="absolute -top-16 -right-10 h-64 w-64 text-brand-green/40"
			>
				<title>blob</title>
				<path
					fill="currentColor"
					d="M40,-49.4C53.8,-43.2,68.6,-35.3,72,-23.1C75.5,-10.9,67.5,5.6,59.6,21.1C51.7,36.6,43.9,51,30.7,58.6C17.5,66.2,-1.1,67,-17.9,61.5C-34.6,56,-49.6,44.1,-57.2,29.1C-64.7,14.1,-64.9,-3.9,-58.1,-17.7C-51.4,-31.5,-37.7,-41.2,-23.7,-48.5C-9.6,-55.7,4.7,-60.5,18.5,-58.4C32.4,-56.4,45.7,-47.7,40,-49.4Z"
					transform="translate(100 100)"
				/>
			</svg>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-coral">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl tracking-tight">You&apos;re in.</h2>
							<p className="mt-3 text-white/85">{state.message}</p>
						</div>
					) : (
						<>
							<span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
								The Sweet List
							</span>
							<h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight">
								Get 15% off your first box.
							</h2>
							<p className="mt-4 text-lg leading-relaxed text-white/85 max-w-md mx-auto">
								New flavors, behind-the-scenes peeks, and the occasional snack secret — straight to your
								inbox.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-white/25 bg-white/10 px-5 text-white outline-none transition-all placeholder:text-white/60 focus:border-white/60 focus:bg-white/15 focus:ring-2 focus:ring-white/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-ink px-8 font-semibold text-white transition-all hover:bg-black disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Get my discount"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-white/90">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
