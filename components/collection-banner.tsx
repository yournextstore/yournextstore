import { EditorialImage } from "@/components/editorial-image";

/** HiyoRi's collection banner: a faded photograph with the name set in its lower-left corner. */
export function CollectionBanner({ title, image }: { title: string; image: string | null }) {
	return (
		<div className="relative mb-8 h-[220px] w-full overflow-hidden bg-secondary md:h-[280px]">
			{image && <EditorialImage src={image} sizes="100vw" priority className="opacity-50" />}
			<h1 className="absolute bottom-8 left-8 text-2xl font-medium md:text-5xl">{title}</h1>
		</div>
	);
}

export function SectionHeading({ heading, description }: { heading: string; description?: string | null }) {
	return (
		<section className="pt-5 pb-8">
			<h2 className="mb-8 text-3xl font-semibold md:text-4xl">{heading}</h2>
			{description && (
				<p className="mb-2 max-w-4xl text-lg leading-[1.8] tracking-wide text-zinc-700">{description}</p>
			)}
		</section>
	);
}

export function CollectionPageSkeleton() {
	return (
		<div className="shell min-h-svh pt-6 pb-8 md:py-8">
			<div className="mb-8 h-[220px] w-full animate-pulse bg-secondary md:h-[280px]" />
			<div className="pt-5 pb-8">
				<div className="mb-8 h-10 w-72 animate-pulse bg-muted" />
				<div className="h-6 w-full max-w-xl animate-pulse bg-muted" />
			</div>
		</div>
	);
}
