"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative isolate overflow-hidden bg-[--ink]">
			<Image
				src="/scraped-2.jpg"
				alt=""
				fill
				sizes="100vw"
				className="object-cover opacity-50"
				priority={false}
			/>
			<div className="absolute inset-0 bg-gradient-to-r from-[--ink] via-[--ink]/80 to-[--ink]/40" />
			<div className="absolute inset-0 bg-gradient-to-t from-[--ink]/90 via-transparent to-[--ink]/30" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="max-w-xl text-white">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="display-section text-3xl sm:text-4xl tracking-tight">
								You&apos;re on the list.
							</h2>
							<p className="mt-3 text-white/70">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] uppercase tracking-[0.22em] text-[--clay] font-semibold mb-4">
								Join the movement
							</p>
							<h2 className="display-section text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight">
								First access. Free shipping. New fits.
							</h2>
							<p className="mt-5 text-white/80 leading-relaxed max-w-md">
								Sign up for emails and unlock 10% off your first order, plus early looks at every new drop.
							</p>
							<form action={action} className="mt-9 flex flex-col gap-3 sm:flex-row max-w-lg">
								<input
									type="email"
									name="email"
									placeholder="Enter your email"
									required
									className="h-12 w-full flex-1 border border-white/30 bg-white/5 px-4 text-white outline-none transition-all placeholder:text-white/40 focus:border-white focus:bg-white/10"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-white px-8 text-xs uppercase tracking-[0.18em] font-semibold text-[--ink] transition-all hover:bg-[--bone] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Sign Me Up"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
							<p className="mt-4 text-xs text-white/50">
								By signing up you agree to our Terms & Privacy Policy.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
