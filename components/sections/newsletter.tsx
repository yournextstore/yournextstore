"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-yns-yellow text-yns-navy overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
					<div className="lg:col-span-6">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-yns-navy text-yns-yellow">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="font-display text-4xl sm:text-5xl text-yns-navy leading-[1.05]">
									You&apos;re <span className="italic">on the list.</span>
								</h2>
								<p className="mt-4 text-yns-navy/75 text-[15px]">{state.message}</p>
							</div>
						) : (
							<>
								<p className="text-[11px] tracking-[0.22em] uppercase text-yns-navy/70 font-medium">
									The dispatch
								</p>
								<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-yns-navy leading-[1.05]">
									<span className="italic">Stay close</span> to the source.
								</h2>
								<p className="mt-5 text-yns-navy/75 text-[15px] max-w-md">
									Occasional notes on new vintages, lab results, and the people behind the spring. No
									marketing, ever.
								</p>
							</>
						)}
					</div>
					{!state?.success && (
						<div className="lg:col-span-6 lg:pl-10">
							<form action={action} className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									name="email"
									placeholder="you@somewhere.com"
									required
									className="h-14 w-full flex-1 rounded-full border border-yns-navy/30 bg-transparent px-6 text-yns-navy outline-none transition-all placeholder:text-yns-navy/40 focus:border-yns-navy focus:ring-2 focus:ring-yns-navy/10"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-yns-green px-10 text-[12px] tracking-[0.16em] uppercase font-medium text-white transition-colors hover:bg-[#1e3f27] disabled:opacity-60"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-800">{state.error}</p>}
							<p className="mt-4 text-[12px] text-yns-navy/60">
								By subscribing you agree to our quiet, infrequent emails. Unsubscribe anytime.
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
