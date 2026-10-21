import Link from "next/link";

/** One pill per collection under a listing title; the current one is pine-tinted. */
export function CollectionPills({
	collections,
	activeSlug,
}: {
	collections: { slug: string; name: string }[];
	activeSlug?: string;
}) {
	if (collections.length === 0) return <div className="pb-6" />;
	return (
		<nav aria-label="Collections" className="mt-7 flex flex-wrap gap-2 pb-6">
			{collections.map((c) => (
				<Link
					key={c.slug}
					href={`/collection/${c.slug}`}
					aria-current={c.slug === activeSlug ? "page" : undefined}
					className={
						c.slug === activeSlug
							? "rounded-md border border-pine bg-pine-soft px-4 py-2.5 text-[14px] font-semibold"
							: "rounded-md border border-line px-4 py-2.5 text-[14px] text-muted-foreground transition hover:border-ink hover:text-ink"
					}
				>
					{c.name}
				</Link>
			))}
		</nav>
	);
}
