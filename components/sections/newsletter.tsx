"use client";

import Image from "next/image";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-skin overflow-hidden">
			<Image
				src="/scraped-1.jpg"
				alt=""
				fill
				sizes="100vw"
				className="object-cover opacity-40 blur-sm scale-110"
				aria-hidden
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-bone/60 via-bone/40 to-bone/70" />

			<div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 py-24 sm:py-36">
				<div className="max-w-xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
							<p className="eyebrow text-rosewood mb-5">— Welcome —</p>
							<h2 className="font-serif text-4xl sm:text-5xl text-ink font-light leading-[1.05]">
								You are on the list.
							</h2>
							<p className="mt-6 font-serif italic text-ink/70 text-lg">{state.message}</p>
						</div>
					) : (
						<>
							<p className="eyebrow text-rosewood mb-5">An Invitation</p>
							<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-light leading-[1.05]">
								Letters from the <span className="italic">atelier.</span>
							</h2>
							<p className="mt-6 font-serif italic text-ink/75 text-lg sm:text-xl leading-relaxed">
								New volumes, private previews, and the occasional unhurried Sunday note. No noise.
							</p>
							<form action={action} className="mt-12 mx-auto max-w-md flex items-end gap-4 text-left">
								<div className="flex-1 relative">
									<label htmlFor="newsletter-email" className="eyebrow text-ink/60 text-[0.6rem]">
										Your Email
									</label>
									<input
										id="newsletter-email"
										type="email"
										name="email"
										placeholder="name@email.com"
										required
										className="mt-2 w-full bg-transparent border-0 border-b border-ink/40 pb-2 text-ink placeholder:text-ink/35 font-serif text-xl focus:outline-none focus:border-ink transition-colors"
									/>
								</div>
								<button
									type="submit"
									disabled={isPending}
									className="shrink-0 pb-2 eyebrow text-ink border-b border-ink hover:text-rosewood hover:border-rosewood transition-colors disabled:opacity-50"
								>
									{isPending ? "Sending…" : "Subscribe"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm font-serif italic text-mahogany">{state.error}</p>}
							<p className="mt-8 eyebrow text-ink/45 text-[0.6rem]">
								By subscribing you agree to our quiet way of writing.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
