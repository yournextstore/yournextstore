import { cacheLife } from "next/cache";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Listing banner: the home hero's treatment at 42vh, the header floats over it. */
export function ListingBanner({
	title,
	description,
	image,
}: {
	title: string;
	description?: string | null;
	image: string | StaticImageData | null;
}) {
	return (
		<section data-hero className="relative h-[42vh] min-h-[300px] bg-card">
			{image &&
				(typeof image === "string" ? (
					<YNSMedia
						src={image}
						alt=""
						fill
						priority
						fetchPriority="high"
						sizes="100vw"
						className="object-cover"
					/>
				) : (
					<Image
						src={image}
						alt=""
						fill
						priority
						fetchPriority="high"
						sizes="100vw"
						placeholder="blur"
						className="object-cover"
					/>
				))}
			<div aria-hidden className="absolute inset-0 bg-black/60" />
			<div className="absolute inset-0 flex items-center justify-center px-5 pt-[76px]">
				<div className="max-w-2xl text-center text-white">
					<h1 className="wrap-break-word font-display text-[clamp(32px,5vw,56px)] font-black uppercase leading-tight tracking-tight">
						{title}
					</h1>
					{description && (
						<p className="mx-auto mt-3 line-clamp-3 max-w-[52ch] text-[15px] leading-relaxed text-white/85">
							{description}
						</p>
					)}
				</div>
			</div>
		</section>
	);
}

async function getPillCollections() {
	"use cache";
	cacheLife("hours");
	return (await commerce.collectionBrowse({ limit: 12 })).data
		.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
		.map((c) => ({ slug: c.slug, name: c.name }));
}

/** Square-cornered pills across the collections; the current one is brand-outlined. */
export async function CollectionPills({ active }: { active: string | null }) {
	const collections = await getPillCollections();
	const pills = [
		{ href: "/products", label: "All products", key: "all" },
		...collections.map((c) => ({ href: `/collection/${c.slug}`, label: c.name, key: c.slug })),
	];

	return (
		<nav aria-label="Collections" className="shell pt-8">
			<ul className="flex flex-wrap gap-2 pb-6">
				{pills.map((pill) => (
					<li key={pill.key}>
						<Link
							href={pill.href}
							aria-current={pill.key === active ? "page" : undefined}
							className={cn(
								"block rounded-md border px-4 py-2.5 text-[14px] transition",
								pill.key === active
									? "border-brand bg-brand-soft font-semibold text-foreground"
									: "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
							)}
						>
							{pill.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

/** The rounded toolbar box above the grid. */
export function ListingToolbar({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"mb-6 flex min-h-[58px] flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/90 px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3",
				className,
			)}
		>
			{children}
		</div>
	);
}
