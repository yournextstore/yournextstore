"use client";

import { ArrowRightIcon, CheckIcon, SparklesIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative overflow-hidden bg-mesh-pastel py-20 sm:py-24">
			{/* floating swatches */}
			<span
				aria-hidden
				className="absolute -top-10 -left-10 h-44 w-44 rounded-full blur-3xl"
				style={{ background: "rgba(180,164,221,0.55)" }}
			/>
			<span
				aria-hidden
				className="absolute bottom-0 right-0 h-56 w-56 rounded-full blur-3xl"
				style={{ background: "rgba(242,193,74,0.4)" }}
			/>
			<div className="relative max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#5e3ca8] text-white">
							<CheckIcon className="h-6 w-6" />
						</div>
						<h2 className="font-display text-[40px] sm:text-[56px] leading-[1] tracking-[-0.025em] text-[#14111c]">
							You&rsquo;re on the list.
						</h2>
						<p className="mt-4 text-[15px] text-[#14111c]/70">{state.message}</p>
					</div>
				) : (
					<>
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-[#5e3ca8] text-[11px] font-semibold uppercase tracking-[0.18em]">
							<SparklesIcon className="h-3 w-3" />
							New shades drop soon
						</span>
						<h2 className="mt-4 font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.03em] text-[#14111c]">
							Save 10% — sip first,
							<br />
							<span className="italic text-[#5e3ca8]">tell us where to send it.</span>
						</h2>
						<p className="mt-5 text-[15px] leading-relaxed text-[#14111c]/65 max-w-md mx-auto">
							Join the inner circle for early access to new shades, bundle drops, and the occasional
							behind-the-scenes letter.
						</p>
						<form
							action={action}
							className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:rounded-full sm:bg-white sm:p-1.5 sm:shadow-[0_20px_60px_-30px_rgba(94,60,168,0.5)]"
						>
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 rounded-full sm:rounded-full border-0 sm:border-transparent bg-white sm:bg-transparent px-5 text-[14.5px] text-[#14111c] outline-none placeholder:text-[#14111c]/40 focus:ring-2 focus:ring-[#5e3ca8]/30"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#5e3ca8] px-7 text-[14px] font-semibold text-white transition-all hover:bg-[#4e2f95] disabled:opacity-50"
							>
								{isPending ? "Subscribing…" : "Get my 10% off"}
								{!isPending && <ArrowRightIcon className="h-4 w-4" />}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-[#a63333]">{state.error}</p>}
						<p className="mt-4 text-[12px] text-[#14111c]/45">No spam. Unsubscribe in one click.</p>
					</>
				)}
			</div>
		</section>
	);
}
