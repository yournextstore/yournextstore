import { Beaker, Flame, Leaf, Sparkles, Sprout, Star } from "lucide-react";

const ITEMS = [
	{ icon: Sparkles, label: "Our just-right blend" },
	{ icon: Star, label: "84 calories" },
	{ icon: Beaker, label: "2.8g of sugar" },
	{ icon: Flame, label: "Real spirits" },
	{ icon: Leaf, label: "No dyes" },
	{ icon: Sprout, label: "Crafted with care" },
];

function Row() {
	return (
		<>
			{ITEMS.map(({ icon: Icon, label }, i) => (
				<div key={`${label}-${i}`} className="flex items-center gap-3 sm:gap-4 shrink-0 pr-10 sm:pr-14">
					<span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[color:var(--cream)] text-[color:var(--charcoal)]">
						<Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
					</span>
					<span className="font-display text-xs sm:text-sm tracking-[0.08em] text-[color:var(--cream)] whitespace-nowrap">
						{label}
					</span>
				</div>
			))}
		</>
	);
}

export function Ticker() {
	return (
		<div className="bg-[color:var(--charcoal)] py-4 sm:py-5 overflow-hidden">
			<div className="flex ticker-track w-max">
				<Row />
				<Row />
			</div>
		</div>
	);
}
