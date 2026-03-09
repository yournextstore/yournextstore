"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

	return (
		<section className="bg-secondary">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
				<div className="max-w-lg mx-auto text-center">
					<h2 className="text-2xl sm:text-3xl font-medium mb-8">Subscribe to our newsletter</h2>

					{state?.success ? (
						<p className="text-sm text-muted-foreground">{state.message}</p>
					) : (
						<>
							<form action={action} className="flex gap-0">
								<input
									type="email"
									name="email"
									placeholder="Enter your email"
									className="flex-1 px-4 py-3 bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
									required
								/>
								<button
									type="submit"
									disabled={isPending}
									className="px-6 py-3 bg-foreground text-primary-foreground text-xs tracking-[0.15em] uppercase font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
								>
									{isPending ? "Submitting\u2026" : "Submit"}
								</button>
							</form>
							{state?.error && <p className="text-xs text-red-500 mt-4">{state.error}</p>}
							<p className="text-xs text-muted-foreground mt-4">
								Be the first to know about new collections and exclusive offers.
							</p>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
