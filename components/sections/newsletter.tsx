"use client";

import { useState } from "react";

export function Newsletter() {
	const [email, setEmail] = useState("");

	return (
		<section className="bg-brand-dark py-16 text-white sm:py-20">
			<div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
				<h2 className="font-heading text-2xl font-bold sm:text-3xl">
					Subscribe To Our Newsletter and Enjoy 10% Off
				</h2>
				<p className="mt-3 text-sm text-white/70">
					Stay updated on product launches, special offers, and company news.
				</p>
				<form
					className="mt-8 flex gap-0"
					onSubmit={(e) => {
						e.preventDefault();
						setEmail("");
					}}
				>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="E-mail"
						className="w-full border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none"
						required
					/>
					<button
						type="submit"
						className="shrink-0 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:bg-brand-cream"
					>
						Subscribe
					</button>
				</form>
			</div>
		</section>
	);
}
