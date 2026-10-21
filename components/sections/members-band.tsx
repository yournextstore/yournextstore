"use client";

import { CheckIcon, Mail } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";
import { YNSMedia } from "@/lib/yns-media";

/**
 * TestimonialsFade's header: a light photograph fading to white behind a dark headline, with the
 * "Subscribe" button wired to the newsletter signup.
 */
export function MembersBand({ image }: { image: string | null }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section className="container-ae py-8 sm:py-12">
			<div className="relative isolate overflow-hidden rounded-t-2xl px-4 pb-12 pt-16 sm:px-8 sm:pt-20">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(max-width: 1400px) 100vw, 1320px"
						className="-z-20 object-cover object-[50%_30%] opacity-60"
					/>
				)}
				<span
					aria-hidden
					className="absolute inset-0 -z-10 bg-linear-to-b from-white/30 via-white/70 to-white"
				/>
				<div className="mx-auto max-w-2xl text-center">
					{state?.success ? (
						<div>
							<span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-slate-ink text-white">
								<CheckIcon className="h-6 w-6" aria-hidden />
							</span>
							<h2 className="text-[1.875rem] font-bold sm:text-5xl">You&apos;re on the list</h2>
							<p className="mt-4 text-lg text-slate-ink">{state.message}</p>
						</div>
					) : (
						<>
							<h2 className="mb-4 text-[1.875rem] font-bold leading-tight sm:text-5xl">Stay in the loop</h2>
							<p className="mb-8 text-lg leading-relaxed text-slate-ink sm:text-xl">
								Join the newsletter to hear about new arrivals, restocks and offers from the shop.
							</p>
							<form action={action} className="mx-auto flex max-w-md flex-col gap-4">
								<div className="flex flex-col gap-3 sm:flex-row">
									<label htmlFor="members-email" className="sr-only">
										Email address
									</label>
									<input
										id="members-email"
										type="email"
										name="email"
										placeholder="Enter your email"
										required
										className="h-12 w-full rounded-md border border-slate-line bg-white px-4 sm:flex-1 text-sm text-slate-ink outline-none placeholder:text-slate-body focus:border-slate-body"
									/>
									<button
										type="submit"
										disabled={isPending || !marketingConsent}
										className="btn-ae btn-ae-dark h-12 shrink-0 px-8"
									>
										<Mail className="h-4 w-4" aria-hidden />
										{isPending ? "Sending…" : "Subscribe"}
									</button>
								</div>
								<NewsletterConsent
									checked={marketingConsent}
									onCheckedChange={setMarketingConsent}
									disabled={isPending}
								/>
							</form>
							{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
