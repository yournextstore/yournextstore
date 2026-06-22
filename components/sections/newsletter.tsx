"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section id="find-us" className="relative overflow-hidden bg-[color:#0f2a3f] text-[color:#f6efe2]">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-50"
				style={{
					backgroundImage:
						"radial-gradient(at 15% 50%, rgba(238,122,26,0.22), transparent 50%), radial-gradient(at 85% 80%, rgba(124,31,18,0.30), transparent 55%)",
				}}
			/>

			<div className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
				<div className="mx-auto max-w-2xl text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[color:#ee7a1a]">
								<CheckIcon className="h-7 w-7 text-[color:#fff8ec]" />
							</div>
							<h2 className="font-display text-3xl tracking-tight sm:text-4xl">A toast to you.</h2>
							<p className="mt-3 text-[color:#c9b79b]">{state.message}</p>
						</div>
					) : (
						<>
							<p className="divider-ornament text-[color:#c9b79b]">Letters from the Cellar</p>
							<h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
								Recipes, harvests, and the occasional{" "}
								<span className="italic text-[color:#ee7a1a]">scandal</span>.
							</h2>
							<p className="mt-5 text-base leading-relaxed text-[color:#c9b79b] sm:text-lg">
								One letter a month. Never sold, never spammed. Pour yourself a glass.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-white/20 bg-white/5 px-5 text-[color:#f6efe2] outline-none transition-all placeholder:text-[color:#c9b79b]/60 focus:border-[color:#ee7a1a] focus:ring-2 focus:ring-[color:#ee7a1a]/30"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[color:#ee7a1a] px-8 font-semibold text-[color:#fff8ec] transition-all hover:-translate-y-0.5 hover:bg-[color:#d96a10] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-[color:#f4d03a]">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
