import { Banana, Leaf, Monstera } from "./leaves";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-cream-paper">
			{/* Corner foliage */}
			<div className="pointer-events-none absolute inset-0">
				{/* Top right small leaf */}
				<Leaf className="absolute top-12 right-[12%] w-10 h-16 leaf-sway" color="#2e7d3a" />
				{/* Bottom-left bouquet */}
				<Banana className="absolute -bottom-10 -left-8 w-52 h-72 leaf-sway-slow" color="#2e7d3a" />
				<Leaf className="absolute bottom-24 left-32 w-16 h-24 -rotate-12 leaf-sway" color="#0f3d2e" />
				<Banana
					className="absolute -bottom-16 left-44 w-44 h-64 rotate-6 leaf-sway-slow"
					color="#16523d"
					style={{ animationDelay: "1.2s" }}
				/>
				<Leaf className="absolute top-40 left-16 w-10 h-16 -rotate-45" color="#2e7d3a" />
				{/* Bottom-right bouquet */}
				<Banana
					className="absolute -bottom-10 -right-12 w-56 h-80 -scale-x-100 leaf-sway-slow"
					color="#2e7d3a"
					style={{ animationDelay: "0.6s" }}
				/>
				<Monstera className="absolute -bottom-4 right-24 w-40 h-36" color="#2e7d3a" />
				<Banana
					className="absolute -bottom-20 right-44 w-44 h-64 -rotate-12 leaf-sway-slow"
					color="#16523d"
					style={{ animationDelay: "1.6s" }}
				/>
				<Leaf className="absolute top-36 right-24 w-8 h-12 rotate-12 leaf-sway" color="#0f3d2e" />
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-12 sm:pt-16 pb-32 sm:pb-44">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="font-display uppercase text-forest text-[44px] leading-[0.95] sm:text-7xl lg:text-[96px] tracking-[-0.01em]">
							Inclusivity <span className="text-leaf">Made</span> Delicious
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-forest/75 leading-relaxed">
							Protein-packed plant-based goods, thoughtfully sourced and crafted to be inclusive of every
							lifestyle and diet — without compromise.
						</p>
					</div>

					{/* Decorative product trio */}
					<div className="relative mx-auto mt-12 sm:mt-16 flex max-w-3xl items-end justify-center gap-3 sm:gap-6">
						<ProductPouch tilt={-9} accent="#f4a03a" label="Ginger Teriyaki" stat="13g Protein" offset={28} />
						<ProductPouch
							tilt={2}
							accent="#d94a4a"
							label="Tomato · Poblano"
							stat="15g Protein"
							offset={0}
							featured
						/>
						<ProductPouch tilt={11} accent="#e89bb0" label="Sweet Barbecue" stat="15g Protein" offset={28} />
					</div>

					<div className="mt-12 sm:mt-16 flex justify-center">
						<a
							href="#products"
							className="leaf-cta inline-flex items-center justify-center bg-forest text-cream px-10 py-6 font-display text-xl uppercase tracking-[0.18em]"
						>
							Shop Now
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}

type ProductPouchProps = {
	tilt: number;
	accent: string;
	label: string;
	stat: string;
	offset: number;
	featured?: boolean;
};

function ProductPouch({ tilt, accent, label, stat, offset, featured }: ProductPouchProps) {
	return (
		<div className="relative" style={{ transform: `translateY(${offset}px) rotate(${tilt}deg)` }}>
			<div
				className={`relative w-32 sm:w-44 lg:w-56 ${featured ? "z-10" : "z-0"}`}
				style={{ aspectRatio: "3 / 4" }}
			>
				{/* Pouch SVG */}
				<svg
					viewBox="0 0 200 280"
					className="w-full h-full drop-shadow-[0_25px_40px_rgba(15,61,46,0.35)]"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id={`bg-${label}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#0f3d2e" />
							<stop offset="0.5" stopColor="#16523d" />
							<stop offset="1" stopColor="#0f3d2e" />
						</linearGradient>
					</defs>
					{/* Pouch body */}
					<path
						d="M14 18 C 14 10, 22 4, 30 4 L 170 4 C 178 4, 186 10, 186 18 L 188 264 C 188 272, 180 276, 172 276 L 28 276 C 20 276, 12 272, 12 264 Z"
						fill={`url(#bg-${label})`}
					/>
					{/* Top zip */}
					<rect x="22" y="14" width="156" height="6" rx="2" fill="#fdebc0" opacity="0.6" />
					{/* Accent banner */}
					<rect x="22" y="60" width="156" height="46" fill={accent} />
					<text
						x="100"
						y="90"
						textAnchor="middle"
						fill="#0f3d2e"
						fontFamily="Anton, sans-serif"
						fontSize="26"
						letterSpacing="1"
					>
						JACKFRUIT
					</text>
					{/* Sub label */}
					<rect x="40" y="118" width="120" height="22" fill="#fdebc0" />
					<text
						x="100"
						y="134"
						textAnchor="middle"
						fill="#0f3d2e"
						fontFamily="Anton, sans-serif"
						fontSize="11"
						letterSpacing="2"
					>
						{label.toUpperCase()}
					</text>
					{/* Protein chip */}
					<circle cx="56" cy="190" r="28" fill="#fdebc0" />
					<text
						x="56"
						y="187"
						textAnchor="middle"
						fill="#0f3d2e"
						fontFamily="Anton, sans-serif"
						fontSize="16"
					>
						{stat.split(" ")[0]}
					</text>
					<text
						x="56"
						y="200"
						textAnchor="middle"
						fill="#0f3d2e"
						fontFamily="Inter, sans-serif"
						fontSize="7"
						letterSpacing="1"
					>
						PROTEIN
					</text>
					{/* Decorative tiny leaves */}
					<path d="M150 170 C 162 160, 172 168, 168 184 C 160 186, 148 180, 150 170 Z" fill="#2e7d3a" />
					<path d="M150 200 C 162 192, 174 198, 170 214 C 162 216, 148 210, 150 200 Z" fill="#f4a03a" />
					{/* Footer label */}
					<rect x="22" y="240" width="156" height="20" fill="#0f3d2e" stroke="#fdebc0" strokeWidth="1" />
					<text
						x="100"
						y="254"
						textAnchor="middle"
						fill="#fdebc0"
						fontFamily="Inter, sans-serif"
						fontSize="9"
						letterSpacing="2"
					>
						NET WT. 2.2 OZ
					</text>
				</svg>
			</div>
		</div>
	);
}
