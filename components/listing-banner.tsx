import { YNSMedia } from "@/lib/yns-media";

/** GoCart's store-info banner, reused for collection and category headers. */
export function ListingBanner({
	name,
	description,
	image,
	note,
}: {
	name: string;
	description?: string | null;
	image?: string | null;
	note?: string | null;
}) {
	return (
		<div className="mx-auto mt-6 flex max-w-7xl flex-col items-center gap-6 rounded-xl bg-slate-50 p-6 shadow-xs md:flex-row md:p-10">
			{image && (
				<div className="relative size-32 shrink-0 overflow-hidden rounded-md border-2 border-slate-100 sm:size-38">
					<YNSMedia src={image} alt="" fill sizes="152px" priority className="object-cover" />
				</div>
			)}
			<div className="text-center md:text-left">
				<h1 className="text-3xl font-semibold text-slate-800">{name}</h1>
				{description && <p className="mt-2 max-w-lg text-sm text-slate-600">{description}</p>}
				{note && <p className="mt-4 text-sm text-slate-600">{note}</p>}
			</div>
		</div>
	);
}

export function ListingBannerSkeleton() {
	return (
		<div className="mx-auto mt-6 flex max-w-7xl flex-col items-center gap-6 rounded-xl bg-slate-50 p-6 md:flex-row md:p-10">
			<div className="size-32 shrink-0 animate-pulse rounded-md bg-slate-100 sm:size-38" />
			<div className="flex flex-col items-center gap-3 md:items-start">
				<div className="h-9 w-56 animate-pulse rounded bg-slate-100" />
				<div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
			</div>
		</div>
	);
}
