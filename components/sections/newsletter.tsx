"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-brand-dark py-16 text-white sm:py-20">
			<div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
							<CheckIcon className="h-6 w-6" />
						</div>
						<h2 className="font-heading text-2xl font-bold sm:text-3xl">You&apos;re on the list</h2>
						<p className="mt-3 text-sm text-white/70">{state.message}</p>
					</div>
				) : (
					<>
						<h2 className="font-heading text-2xl font-bold sm:text-3xl">
							Subscribe To Our Newsletter and Enjoy 10% Off
						</h2>
						<p className="mt-3 text-sm text-white/70">
							Stay updated on product launches, special offers, and company news.
						</p>
						<form action={action} className="mt-8 flex gap-0">
							<input
								type="email"
								name="email"
								placeholder="E-mail"
								className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none"
								required
							/>
							<button
								type="submit"
								disabled={isPending}
								className="shrink-0 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:bg-brand-cream disabled:opacity-50"
							>
								{isPending ? "Subscribing\u2026" : "Subscribe"}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
