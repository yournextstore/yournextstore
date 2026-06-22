"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-espresso-grain text-[#f4efe6] overflow-hidden border-y border-[#3d2e22]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a87c]/40 bg-[#3d2e22]">
								<CheckIcon className="h-5 w-5 text-[#c9a87c]" />
							</div>
							<h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe6]">You&apos;re on the list</h2>
							<p className="mt-4 text-[#e8dcc8]/70">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] tracking-luxe uppercase text-[#c9a87c] mb-5">
								Letters from the Atelier
							</p>
							<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f4efe6] leading-[1.1]">
								Quiet correspondence,
								<br />
								<em className="italic text-[#e8dcc8]">sent rarely.</em>
							</h2>
							<p className="mt-6 text-base leading-relaxed text-[#e8dcc8]/70 max-w-md mx-auto font-light">
								New releases, behind-the-scenes notes from our perfumers, and the occasional invitation to a
								private pour. No noise, ever.
							</p>
							<form
								action={action}
								className="mx-auto mt-12 flex max-w-md flex-col gap-3 sm:flex-row sm:gap-0"
							>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									required
									className="h-12 w-full flex-1 border border-[#c9a87c]/40 bg-transparent px-5 text-sm text-[#f4efe6] outline-none transition-all placeholder:text-[#e8dcc8]/40 focus:border-[#c9a87c]"
								/>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-[#c9a87c] px-8 text-xs tracking-luxe uppercase font-medium text-[#1a1410] transition-all hover:bg-[#f4efe6] disabled:opacity-50"
								>
									{isPending ? "Subscribing…" : "Subscribe"}
									{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
								</button>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
							<p className="mt-6 text-[10px] tracking-luxe uppercase text-[#c9a87c]/50">
								Unsubscribe anytime · We never share your address
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
