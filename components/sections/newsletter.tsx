"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { headingSizes, pill } from "@/components/munch/styles";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";
import { cn } from "@/lib/utils";

/** The original's sign-up band above the footer: big serif line, tall outlined field and pill. */
export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section className="shell flex flex-col gap-s py-2xl">
			{state?.success ? (
				<p className="font-serif text-d-xl leading-[1.1] text-brand lg:text-d-5xl">{state.message}</p>
			) : (
				<>
					<h2 className={cn(headingSizes.page, "lg:text-d-5xl")}>Subscribe for fresh news.</h2>
					<form action={action} className="flex flex-col gap-s">
						<div className="flex flex-col gap-s lg:flex-row">
							<label htmlFor="newsletter-email" className="sr-only">
								Email address
							</label>
							<input
								id="newsletter-email"
								type="email"
								name="email"
								placeholder="Email address"
								autoComplete="email"
								required
								className="h-20 w-full rounded-lg border-[1.5px] border-brand bg-transparent px-lg font-sans text-b-4xl leading-[1.4] tracking-[-0.64px] text-foreground outline-none placeholder:text-foreground/75 focus-visible:ring-4 focus-visible:ring-brand/40 lg:max-w-240 lg:px-2xl lg:text-b-8xl lg:tracking-[-0.96px]"
							/>
							<button
								type="submit"
								disabled={isPending || !marketingConsent}
								className={pill({ size: "xl", variant: "outline", className: "w-full lg:flex-1" })}
							>
								{isPending ? "Subscribing…" : "Subscribe"}
							</button>
						</div>
						<NewsletterConsent
							checked={marketingConsent}
							onCheckedChange={setMarketingConsent}
							disabled={isPending}
						/>
					</form>
					{state?.error && (
						<p className="rounded-lg bg-blush p-s text-b-lg text-destructive" role="alert">
							{state.error}
						</p>
					)}
				</>
			)}
		</section>
	);
}
