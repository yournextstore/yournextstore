import Image from "next/image";
import { cn, isOptimizableImage } from "@/lib/utils";

/** A full-bleed photograph for editorial slots; a plain tint when the store has no picture. */
export function EditorialImage({
	src,
	sizes,
	priority = false,
	className,
}: {
	src: string | null;
	sizes: string;
	priority?: boolean;
	className?: string;
}) {
	if (!src) return <div aria-hidden="true" className={cn("absolute inset-0 bg-secondary", className)} />;
	return (
		<Image
			src={src}
			alt=""
			fill
			sizes={sizes}
			priority={priority}
			unoptimized={!isOptimizableImage(src)}
			className={cn("object-cover object-center", className)}
		/>
	);
}
