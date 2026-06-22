import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

const flavors = [
	{
		name: "Mint",
		tagline: "Crisp + cooling",
		image: "/scraped-2.jpg",
		accent: "#1abfb0",
	},
	{
		name: "Citrus",
		tagline: "Bright + zippy",
		image: "/scraped-3.jpg",
		accent: "#f1f23b",
	},
	{
		name: "Berry",
		tagline: "Dark + smooth",
		image: "/scraped-4.jpg",
		accent: "#0a0a0a",
	},
];

export function FlavorGrid() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
				<div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/60">
							The Flavors
						</p>
						<h2 className="mt-3 font-display text-5xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
							Pick your
							<br />
							<span className="text-foreground">poison.</span>
						</h2>
					</div>
					<p className="max-w-xs text-sm text-muted-foreground">
						Three formulations. All natural caffeine, zero compromises.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{flavors.map((f) => (
						<YnsLink
							key={f.name}
							prefetch={"eager"}
							href="/products"
							className="group relative aspect-[3/4] overflow-hidden"
							style={{ backgroundColor: f.accent }}
						>
							<div
								aria-hidden="true"
								className="absolute inset-0 opacity-30 mix-blend-multiply"
								style={{
									backgroundImage: "radial-gradient(circle, #0a0a0a 1.2px, transparent 1.4px)",
									backgroundSize: "14px 14px",
								}}
							/>
							<Image
								src={f.image}
								alt={`${f.name} flavor`}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
								<div className="rounded-full bg-background/95 px-4 py-2 backdrop-blur">
									<p className="font-display text-2xl uppercase leading-none text-foreground">{f.name}</p>
								</div>
								<div className="rounded-full bg-foreground px-4 py-2 text-background">
									<p className="text-[10px] font-semibold uppercase tracking-[0.2em]">{f.tagline}</p>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
