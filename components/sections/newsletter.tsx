"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { LeafGlyph } from "@/components/garden/icons";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);
	const inputId = useId();

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section className="newsletter" id="newsletter">
			<div className="wrap">
				<div className="newsletter__inner">
					<h2>
						Let&apos;s Grow
						<br />
						Something{" "}
						<span className="whitespace-nowrap">
							Beautiful
							<LeafGlyph />
						</span>
					</h2>
					<p className="newsletter__sub">Get updates on new arrivals and stories from the shop.</p>
					<div>
						{state?.success ? (
							<p className="newsletter__msg" role="status">
								{state.message || "Thank you — you're on the list."}
							</p>
						) : (
							<form action={action} className="grid gap-3">
								<div className="newsletter__form">
									<label htmlFor={inputId} className="sr-only">
										Your email address
									</label>
									<input
										id={inputId}
										type="email"
										name="email"
										placeholder="Your email address"
										autoComplete="email"
										required
										className="newsletter__field"
									/>
									<button className="btn" type="submit" disabled={isPending || !marketingConsent}>
										{isPending ? "Sending…" : "Subscribe"}
									</button>
								</div>
								<NewsletterConsent
									checked={marketingConsent}
									onCheckedChange={setMarketingConsent}
									disabled={isPending}
								/>
								{state?.error && (
									<p className="newsletter__msg is-error" role="status">
										{state.error}
									</p>
								)}
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
