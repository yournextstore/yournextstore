import { getProducts } from "@/lib/catalog";
import { cn } from "@/lib/utils";

// The original runs its product-line logos across two tilted bands. Logos are brand art, so the
// bands carry the store's own product names, set in the heavy italic display cut.
const TONES = ["text-page", "text-[#ffd76a]", "text-page", "text-[#c9f1ff]"] as const;

function Row({ names, reverse }: { names: string[]; reverse?: boolean }) {
	const items = [...names, ...names];
	return (
		<div className={cn("flex w-max gap-14 pr-14", reverse ? "animate-marquee-reverse" : "animate-marquee")}>
			{items.map((name, index) => (
				<span
					key={`${name}-${index}`}
					className={cn(
						"whitespace-nowrap font-montserrat text-[2.25rem] font-black italic uppercase tracking-tight sm:text-[3.25rem]",
						reverse ? "text-navy" : TONES[index % TONES.length],
					)}
				>
					{name}
				</span>
			))}
		</div>
	);
}

export async function NameMarquee() {
	const products = await getProducts(16);
	const names = products.map((p) => p.name);
	if (names.length < 3) return null;
	const half = Math.ceil(names.length / 2);
	return (
		<section aria-hidden="true" className="relative overflow-hidden py-16 sm:py-24">
			<div className="relative z-10 -rotate-[4deg] scale-x-110 bg-electric py-7 sm:py-10">
				<Row names={names.slice(0, half)} />
			</div>
			<div className="-mt-4 rotate-[2deg] scale-x-110 bg-sky py-6 sm:py-9">
				<Row names={names.slice(half)} reverse />
			</div>
		</section>
	);
}
