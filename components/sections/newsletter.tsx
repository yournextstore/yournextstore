"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

const collageImages = [
	{ src: "/scraped-0.jpg", top: "10%", left: "4%", size: "120px", rot: -8 },
	{ src: "/scraped-1.jpg", top: "55%", left: "10%", size: "100px", rot: 6 },
	{ src: "/scraped-2.jpg", top: "16%", left: "20%", size: "90px", rot: 12 },
	{ src: "/scraped-3.jpg", top: "60%", left: "26%", size: "110px", rot: -10 },
	{ src: "/scraped-4.jpg", top: "12%", right: "20%", size: "110px", rot: 4 },
	{ src: "/scraped-5.jpg", top: "55%", right: "10%", size: "120px", rot: -6 },
	{ src: "/scraped-0.jpg", top: "20%", right: "4%", size: "90px", rot: 8 },
] as const;

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-[#b8cadb] overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#cdd9e6] via-[#b8cadb] to-[#a7bccf]"
			/>

			{/* Floating chair collage */}
			<div aria-hidden="true" className="absolute inset-0 hidden md:block">
				{collageImages.map((img, i) => (
					<div
						key={`${img.src}-${i}`}
						className="absolute rounded-2xl overflow-hidden ring-1 ring-white/40 shadow-xl"
						style={{
							top: img.top,
							left: "left" in img ? img.left : undefined,
							right: "right" in img ? img.right : undefined,
							width: img.size,
							height: img.size,
							transform: `rotate(${img.rot}deg)`,
						}}
					>
						<Image src={img.src} alt="" fill sizes="120px" className="object-cover" />
					</div>
				))}
			</div>

			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="rounded-[28px] bg-white/85 backdrop-blur-md ring-1 ring-white/60 shadow-[0_30px_80px_-30px_rgba(31,41,51,0.35)] p-8 sm:p-12 text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2933] text-[#f5f1ea]">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="font-display text-3xl sm:text-4xl tracking-[-0.015em] text-[#1f2933]">
								You&apos;re on the list
							</h2>
							<p className="mt-3 text-[#1f2933]/60">{state.message}</p>
						</div>
					) : (
						<>
							<div className="text-[11px] uppercase tracking-[0.22em] text-[#c8a57a] mb-3">
								— Studio dispatch
							</div>
							<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[-0.015em] text-[#1f2933] leading-[1.05]">
								Stay Updated <br />
								<span className="italic font-light text-[#1f2933]/85">with Our Latest Designs</span>
							</h2>
							<p className="mt-4 text-[#1f2933]/65 max-w-md mx-auto">
								A monthly note from the atelier — new arrivals, behind-the-bench films, and quiet invitations
								to private sales.
							</p>
							<form action={action} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 rounded-full border border-[#1f2933]/15 bg-white px-5 text-[#1f2933] outline-none transition-all placeholder:text-[#1f2933]/35 focus:border-[#c8a57a] focus:ring-2 focus:ring-[#c8a57a]/20"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1f2933] px-7 font-medium text-[#f5f1ea] transition-all hover:bg-[#0e151c] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-4 w-4" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
