"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The original's split newsletter band: a photograph on one side, an underlined form on the other. */
export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section id="newsletter" aria-labelledby="newsletter-title" className="border-t border-line">
			<div className="grid grid-cols-[minmax(0,1fr)] items-stretch md:grid-cols-2">
				<div className="relative min-h-[320px] bg-stage md:min-h-[460px]">
					<Image
						src="/images/newsletter.jpg"
						alt=""
						fill
						sizes="(min-width: 768px) 50vw, 100vw"
						className="object-cover"
					/>
				</div>
				<div className="flex flex-col justify-center gap-5 px-6 py-16 lg:px-[72px] lg:py-24">
					<p className="text-[11px] tracking-[0.3em]">NEWSLETTER</p>
					{state?.success ? (
						<>
							<h2
								id="newsletter-title"
								className="text-[clamp(22px,2.4vw,30px)] font-normal uppercase leading-snug tracking-[0.14em]"
							>
								You&apos;re on the list
							</h2>
							<p className="max-w-[44ch] text-[12px] leading-loose text-soft">{state.message}</p>
						</>
					) : (
						<>
							<h2
								id="newsletter-title"
								className="text-[clamp(22px,2.4vw,30px)] font-normal uppercase leading-snug tracking-[0.14em]"
							>
								First to know
							</h2>
							<p className="max-w-[44ch] text-[12px] leading-loose text-soft">
								New arrivals, private sales and lookbooks — a few times a month, never more. Unsubscribe at
								any time.
							</p>
							<form action={action} className="mt-2.5 flex max-w-[480px] flex-col gap-4">
								<div className="flex border-b border-foreground">
									<input
										type="email"
										name="email"
										required
										placeholder="Email address"
										aria-label="Email address"
										className="min-w-0 flex-1 bg-transparent py-3.5 text-[12px] tracking-[0.08em] outline-none placeholder:text-faint"
									/>
									<button type="submit" disabled={isPending || !marketingConsent} className="btn-ink px-7">
										{isPending ? "Sending…" : "Subscribe"}
									</button>
								</div>
								<NewsletterConsent
									checked={marketingConsent}
									onCheckedChange={setMarketingConsent}
									disabled={isPending}
									className="[&_span]:text-[11px] [&_span]:text-soft [&_span]:opacity-100"
								/>
							</form>
							{state?.error && <p className="text-[11px] text-destructive">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
