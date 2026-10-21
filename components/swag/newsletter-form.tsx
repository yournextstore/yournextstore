"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** The footer's "Join our newsletter" pill: outlined email field with the dark Subscribe pill inside it. */
export function SwagNewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<div className="w-full max-w-[22rem] text-center">
			<h2 className="font-sans text-t24 tracking-tight">Join our newsletter</h2>
			{state?.success ? (
				<p role="status" className="mt-4 text-t14 uppercase">
					{state.message || "You're on the list."}
				</p>
			) : (
				<form action={action} className="mt-4 flex flex-col gap-3">
					<label htmlFor={inputId} className="sr-only">
						Email address
					</label>
					<div className="flex items-center rounded-full border border-black p-0.5">
						<input
							id={inputId}
							type="email"
							name="email"
							required
							placeholder="Enter your email"
							className="h-9 min-w-0 flex-1 bg-transparent px-3 text-t14 outline-none placeholder:text-black"
						/>
						<button
							type="submit"
							disabled={isPending || !marketingConsent}
							className="h-9 shrink-0 cursor-pointer rounded-full bg-[#00337f] px-4 text-t14 text-white hover:bg-black disabled:cursor-not-allowed"
						>
							{isPending ? "Joining…" : "Subscribe"}
						</button>
					</div>
					<NewsletterConsent
						checked={marketingConsent}
						onCheckedChange={setMarketingConsent}
						disabled={isPending}
						className="[&_button]:border-black"
					/>
					{state?.error && (
						<p role="alert" className="text-t14">
							{state.error}
						</p>
					)}
				</form>
			)}
		</div>
	);
}
