const reviews = [
	{
		stars: 5,
		title: "My new ride-or-die",
		body: 'I have eczema and have tried literally every "sensitive skin" detergent on the market. This is the first one that didn\'t make me break out. And my towels smell amazing.',
		author: "Maya R.",
		location: "Brooklyn, NY",
	},
	{
		stars: 5,
		title: "Beats the big-box stuff",
		body: "Did a side-by-side with my old detergent. Same stained gym shirts. This one came out cleaner. I'm a convert.",
		author: "Daniel K.",
		location: "Austin, TX",
	},
	{
		stars: 5,
		title: "Refills are a game changer",
		body: "I love that I'm not throwing a giant plastic jug in the recycling every month. The aluminum bottle looks great in the laundry room too.",
		author: "Priya S.",
		location: "Portland, OR",
	},
];

function Stars({ count }: { count: number }) {
	return (
		<div className="flex gap-0.5 text-[#C9A07A]" role="img" aria-label={`${count} out of 5 stars`}>
			{Array.from({ length: 5 }).map((_, i) => (
				<svg
					key={`star-${i}`}
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill={i < count ? "currentColor" : "none"}
					stroke="currentColor"
					strokeWidth="1.5"
					aria-hidden="true"
				>
					<path
						d="M8 1.5l2 4.5 5 .5-3.8 3.4 1.1 4.9L8 12.3 3.7 14.8l1.1-4.9L1 6.5l5-.5L8 1.5Z"
						strokeLinejoin="round"
					/>
				</svg>
			))}
		</div>
	);
}

export function Reviews() {
	return (
		<section className="bg-[#F5EFE6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-xl mx-auto mb-12">
					<p className="uppercase tracking-[0.24em] text-xs text-[#6B92AC] font-semibold mb-3">
						Loved By Thousands
					</p>
					<h2 className="headline-display text-3xl sm:text-4xl lg:text-5xl text-[#1F2A33]">
						4.9 out of 5 stars
					</h2>
					<p className="mt-3 text-[#3B4856]">From over 12,400 reviewers (and counting).</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
					{reviews.map((r) => (
						<div
							key={r.author}
							className="rounded-3xl bg-white border border-[#E0D5C1] p-7 lg:p-8 flex flex-col"
						>
							<Stars count={r.stars} />
							<h3 className="headline-display text-lg sm:text-xl mt-4 text-[#1F2A33]">{r.title}</h3>
							<p className="mt-3 text-[#3B4856] leading-relaxed flex-1">&ldquo;{r.body}&rdquo;</p>
							<div className="mt-6 pt-4 border-t border-[#E0D5C1]">
								<p className="text-sm font-semibold text-[#1F2A33]">{r.author}</p>
								<p className="text-xs text-[#6B92AC] uppercase tracking-wider">{r.location}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
