import Image from "next/image";
import Link from "next/link";
import { Em } from "@/components/brand/em";
import { FamilyDot } from "@/components/brand/family-dot";
import { ArrowRightIcon } from "@/components/icons";
import { NotesList } from "@/components/notes";
import type { ShowcaseProduct, ShowcaseTile } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

const chip =
	"inline-flex h-11 items-center gap-2.5 rounded-full border border-ink/25 bg-page/30 px-5 text-xs uppercase tracking-[0.16em] text-ink/90 backdrop-blur-[10px] transition-colors hover:border-gold hover:text-ink";

/** Full-bleed hero over a dark drape, with the signature product in a glass card. */
export function Hero({
	storeName,
	featured,
	categories,
}: {
	storeName: string;
	featured: ShowcaseProduct | null;
	categories: (ShowcaseTile & { tone: number })[];
}) {
	return (
		<section aria-label={`${storeName}: featured`} className="relative isolate min-h-svh overflow-hidden">
			<div data-hero className="absolute inset-0 -z-10 bg-page">
				<Image
					src="/images/drape-backdrop.webp"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-[60%_50%]"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-page via-page/40 to-page/10 lg:bg-gradient-to-r lg:from-page/80 lg:via-page/30 lg:to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-page to-transparent" />
			</div>

			<div className="container-page grid min-h-svh items-end gap-10 pb-28 pt-[26svh] lg:items-center lg:pb-24 lg:pt-36 xl:grid-cols-[minmax(0,1fr)_21rem]">
				<div className="max-w-2xl animate-hero-rise">
					<h1 className="font-display text-hero tracking-[-0.02em] text-balance lg:max-w-[13.5ch] xl:max-w-none">
						Scent for the hours <Em>after dusk</Em>
					</h1>
					<p className="mt-6 max-w-md text-lead text-ink/75">
						Eaux de parfum, candles and body care, each built around a few warm materials and described note
						by note.
					</p>
					<Link href="/products" className="btn-glass mt-9">
						Discover the scents
						<ArrowRightIcon width={18} height={18} />
					</Link>
					{categories.length > 0 && (
						<ul aria-label="Browse by category" className="mt-10 flex flex-wrap gap-2.5">
							{categories.map((category) => (
								<li key={category.id}>
									<Link href={category.href} className={chip}>
										<FamilyDot index={category.tone} className="size-1.5" />
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>

				{featured && (
					<Link
						href={`/product/${featured.slug}`}
						aria-label={`Explore ${featured.name}`}
						className="group hidden w-full xl:block"
					>
						<div className="glass p-4 transition-colors duration-300 group-hover:border-gold/50">
							{featured.image && (
								<div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
									<YNSMedia
										src={featured.image}
										alt=""
										fill
										sizes="336px"
										className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
									/>
								</div>
							)}
							<div className="px-1 pt-5">
								<p className="font-display text-[1.625rem] leading-tight">{featured.name}</p>
								{featured.category && <p className="mt-1 text-sm text-ink/70">{featured.category}</p>}
								{featured.notes ? (
									<NotesList notes={featured.notes} className="mt-5" />
								) : (
									featured.summary && (
										<p className="mt-4 line-clamp-3 text-sm text-ink/80">{featured.summary}</p>
									)
								)}
								<div className="mt-6 flex items-center justify-between pb-1">
									<p className="text-sm text-ink/80">{featured.priceFrom}</p>
									<span className="grid size-11 place-items-center rounded-full border border-ink/30 backdrop-blur-[10px] transition-colors group-hover:border-gold group-hover:text-gold">
										<ArrowRightIcon
											width={18}
											height={18}
											className="transition-transform duration-300 group-hover:translate-x-0.5"
										/>
									</span>
								</div>
							</div>
						</div>
					</Link>
				)}
			</div>

			{featured && (
				<div className="absolute inset-x-0 bottom-6 z-10 xl:hidden">
					<div className="container-page">
						<Link
							href={`/product/${featured.slug}`}
							className="flex items-center justify-between gap-4 rounded-full border border-ink/20 bg-page/40 px-6 py-3 text-sm backdrop-blur-[10px] transition-colors hover:border-gold"
						>
							<span className="truncate font-display text-lg">{featured.name}</span>
							<span className="inline-flex shrink-0 items-center gap-2 text-ink/80">
								Explore <ArrowRightIcon width={16} height={16} />
							</span>
						</Link>
					</div>
				</div>
			)}
		</section>
	);
}
