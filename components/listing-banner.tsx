import { type Crumb, Crumbs } from "@/components/crumbs";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's category banner: a 350px pale panel with the breadcrumb and title sitting on its
 * bottom edge. A category or collection photo fills it, washed out at the bottom so the dark type
 * keeps its contrast. `title={null}` renders the loading state at the same height.
 */
export function ListingBanner({
	title,
	crumbs,
	image,
	description,
}: {
	title: string | null;
	crumbs: Crumb[];
	image?: string | null;
	description?: string | null;
}) {
	return (
		<div className="relative isolate flex min-h-[350px] flex-col justify-end overflow-hidden bg-wash">
			{image ? (
				<>
					<YNSMedia src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
					<div className="-z-10 absolute inset-0 bg-linear-to-t from-wash via-wash/80 to-wash/10" />
				</>
			) : null}
			<div className="shell">
				{title === null ? (
					<>
						<div className="mb-6 h-5 w-40 animate-pulse rounded bg-gray-200" />
						<div className="mb-4 h-10 w-64 animate-pulse rounded bg-gray-200" />
					</>
				) : (
					<>
						<Crumbs items={crumbs} />
						<h1 className="mb-4 text-4xl font-bold text-ink wrap-break-word">{title}</h1>
						{description ? <p className="mb-4 max-w-2xl text-ink-soft">{description}</p> : null}
					</>
				)}
			</div>
		</div>
	);
}
