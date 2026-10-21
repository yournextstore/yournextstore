"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

/** Photon's footer signup: "Subscribe [type your email here] Submit" on one line. */
export function FooterNewsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	if (state?.success) {
		return <p className="md:max-w-sm">You&apos;re in, we&apos;ll keep you updated.</p>;
	}

	return (
		<section aria-label="Newsletter" className="flex flex-col gap-y-1 md:max-w-sm">
			<form action={action} className="flex flex-wrap items-center gap-x-[var(--main-gap)]">
				<label htmlFor="footer-newsletter-email" className="shrink-0">
					Subscribe
				</label>
				<input
					id="footer-newsletter-email"
					type="email"
					name="email"
					placeholder="type your email here"
					required
					className="h-6 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-[#a8a6a1] focus-visible:underline"
				/>
				<button
					type="submit"
					disabled={isPending || !marketingConsent}
					className="inline-flex h-6 shrink-0 cursor-pointer items-center hover:underline disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isPending ? "Sending" : "Submit"}
				</button>
				<NewsletterConsent
					checked={marketingConsent}
					onCheckedChange={setMarketingConsent}
					disabled={isPending}
					className="mt-1 basis-full font-normal"
				/>
			</form>
			{state?.error && <p role="alert">{state.error}</p>}
		</section>
	);
}
