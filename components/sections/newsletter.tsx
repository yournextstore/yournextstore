"use client";

import { ArrowRightIcon, CheckIcon, Gift } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-editorial-gradient">
			<div className="mx-auto max-w-[1440px] px-6 pb-20 lg:px-12">
				<div className="relative overflow-hidden bg-foreground text-background">
					<div
						aria-hidden
						className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-lilac/30 blur-3xl"
					/>
					<div
						aria-hidden
						className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-lilac-deep/20 blur-3xl"
					/>
					<div className="relative grid grid-cols-1 gap-10 px-8 py-14 lg:grid-cols-2 lg:px-16 lg:py-20">
						<div className="flex flex-col justify-center">
							<div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-background/80 ring-1 ring-background/15 backdrop-blur">
								<Gift className="h-3.5 w-3.5" />
								Welcome reward
							</div>
							{state?.success ? (
								<div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/10">
										<CheckIcon className="h-6 w-6" />
									</div>
									<h2 className="font-display text-4xl font-medium tracking-[-0.015em]">
										You&apos;re on the list
									</h2>
									<p className="mt-3 text-background/70">{state.message}</p>
								</div>
							) : (
								<>
									<h2 className="font-display mt-6 text-4xl font-medium leading-[1.05] tracking-[-0.015em] lg:text-5xl">
										Enjoy <span className="italic text-lilac">15% off</span>
										<br /> your first order
									</h2>
									<p className="mt-5 max-w-md text-base leading-relaxed text-background/70">
										Join the YNS membership for early access to designer drops, private styling and the
										seasonal lookbook delivered to your inbox.
									</p>
								</>
							)}
						</div>

						{!state?.success && (
							<div className="flex flex-col justify-center">
								<form action={action} className="flex flex-col gap-3">
									<label className="text-[11px] uppercase tracking-[0.22em] text-background/60">Email</label>
									<div className="flex items-center gap-0 border-b border-background/30 pb-1">
										<input
											type="email"
											name="email"
											placeholder="hello@yournextstore.com"
											required
											className="h-12 w-full flex-1 bg-transparent text-base text-background outline-none placeholder:text-background/40"
										/>
										<button
											type="submit"
											disabled={isPending}
											className="inline-flex h-10 shrink-0 items-center gap-2 px-4 text-[11px] uppercase tracking-[0.22em] text-background transition-opacity hover:opacity-80 disabled:opacity-50"
										>
											{isPending ? "Sending" : "Subscribe"}
											{!isPending && <ArrowRightIcon className="h-3.5 w-3.5" />}
										</button>
									</div>
									<p className="text-[11px] text-background/50">
										By subscribing you accept our terms and privacy policy.
									</p>
									{state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
								</form>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
