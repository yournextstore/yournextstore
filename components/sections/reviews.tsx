import { Star } from "lucide-react";

const reviews = [
	{
		quote:
			"My whole shower smells like a vacation now. The Coconut Dreamin' bar is unreal — I'm on subscription #4 and counting.",
		name: "Maya R.",
		location: "Brooklyn, NY",
		product: "Coconut Dreamin'",
	},
	{
		quote:
			"Finally a clean soap that doesn't smell like a hotel lobby. Bold, weird, in the best way. I get compliments daily.",
		name: "Devon K.",
		location: "Austin, TX",
		product: "Midnight Citrus",
	},
	{
		quote:
			"The lather is ridiculous. My skin feels softer after a week than it did after a year of fancy cream. Truly converted.",
		name: "Priya S.",
		location: "Los Angeles, CA",
		product: "Wild Oat Milk",
	},
];

export function Reviews() {
	return (
		<section className="bg-[#fdf6ee]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
					<div>
						<p className="font-script text-2xl text-[#4d4bc4]">the reviews are in</p>
						<h2 className="mt-1 font-display text-4xl sm:text-5xl text-[#1a1a2e]">Loved by thousands</h2>
					</div>
					<div className="flex items-center gap-3 text-[#1a1a2e]">
						<div className="flex">
							{Array.from({ length: 5 }).map((_, i) => (
								<Star key={i} className="w-5 h-5 fill-[#e8a47a] text-[#e8a47a]" />
							))}
						</div>
						<p className="text-sm font-semibold">
							4.9 / 5 <span className="text-[#5c5b78] font-normal">· 12,408 reviews</span>
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{reviews.map((r) => (
						<div
							key={r.name}
							className="bg-white rounded-3xl p-7 sm:p-8 border border-[#e4d9c4] shadow-[0_15px_30px_-20px_rgba(26,26,46,0.2)] hover:shadow-[0_25px_45px_-20px_rgba(26,26,46,0.35)] hover:-translate-y-1 transition-all"
						>
							<div className="flex gap-1 mb-4">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={i} className="w-4 h-4 fill-[#e8a47a] text-[#e8a47a]" />
								))}
							</div>
							<p className="font-display text-xl text-[#1a1a2e] leading-snug">&ldquo;{r.quote}&rdquo;</p>
							<div className="mt-6 pt-5 border-t border-[#e4d9c4] flex items-center justify-between text-sm">
								<div>
									<p className="font-semibold text-[#1a1a2e]">{r.name}</p>
									<p className="text-[#5c5b78]">{r.location}</p>
								</div>
								<p className="text-[#4d4bc4] font-semibold">{r.product}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
