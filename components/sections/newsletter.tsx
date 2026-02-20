"use client";

import { useState } from "react";

export function Newsletter() {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			setSubmitted(true);
			setEmail("");
		}
	};

	return (
		<section className="bg-secondary">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
				<div className="max-w-lg mx-auto text-center">
					<h2 className="text-2xl sm:text-3xl font-medium mb-8">Subscribe to our newsletter</h2>

					{submitted ? (
						<p className="text-sm text-muted-foreground">Thank you for subscribing!</p>
					) : (
						<>
							<form onSubmit={handleSubmit} className="flex gap-0">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="flex-1 px-4 py-3 bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
									required
								/>
								<button
									type="submit"
									className="px-6 py-3 bg-foreground text-primary-foreground text-xs tracking-[0.15em] uppercase font-medium hover:bg-foreground/90 transition-colors"
								>
									Submit
								</button>
							</form>
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
