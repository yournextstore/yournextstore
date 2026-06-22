"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-[#15348f] text-[#f5e4d2] relative overflow-hidden">
			{/* Decorative pattern */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage: `radial-gradient(circle at 1px 1px, rgba(232,181,71,0.5) 1px, transparent 0)`,
					backgroundSize: "32px 32px",
				}}
			/>
			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					<div className="lg:col-span-7">
						<p className="font-script text-[#e8b547] text-2xl sm:text-3xl">notes from the shop</p>
						<h2 className="mt-1 font-display text-4xl sm:text-5xl lg:text-[56px] uppercase leading-[0.98] tracking-wide">
							A small letter,
							<br />
							every other Sunday.
						</h2>
						<p className="mt-5 max-w-md text-[15px] text-[#f5e4d2]/75 leading-relaxed">
							Late afternoon notes — what&apos;s new in the shop, what we&apos;re reading, where to find a
							table by the sea. Never more often than necessary.
						</p>
					</div>

					<div className="lg:col-span-5">
						{state?.success ? (
							<div className="rounded-2xl border border-[#f5e4d2]/20 bg-[#1f46c2]/40 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8b547] text-[#1f46c2]">
										<CheckIcon className="h-5 w-5" />
									</div>
									<p className="font-display text-2xl">You&apos;re on the list</p>
								</div>
								<p className="mt-3 text-sm text-[#f5e4d2]/70">{state.message}</p>
							</div>
						) : (
							<form action={action} className="flex flex-col gap-3">
								<label className="block text-[11px] uppercase tracking-[0.22em] text-[#f5e4d2]/70">
									Sign up
								</label>
								<div className="flex flex-col sm:flex-row gap-3">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full flex-1 rounded-full border border-[#f5e4d2]/30 bg-[#1f46c2]/40 px-5 text-[#f5e4d2] outline-none transition-all placeholder:text-[#f5e4d2]/40 focus:border-[#e8b547] focus:ring-2 focus:ring-[#e8b547]/30"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#e8b547] px-7 uppercase tracking-[0.22em] text-[11px] font-medium text-[#1f46c2] transition-all hover:bg-[#f5e4d2] disabled:opacity-50"
									>
										{isPending ? "Sending…" : "Subscribe"}
										{!isPending && <ArrowRightIcon className="h-4 w-4" />}
									</button>
								</div>
								<p className="text-[11px] text-[#f5e4d2]/50">
									We won&apos;t share your email. Unsubscribe whenever.
								</p>
								{state?.error && <p className="text-sm text-[#e8b547]">{state.error}</p>}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
