"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	return (
		<section className="bg-[#ede4d3] border-y border-foreground/10">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 text-center">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/5">
							<CheckIcon className="h-5 w-5" />
						</div>
						<h2 className="font-serif text-3xl sm:text-4xl tracking-[-0.015em]">You&apos;re on the list.</h2>
						<p className="mt-3 text-[14px] text-foreground/65">{state.message}</p>
					</div>
				) : (
					<>
						<p className="text-[10px] tracking-[0.45em] uppercase text-foreground/55 font-light">
							The Dispatch
						</p>
						<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl tracking-[-0.015em] leading-[1.05]">
							Letters from
							<span className="italic font-light"> the studio.</span>
						</h2>
						<p className="mt-6 max-w-md mx-auto text-[15px] leading-[1.8] text-foreground/65">
							New releases, slow reads, and the occasional invitation. Twice a month, never more.
						</p>
						<form action={action} className="mx-auto mt-10 max-w-md flex flex-col gap-4">
							<div className="flex items-center rounded-full border border-foreground/25 bg-background/60 backdrop-blur-sm pl-6 pr-1.5 py-1.5">
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-10 w-full flex-1 bg-transparent outline-none text-[14px] text-foreground placeholder:text-foreground/40"
								/>
								<button
									type="submit"
									disabled={isPending || !marketingConsent}
									className="realm-pill inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-foreground px-6 text-[11px] tracking-[0.28em] uppercase text-background font-medium hover:bg-foreground/90 disabled:opacity-60"
								>
									{isPending ? "…" : "Subscribe"}
								</button>
							</div>
							<NewsletterConsent
								checked={marketingConsent}
								onCheckedChange={setMarketingConsent}
								disabled={isPending}
							/>
						</form>
						{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
