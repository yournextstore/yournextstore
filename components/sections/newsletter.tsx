"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-arame-soft border-t border-border/50">
			<div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-24 sm:py-32">
				<div className="max-w-xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/30 text-foreground">
								<CheckIcon className="h-5 w-5" />
							</div>
							<h2 className="font-serif text-3xl text-foreground">You&apos;re on the list</h2>
							<p className="mt-3 text-muted-foreground">{state.message}</p>
						</div>
					) : (
						<>
							<p className="text-[11px] tracking-arame uppercase text-foreground/55">— Stay close</p>
							<h2 className="mt-4 font-serif text-4xl sm:text-5xl text-foreground leading-[1.05]">
								Letters from the
								<br />
								<em className="italic">washbasin.</em>
							</h2>
							<p className="mt-5 text-[15px] text-muted-foreground">
								A slow monthly note — new rituals, growers we&apos;ve met, and the occasional invitation to an
								in-person tasting.
							</p>
							<form action={action} className="mt-10 mx-auto max-w-md">
								<div className="relative border-b border-foreground/40 focus-within:border-foreground transition-colors">
									<input
										type="email"
										name="email"
										placeholder="your@email.com"
										required
										className="h-12 w-full bg-transparent pr-12 text-foreground font-serif text-lg outline-none placeholder:text-foreground/35 placeholder:font-serif placeholder:italic"
									/>
									<button
										type="submit"
										disabled={isPending}
										aria-label="Subscribe"
										className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors disabled:opacity-50"
									>
										{isPending ? (
											<span className="text-xs tracking-arame uppercase">…</span>
										) : (
											<svg
												width="22"
												height="22"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.2"
											>
												<path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										)}
									</button>
								</div>
								<p className="mt-4 text-[10px] tracking-arame uppercase text-foreground/45">
									Unsubscribe in a single click
								</p>
							</form>
							{state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
