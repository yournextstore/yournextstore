import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's collection header: serif title and supporting copy on the left, a wide
 * rounded photograph on the right (stacked under the copy on phones).
 */
export function ListingHeader({
	title,
	description,
	image,
}: {
	title: string;
	description?: string | null;
	image?: string | null;
}) {
	return (
		<div className="mb-8 grid gap-8 lg:mb-10 lg:grid-cols-2 lg:items-center lg:gap-16">
			<div>
				<h1 className="text-heading-xl text-balance">{title}</h1>
				{description ? (
					<p className="mt-5 max-w-lg text-body-sm text-muted-foreground line-clamp-6">{description}</p>
				) : null}
			</div>
			{image ? (
				<div className="relative aspect-16/9 overflow-hidden rounded-md bg-secondary">
					<YNSMedia
						src={image}
						alt=""
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
			) : null}
		</div>
	);
}
