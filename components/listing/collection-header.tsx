import { YNSMedia } from "@/lib/yns-media";
import { ShowMore } from "./show-more";

/** Bordered header card: a short photo strip, the title and a fading, expandable intro. */
export function CollectionHeader({
	heading,
	image,
	paragraphs,
}: {
	heading: string;
	image: string | null;
	paragraphs: string[];
}) {
	return (
		<div id="collection-header" className="overflow-hidden rounded-md border border-border">
			<div className="relative h-36 w-full bg-secondary">
				{image && <YNSMedia src={image} alt="" fill sizes="100vw" priority className="object-cover" />}
			</div>
			<div className="p-6">
				<h1 className="text-3xl font-semibold tracking-tight wrap-break-word">{heading}</h1>
				{paragraphs.length > 0 && <ShowMore paragraphs={paragraphs} />}
			</div>
		</div>
	);
}
