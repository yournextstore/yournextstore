const TESTIMONIALS = [
	{
		quote: "My golden has the softest coat on the block now. Even his groomer asked what we changed.",
		name: "Hannah & Biscuit",
		location: "Brooklyn, NY",
	},
	{
		quote: "Finally a dry shampoo that doesn't smell like a chemistry set. The scent is gentle and clean.",
		name: "Maya & Pearl",
		location: "Austin, TX",
	},
	{
		quote: "We have a dog with sensitive skin and these are the first products that haven't made her itchy.",
		name: "Theo & Juno",
		location: "Portland, OR",
	},
];

function Mark() {
	return (
		<span aria-hidden className="font-serif text-5xl italic leading-none text-foreground/30">
			&ldquo;
		</span>
	);
}

export function Testimonials() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
				<div className="mb-14 text-center">
					<p className="text-[11px] yns-letter-spacing-mid uppercase text-muted-foreground">Loved by</p>
					<h2 className="mt-3 font-serif text-4xl sm:text-5xl font-light text-foreground">
						The most discerning <em className="italic">paws.</em>
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{TESTIMONIALS.map((t) => (
						<figure
							key={t.name}
							className="flex flex-col justify-between rounded-sm bg-[#E8DFD3]/60 p-8 ring-1 ring-[#A89C8C]/30"
						>
							<Mark />
							<blockquote className="mt-2 font-serif text-xl sm:text-2xl italic font-light leading-snug text-foreground">
								{t.quote}
							</blockquote>
							<figcaption className="mt-8 border-t border-[#A89C8C]/40 pt-4 text-xs tracking-wide text-muted-foreground">
								<div className="font-medium text-foreground">{t.name}</div>
								<div className="mt-0.5">{t.location}</div>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
