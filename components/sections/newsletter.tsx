"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="relative bg-ink text-cream overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-50"
				style={{
					backgroundImage:
						"radial-gradient(circle at 5% 100%, rgba(168,212,240,0.18) 0, transparent 35%), radial-gradient(circle at 95% 0%, rgba(230,51,41,0.22) 0, transparent 35%)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div>
						<span className="inline-block rounded-full bg-mustard text-ink px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
							The mailing list
						</span>
						<h2
							className="yns-display mt-5 text-cream leading-[0.85]"
							style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)" }}
						>
							Get the <br />
							<span className="text-mustard">good</span> mail
						</h2>
						<p className="mt-6 text-lg leading-relaxed text-cream/75 max-w-md">
							New arrivals, recipes, stockist drops, the occasional embarrassing photo of the founder. No
							spam, just snacks.
						</p>
					</div>

					<div className="relative">
						<div className="rounded-[2rem] bg-cream text-ink p-8 sm:p-10 ring-[6px] ring-mustard">
							{state?.success ? (
								<div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
									<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream">
										<CheckIcon className="h-7 w-7" />
									</div>
									<h3 className="yns-display text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
										You&apos;re in!
									</h3>
									<p className="mt-3 text-ink/70">{state.message}</p>
								</div>
							) : (
								<form action={action} className="flex flex-col gap-4">
									<label
										htmlFor="newsletter-email"
										className="text-xs font-bold uppercase tracking-widest text-ink/70"
									>
										Your email
									</label>
									<input
										id="newsletter-email"
										type="email"
										name="email"
										placeholder="hello@yourname.com"
										required
										className="h-14 w-full rounded-full border-2 border-ink bg-cream px-6 text-base text-ink placeholder:text-ink/40 outline-none focus:ring-4 focus:ring-mustard/50 transition-all"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="h-14 w-full rounded-full bg-ink text-cream text-sm font-bold uppercase tracking-widest hover:bg-cherry transition-colors disabled:opacity-50"
									>
										{isPending ? "Adding you…" : "Sign me up"}
									</button>
									{state?.error && (
										<p className="text-sm text-cherry text-center font-semibold">{state.error}</p>
									)}
								</form>
							)}
						</div>

						<div className="absolute -top-5 -right-4 sm:-top-7 sm:-right-8 rotate-12">
							<div className="rounded-full bg-cherry text-cream px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-xl">
								No spam &nbsp;✦
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
