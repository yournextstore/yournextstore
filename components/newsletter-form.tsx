"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { trackIdentify } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * The footer's "Subscribe to Newsletter": opens a small black panel above the footer with the
 * signup form, styled like the cart.
 */
export function NewsletterButton({ className }: { className?: string }) {
	const [open, setOpen] = useState(false);
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger
				className={cn("tap whitespace-nowrap hover:underline data-popup-open:italic", className)}
			>
				Subscribe to Newsletter
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Popup className="fixed inset-x-3 bottom-[42px] z-50 text-label font-semibold text-white focus:outline-none data-open:animate-in data-open:fade-in-0 lg:left-auto lg:w-[500px]">
					<div className="card flex flex-col gap-3 bg-black">
						<Dialog.Title>Newsletter</Dialog.Title>
						{state?.success ? (
							<p role="status" className="text-copy font-normal">
								{state.message}
							</p>
						) : (
							<form action={action} className="flex flex-col gap-3">
								<p className="text-copy font-normal">
									Be the first to hear about new pieces and collections, a few times a year.
								</p>
								<label className="flex flex-col gap-1">
									Email address
									<input
										type="email"
										name="email"
										required
										autoComplete="email"
										className="h-8 rounded-sm bg-white px-2 text-base font-normal text-black focus-visible:outline-white md:text-label"
									/>
								</label>
								<NewsletterConsent
									checked={marketingConsent}
									onCheckedChange={setMarketingConsent}
									disabled={isPending}
									className="text-white [&_[data-slot=checkbox]]:border-white [&_span]:text-copy [&_span]:opacity-100"
								/>
								<button
									type="submit"
									disabled={isPending || !marketingConsent}
									className="h-8 rounded-sm bg-brand disabled:cursor-not-allowed disabled:opacity-70"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
								</button>
								{state?.error && (
									<p role="alert" className="text-copy font-normal">
										{state.error}
									</p>
								)}
							</form>
						)}
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
