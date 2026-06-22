const ITEMS = [
	"EWG Verified",
	"Leaping Bunny Certified",
	"Clean Ingredients",
	"Vegan",
	"Sulfate Free",
	"Paraben Free",
	"Human Tested",
	"Pet Approved",
];

function Diamond() {
	return <span aria-hidden className="mx-8 inline-block h-1.5 w-1.5 rotate-45 bg-foreground/40" />;
}

export function Marquee() {
	const loop = [...ITEMS, ...ITEMS];
	return (
		<section className="overflow-hidden border-y border-border bg-[#E8DFD3]/60 py-5">
			<div className="yns-marquee flex w-max items-center whitespace-nowrap font-serif text-2xl sm:text-3xl italic font-light text-foreground/85">
				{loop.map((item, i) => (
					<span key={`${item}-${i}`} className="flex items-center">
						<span>{item}</span>
						<Diamond />
					</span>
				))}
			</div>
		</section>
	);
}
