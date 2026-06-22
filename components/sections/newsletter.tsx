"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-yns-blue text-white overflow-hidden relative">
			{/* subtle starburst dots */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.06] pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 30%, white 0, white 1px, transparent 2px), radial-gradient(circle at 80% 60%, white 0, white 1px, transparent 2px), radial-gradient(circle at 50% 80%, white 0, white 1px, transparent 2px)",
					backgroundSize: "120px 120px, 180px 180px, 240px 240px",
				}}
			/>
			<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
								<CheckIcon className="h-7 w-7" strokeWidth={3} />
							</div>
							<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
								You&apos;re on the list
							</h2>
							<p className="mt-4 text-white/80 text-lg">{state.message}</p>
						</div>
					) : (
						<>
							<h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
								Join the YNS Family
							</h2>
							<form
								action={action}
								className="mx-auto mt-10 flex max-w-md flex-col sm:flex-row gap-3 items-center"
							>
								<div className="relative w-full flex-1">
									<input
										type="email"
										name="email"
										placeholder="Email"
										required
										aria-label="Email"
										className="h-12 w-full rounded-sm border-2 border-white/30 bg-transparent px-4 pr-12 text-white text-base outline-none transition-all placeholder:text-white/60 focus:border-white focus:bg-white/5"
									/>
									<button
										type="submit"
										disabled={isPending}
										aria-label="Subscribe"
										className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-sm bg-white/0 text-white hover:bg-white hover:text-yns-blue transition-colors disabled:opacity-50"
									>
										<ArrowRightIcon className="h-5 w-5" strokeWidth={2.5} />
									</button>
								</div>
							</form>
							{state?.error && <p className="mt-4 text-sm text-yns-yellow">{state.error}</p>}
						</>
					)}
				</div>

				{/* Accessibility statement */}
				<div className="mt-16 text-center max-w-2xl mx-auto">
					<p className="font-extrabold text-sm uppercase tracking-[0.16em]">We&apos;re here for everyone.</p>
					<p className="mt-4 text-sm leading-relaxed text-white/85">
						At Your Next Store, we believe good products — and good design — should be accessible to all. We
						are actively working to make our website easy to navigate and inclusive for everyone, including
						people with disabilities.
					</p>
					<p className="mt-4 text-sm leading-relaxed text-white/85">
						If you ever have trouble using our site or need support, don&apos;t hesitate to reach out:{" "}
						<a
							href="mailto:hi@yournextstore.com"
							className="underline underline-offset-4 hover:text-yns-yellow"
						>
							hi@yournextstore.com
						</a>
						.
					</p>
					<p className="mt-4 text-xs text-white/60">
						Your Next Store Inc., a New York limited liability company.
					</p>
				</div>
			</div>
		</section>
	);
}
