"use client";

import { CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="px-3 sm:px-6 pb-3 sm:pb-4">
			<div className="max-w-7xl mx-auto">
				<div className="relative rounded-[32px] overflow-hidden bg-[var(--peach-light)] py-14 sm:py-20 px-6 sm:px-12">
					{/* Lightning bolt accents */}
					<svg
						aria-hidden="true"
						className="absolute top-6 right-10 w-8 h-8 text-[var(--coral)] -rotate-12"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<title>bolt</title>
						<path d="M13 0 L3 14 L11 14 L9 24 L21 8 L13 8 Z" />
					</svg>
					<svg
						aria-hidden="true"
						className="absolute bottom-8 left-8 w-6 h-6 text-[var(--coral)] rotate-12"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<title>bolt</title>
						<path d="M13 0 L3 14 L11 14 L9 24 L21 8 L13 8 Z" />
					</svg>

					<div className="relative max-w-3xl mx-auto text-center">
						{state?.success ? (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--coral)] text-[var(--cream)]">
									<CheckIcon className="h-6 w-6" />
								</div>
								<h2 className="font-display text-4xl sm:text-5xl italic tracking-tight text-[var(--ink)]">
									You&rsquo;re on the list
								</h2>
								<p className="mt-3 text-[var(--ink)]/60">{state.message}</p>
							</div>
						) : (
							<>
								<h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] tracking-tight text-[var(--ink)] leading-[0.95] flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
									<span>Stay</span>
									<span className="inline-flex items-center gap-2">
										<span className="rotate-[-4deg] inline-block bg-[var(--coral)] text-[var(--cream)] px-4 py-0.5 rounded-2xl italic">
											in
										</span>
									</span>
									<span>the</span>
									<span className="rotate-[3deg] inline-block bg-[var(--sky)] text-[var(--ink)] px-4 py-0.5 rounded-2xl italic">
										Know
									</span>
								</h2>
								<p className="mt-6 text-[15px] sm:text-base text-[var(--ink)]/65 max-w-md mx-auto">
									Drop your email for first dibs on new flavors, secret restocks, and stories from behind the
									scenes.
								</p>
								<form
									action={action}
									className="mt-8 mx-auto flex max-w-md flex-col gap-3 sm:flex-row bg-[var(--cream)] p-1.5 rounded-full border border-[var(--peach)]"
								>
									<input
										type="email"
										name="email"
										placeholder="you@youremail.com"
										required
										className="h-11 w-full flex-1 rounded-full bg-transparent px-5 text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/35 text-sm"
									/>
									<button
										type="submit"
										disabled={isPending}
										className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--coral)] hover:bg-[#d85a40] px-7 text-sm font-semibold text-[var(--cream)] tracking-wide transition-all disabled:opacity-50"
									>
										{isPending ? "Sending…" : "Submit"}
									</button>
								</form>
								{state?.error && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
