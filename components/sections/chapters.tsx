import Image from "next/image";
import { YnsLink } from "../yns-link";

const chapters = [
	{
		image: "/scraped-3.jpg",
		eyebrow: "Chapter II",
		title: "The Stage",
		line: "She entered, and the room forgot how to breathe.",
		href: "/products",
	},
	{
		image: "/scraped-4.jpg",
		eyebrow: "Chapter III",
		title: "Submerged",
		line: "Soft heat, slow gold, a memory that refuses to leave.",
		href: "/products",
	},
	{
		image: "/scraped-5.jpg",
		eyebrow: "Chapter IV",
		title: "Fracture",
		line: "Cracked marble. Spilled amber. Something just broke.",
		href: "/products",
	},
	{
		image: "/scraped-2.jpg",
		eyebrow: "Chapter V",
		title: "Smoulder",
		line: "Vanilla, iris, ash — what was once burned, returns.",
		href: "/products",
	},
];

export function Chapters() {
	return (
		<section className="relative bg-ink py-20 sm:py-28">
			<div className="mx-auto mb-12 flex max-w-[1600px] items-end justify-between px-5 sm:mb-16 sm:px-8 lg:px-12">
				<div className="max-w-md">
					<p className="text-[10px] tracking-microcaps text-foreground/55">The Anthology</p>
					<h2 className="mt-3 font-serif-display text-3xl leading-[1.05] text-foreground sm:text-5xl">
						Six chapters,
						<br />
						<span className="italic text-peach">six confessions.</span>
					</h2>
				</div>
				<YnsLink
					prefetch={"eager"}
					href="/products"
					className="hidden text-[10px] tracking-microcaps text-foreground/70 underline-offset-8 hover:text-foreground hover:underline sm:block"
				>
					Read the full anthology →
				</YnsLink>
			</div>

			<div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:gap-6 sm:px-8 lg:px-12">
				{chapters.map((c) => (
					<YnsLink
						prefetch={"eager"}
						key={c.title}
						href={c.href}
						className="group relative block aspect-[3/4] w-[78vw] shrink-0 snap-start overflow-hidden bg-ink sm:w-[420px] lg:w-[460px]"
					>
						<Image
							src={c.image}
							alt={c.title}
							fill
							sizes="(max-width: 640px) 78vw, 460px"
							className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
						/>
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/20 to-ink/85" />
						<div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
							<p className="text-[9px] tracking-microcaps text-bone/60">{c.eyebrow}</p>
							<h3 className="mt-2 font-serif-display text-3xl italic text-bone sm:text-4xl">{c.title}</h3>
							<p className="mt-4 max-w-[34ch] font-serif-display text-base italic leading-snug text-saffron/95 sm:text-lg">
								&ldquo;{c.line}&rdquo;
							</p>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
