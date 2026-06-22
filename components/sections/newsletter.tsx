"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="yns-quiet-wash">
			<div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8">
				{state?.success ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/40 text-foreground">
							<CheckIcon className="h-5 w-5" />
						</div>
						<h2 className="font-serif text-4xl sm:text-5xl font-light italic text-foreground">
							You&apos;re on the list.
						</h2>
						<p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
					</div>
				) : (
					<>
						<p className="text-[11px] yns-letter-spacing-mid uppercase text-muted-foreground">
							Quiet letters, occasionally
						</p>
						<h2 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] text-foreground">
							Slow news, <em className="italic">soft offers,</em> and the occasional dog photo.
						</h2>
						<p className="mt-5 mx-auto max-w-md text-sm text-muted-foreground">
							Subscribe and we&apos;ll send 15% off your first order. No spam, ever — only a few hundred
							well-chosen words a month.
						</p>
						<form
							action={action}
							className="mx-auto mt-10 flex max-w-md items-center border-b border-foreground/50 focus-within:border-foreground"
						>
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 w-full flex-1 bg-transparent px-1 text-sm text-foreground outline-none placeholder:text-foreground/40"
							/>
							<button
								type="submit"
								disabled={isPending}
								className="ml-3 shrink-0 text-[11px] yns-letter-spacing-mid uppercase text-foreground transition-opacity hover:opacity-70 disabled:opacity-50"
							>
								{isPending ? "Sending…" : "Subscribe →"}
							</button>
						</form>
						{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
					</>
				)}
			</div>
		</section>
	);
}
