import Image from "next/image";
import { cn } from "@/lib/utils";

/** Dark photographic banner behind listings: a graded bundled photo, then copy. */
export function ListingBanner({
	image,
	children,
	align = "center",
}: {
	image: string | null;
	children: React.ReactNode;
	align?: "center" | "end";
}) {
	return (
		<section className="relative isolate overflow-hidden bg-[#1d2233]">
			{image && (
				<Image
					src={image}
					alt=""
					fill
					sizes="100vw"
					priority
					fetchPriority="high"
					className="-z-10 object-cover opacity-45 grayscale-[35%]"
				/>
			)}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(20_22_34/0.75),rgb(20_22_34/0.35)_60%,rgb(20_22_34/0.6))]"
			/>
			<div
				className={cn(
					"mx-auto flex min-h-[19rem] max-w-7xl flex-col justify-center px-6 py-12 lg:min-h-96",
					align === "center"
						? "items-center text-center"
						: "items-center text-center lg:items-end lg:pr-16 lg:text-right",
				)}
			>
				{children}
			</div>
		</section>
	);
}

/** The original's blue brush-stroke slab with poster capitals ("FUEL YOUR PERFORMANCE …"). */
export function BrushHeadline({ lines, as: Tag = "h1" }: { lines: [string, string]; as?: "h1" | "h2" }) {
	return (
		<Tag className="brush-block bg-[#1f4f96] px-8 py-5 text-center font-anton text-[1.75rem] leading-[1.15] tracking-wide text-white uppercase sm:px-12 sm:text-[2.5rem] lg:text-[2.75rem]">
			<span className="block">{lines[0]}</span>
			<span className="block">{lines[1]}</span>
		</Tag>
	);
}
