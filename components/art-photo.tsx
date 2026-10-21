import { getImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * A full-bleed photograph with its own crop for phones: the landscape file from 1024px, the
 * portrait one below. next/image serves one file at several widths; switching files by screen
 * size needs a <picture> with a <source media> of our own. Files are public paths, not static
 * imports: imported files 404 behind the optimizer on Vercel (PLAYBOOK, 030 rework).
 */
export type Photo = { src: string; width: number; height: number };

export function ArtPhoto({
	wide,
	tall,
	alt,
	priority = false,
	className,
}: {
	wide: Photo;
	tall: Photo;
	alt: string;
	priority?: boolean;
	className?: string;
}) {
	const common = { alt, sizes: "100vw", quality: 75, priority };
	const { props: desktop } = getImageProps({ ...common, ...wide });
	const { props: mobile } = getImageProps({ ...common, ...tall });

	return (
		<picture>
			<source media="(width < 64rem)" srcSet={mobile.srcSet} sizes="100vw" />
			<img {...desktop} alt={alt} className={cn("absolute inset-0 size-full object-cover", className)} />
		</picture>
	);
}
