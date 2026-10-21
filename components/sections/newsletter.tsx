"use client";

import { CheckIcon, Mail } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The original's black "stay up to date" card that overlaps the top of the footer. */
export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const emailId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div className="relative mx-auto grid max-w-[77.5rem] grid-cols-1 gap-9 rounded-[20px] bg-black px-6 py-9 md:grid-cols-2 md:gap-0 md:px-16 md:py-11">
			<h2 className="font-display text-display-sm text-white md:text-display-md">
				Stay up to date about our latest offers
			</h2>
			<div className="flex items-center">
				{state?.success ? (
					<div className="mx-auto flex w-full max-w-[349px] items-start gap-3 text-white" role="status">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black">
							<CheckIcon className="size-5" />
						</span>
						<p className="pt-2">{state.message}</p>
					</div>
				) : (
					<form action={action} className="mx-auto flex w-full max-w-[349px] flex-col">
						<label htmlFor={emailId} className="sr-only">
							Email address
						</label>
						<div className="mb-[14px] flex items-center rounded-full bg-white pl-4 transition-shadow focus-within:shadow-lg">
							<Mail className="mr-3 size-5 shrink-0 text-black/40" aria-hidden />
							<input
								id={emailId}
								type="email"
								name="email"
								required
								autoComplete="email"
								placeholder="Enter your email address"
								className="w-full bg-transparent py-3 pr-4 text-base text-black outline-none placeholder:text-sm placeholder:text-muted-foreground sm:placeholder:text-base"
							/>
						</div>
						<button
							type="submit"
							disabled={isPending || !marketingConsent}
							className="h-12 rounded-full bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:text-black/60 sm:text-base"
						>
							{isPending ? "Subscribing…" : "Subscribe to Newsletter"}
						</button>
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
							className="mt-4 text-white [&_[data-slot=checkbox]]:border-white/70 [&_[data-slot=checkbox][data-state=checked]]:border-white [&_[data-slot=checkbox][data-state=checked]]:bg-white [&_[data-slot=checkbox][data-state=checked]]:text-black"
						/>
						{state?.error && (
							<p role="alert" className="mt-3 text-sm text-[#ff8a8a]">
								{state.error}
							</p>
						)}
					</form>
				)}
			</div>
		</div>
	);
}
