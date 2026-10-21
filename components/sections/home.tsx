import { Award, Package, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";
import { EditorialImage } from "@/components/editorial-image";
import type { Tile } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const buttonDark =
	"inline-flex items-center justify-center whitespace-nowrap rounded-sm bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90";

export function Hero({ image, eyebrow }: { image: string | null; eyebrow: string }) {
	return (
		<section className="relative h-[calc(100svh-4rem)] max-h-[900px] min-h-[520px] w-full md:h-[800px]">
			<EditorialImage src={image} sizes="100vw" priority />
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-linear-to-r from-black/45 via-black/20 to-black/0"
			/>
			<div className="shell absolute inset-0 flex flex-col justify-center py-8">
				<p className="text-sm tracking-widest text-white uppercase">{eyebrow}</p>
				<h1 className="my-4 text-5xl leading-none font-bold text-white md:text-9xl md:leading-[1]">
					Designed for
					<br />
					living:
				</h1>
				<div className="mt-5 flex flex-wrap gap-4">
					<Link
						href="/products"
						className="inline-flex h-11 items-center justify-center rounded-sm border-2 border-white px-8 text-sm font-medium text-white transition-colors hover:bg-white hover:text-zinc-700 md:h-auto md:px-16 md:py-6"
					>
						New in
					</Link>
					<Link
						href="/about"
						className={cn(buttonDark, "h-11 border-2 border-primary px-8 md:h-auto md:px-16 md:py-6")}
					>
						Our Story
					</Link>
				</div>
			</div>
		</section>
	);
}

/** The original's "sub-collection circles": cream discs with the photo set inside, a label below. */
export function CategoryCircles({ tiles }: { tiles: Tile[] }) {
	if (tiles.length === 0) return null;
	return (
		<nav
			aria-label="Shop by category"
			className="scroll-thin -mx-8 overflow-x-auto px-8 py-12 lg:-mx-12 lg:px-12"
		>
			<ul className="flex w-max items-start gap-x-10">
				{tiles.map((tile) => (
					<li key={tile.href}>
						<Link href={tile.href} className="group block">
							<span className="relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-full bg-secondary md:h-[280px] md:w-[280px]">
								<span className="relative block h-48 w-48 overflow-hidden rounded-full md:h-60 md:w-60">
									<EditorialImage
										src={tile.image}
										sizes="240px"
										className="transition-transform duration-500 group-hover:scale-105"
									/>
								</span>
							</span>
							<span className="mt-3 block text-center font-semibold">{tile.label}</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

export function CollectionGrid({
	feature,
	image,
	side,
}: {
	feature: Tile | null;
	image: string | null;
	side: [string | null, string | null];
}) {
	return (
		<section className="grid grid-cols-2 gap-5 lg:grid-cols-3 lg:grid-rows-[340px_480px]">
			<div className="relative col-span-2 h-[480px] lg:row-span-2 lg:h-auto">
				<EditorialImage src={image} sizes="(max-width: 1024px) 100vw, 66vw" />
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800/35 px-6 text-center text-white">
					<h2 className="mb-3 text-4xl md:text-5xl">{feature?.label ?? "The Collection"}</h2>
					<p className="mb-8 font-light">{feature?.description || "Discover the collection"}</p>
					<Link
						href={feature?.href ?? "/products"}
						className={cn(buttonDark, "px-10 py-5 text-lg md:py-8 md:text-xl")}
					>
						Discover now
					</Link>
				</div>
			</div>
			<div className="relative h-48 sm:h-64 lg:h-auto">
				<EditorialImage src={side[0]} sizes="(max-width: 1024px) 50vw, 33vw" />
			</div>
			<div className="relative h-48 sm:h-64 lg:h-auto">
				<EditorialImage src={side[1]} sizes="(max-width: 1024px) 50vw, 33vw" />
			</div>
		</section>
	);
}

const FEATURES = [
	{
		Icon: ShoppingCart,
		title: "Responsible Design",
		description: "Designed with integrity and durably crafted for everyday use.",
	},
	{
		Icon: Tag,
		title: "Transparent Pricing",
		description: "We believe in accessible pricing and full transparency. Our pricing model is an open book.",
	},
	{
		Icon: Package,
		title: "Thoughtful Selection",
		description: "A considered range, chosen piece by piece rather than stocked by the dozen.",
	},
	{
		Icon: Award,
		title: "Made to Last",
		description: "Simple forms and honest materials, chosen to be used and enjoyed every day.",
	},
];

export function FeatureCards() {
	return (
		<section className="mx-auto grid grid-cols-1 justify-items-center gap-x-5 gap-y-8 pt-5 md:grid-cols-2 md:gap-x-12 lg:grid-cols-4">
			{FEATURES.map(({ Icon, title, description }) => (
				<div key={title} className="max-w-[18rem] text-center">
					<div className="flex items-center justify-center p-5">
						<Icon className="mb-5 h-[45px] w-[45px] text-zinc-400" strokeWidth={1.25} aria-hidden="true" />
					</div>
					<h2 className="mb-3 font-serif text-xl font-extralight">{title}</h2>
					<p className="text-lg text-muted-foreground">{description}</p>
				</div>
			))}
		</section>
	);
}

export function LessIsMore({ image }: { image: string | null }) {
	return (
		<section className="mx-auto my-16 grid w-full max-w-[1920px] grid-cols-12 bg-cream md:h-[580px]">
			<div className="relative col-span-12 h-[340px] overflow-hidden md:col-span-8 md:h-[580px]">
				<EditorialImage src={image} sizes="(max-width: 768px) 100vw, 66vw" />
			</div>
			<div className="col-span-12 px-6 pt-6 pb-8 md:col-span-4 md:px-10 md:py-20 lg:px-16">
				<h2 className="mb-3 text-xl font-semibold md:text-3xl">Less is More. Minimal.</h2>
				<p className="mb-5 max-w-md text-left text-xs leading-normal tracking-tight md:mb-12 md:text-lg">
					We believe no one should have to choose between the quality they want and the price they can afford.
					That’s why every piece in the shop is chosen for good materials, simple forms and everyday use -
					fewer things, picked with care, that you will reach for again and again.
				</p>
				<Link href="/products" className={cn(buttonDark, "h-10 rounded-full px-5 text-xs md:text-sm")}>
					Shop now
				</Link>
			</div>
		</section>
	);
}
