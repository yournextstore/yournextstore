"use client";

import { Leaf, Recycle, Shirt, Sparkles } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useState } from "react";

const values = [
	{
		icon: Leaf,
		title: "Conscious Organization",
		description:
			"We feel immensely responsible and morally obligated when it comes to the social and environmental areas our business influences.",
	},
	{
		icon: Sparkles,
		title: "Ethical Production",
		description:
			"Our overall design goal is to create long-lasting products — both in terms of expression and durability.",
	},
	{
		icon: Recycle,
		title: "Sustainable Assortment",
		description:
			"We address organic and/or recycled fibers used at factories, which have perfect working conditions.",
	},
	{
		icon: Shirt,
		title: "Scandinavian Streetwear",
		description:
			"We continue to explore trends while holding on to the core identity and heritage of the brand.",
	},
];

export function NewsletterValues() {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
	};

	return (
		<section className="py-16 sm:py-24 bg-brand-dark text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Newsletter */}
				<div className="text-center mb-20">
					<div className="mb-8">
						<Image
							src="/hero-bg-1.svg"
							alt=""
							width={200}
							height={60}
							className="mx-auto invert opacity-80"
						/>
					</div>
					<h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-6">
						Hey You! Join Us Now!
					</h3>
					{submitted ? (
						<p className="text-white/70">Thank you for subscribing!</p>
					) : (
						<form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Your email"
								required
								className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-brand-yellow"
							/>
							<button
								type="submit"
								className="bg-brand-yellow text-brand-dark px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-brand-yellow/90 transition-colors"
							>
								Submit
							</button>
						</form>
					)}
					<p className="mt-4 text-xs text-white/50">
						Be the first to know about new collections and exclusive offers.
					</p>
				</div>

				{/* Values Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{values.map((value) => (
						<div key={value.title} className="text-center">
							<value.icon className="w-8 h-8 mx-auto mb-4 text-brand-yellow" />
							<h4 className="text-sm font-extrabold uppercase tracking-widest mb-3">{value.title}</h4>
							<p className="text-sm text-white/60 leading-relaxed">{value.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
