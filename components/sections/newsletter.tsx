"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-[#f8a98a] overflow-hidden">
			<div aria-hidden="true" className="absolute inset-0 opacity-25 bg-confetti pointer-events-none" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#fcefa8] text-[#e8456a] border-2 border-[#3a4a8c]/15 shadow-pop">
								<CheckIcon className="h-7 w-7" />
							</div>
							<h2 className="font-heading font-black text-3xl sm:text-4xl text-[#3a4a8c] tracking-tight">
								You&apos;re on the list!
							</h2>
							<p className="mt-3 text-[#3a4a8c]/80">{state.message}</p>
						</div>
					) : (
						<>
							<span className="inline-block rounded-full bg-white/85 text-[#e8456a] px-4 py-1.5 text-[11px] tracking-[0.22em] font-bold uppercase shadow-pop">
								Get 10% Off
							</span>
							<h2 className="mt-5 font-heading font-black text-3xl sm:text-5xl text-[#3a4a8c] leading-[1.05] tracking-tight">
								Cookies in your inbox.
								<br />
								<span className="font-display text-[#e8456a]">No crumbs.</span>
							</h2>
							<p className="mt-5 text-base sm:text-lg leading-relaxed text-[#3a4a8c]/80 max-w-md mx-auto">
								Be first to hear about new flavors, recipe drops, and the rare free-shipping weekend.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-14 w-full flex-1 rounded-full border-2 border-[#3a4a8c]/15 bg-[#fcefa8] px-6 text-[#3a4a8c] outline-none transition-all placeholder:text-[#3a4a8c]/40 focus:border-[#e8456a] focus:ring-4 focus:ring-[#e8456a]/20 font-medium"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-[#e8456a] px-8 text-xs tracking-[0.22em] font-extrabold uppercase text-[#fcefa8] shadow-sticker transition-all hover:-translate-y-0.5 disabled:opacity-50"
								>
									{isPending ? "Sending…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm font-medium text-[#e8456a]">{state.error}</p>}
							<p className="mt-6 text-xs uppercase tracking-[0.18em] text-[#3a4a8c]/60">
								By signing up you agree to receive sweet email. Unsub anytime.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
