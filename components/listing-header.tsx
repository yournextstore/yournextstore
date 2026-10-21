import type { ReactNode } from "react";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's filtered-listing header: a sky kicker, a big bold title and a paragraph on
 * the left, the collection's photograph in a rounded dark frame on the right.
 */
export function ListingHeader({
	pretitle,
	title,
	description,
	image,
}: {
	pretitle: ReactNode;
	title: string;
	description: ReactNode;
	image: string | null;
}) {
	return (
		<section className="relative isolate mx-auto max-w-7xl overflow-hidden bg-white px-6 py-12 lg:overflow-visible lg:px-8">
			<div className="grid items-center gap-x-8 gap-y-10 lg:grid-cols-3">
				<div className="lg:col-span-2 lg:px-8">
					<div className="text-center text-base font-semibold leading-7 text-ink lg:text-left">
						<span className="border-b-2 border-sky pb-0.5">{pretitle}</span>
					</div>
					<h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 wrap-break-word sm:text-4xl lg:text-left">
						{title}
					</h1>
					<div
						aria-hidden
						className="mx-auto my-4 h-[3px] w-1/2 rounded-3xl bg-sky opacity-50 lg:mx-0 lg:w-24"
					/>
					<div className="mx-auto max-w-2xl text-center text-lg leading-8 text-gray-700 lg:mx-0 lg:text-left">
						{description}
					</div>
				</div>
				{image && (
					<div className="relative mx-auto h-72 w-full max-w-md overflow-hidden rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 lg:h-80">
						<YNSMedia
							src={image}
							alt=""
							fill
							priority
							fetchPriority="high"
							sizes="(max-width: 992px) 90vw, 30vw"
							className="object-cover object-[50%_25%]"
						/>
					</div>
				)}
			</div>
		</section>
	);
}

export function ListingHeaderSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
			<div className="grid items-center gap-x-8 gap-y-10 lg:grid-cols-3">
				<div className="flex flex-col items-center gap-4 lg:col-span-2 lg:items-start lg:px-8">
					<div className="h-7 w-24 animate-pulse rounded bg-gray-100" />
					<div className="h-10 w-2/3 animate-pulse rounded bg-gray-100" />
					<div className="h-[3px] w-24" />
					<div className="h-16 w-full max-w-2xl animate-pulse rounded bg-gray-100" />
				</div>
				<div className="mx-auto h-72 w-full max-w-md animate-pulse rounded-xl bg-gray-100 lg:h-80" />
			</div>
		</section>
	);
}
