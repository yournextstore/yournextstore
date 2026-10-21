import { CartButton } from "@/app/cart-button";
import { BackButton } from "@/components/gf/back-button";
import { cn } from "@/lib/utils";

/**
 * The subpage header from the original: back · centred title · cart. Rendering it marks the
 * page with `data-subpage`, which hides the home "welcome" header (see globals.css).
 */
export function PageBar({
	title,
	asHeading = true,
	fallbackHref = "/",
	className,
}: {
	title: string;
	/** The title is the page's h1 unless the page renders its own (product page). */
	asHeading?: boolean;
	fallbackHref?: string;
	className?: string;
}) {
	const Title = asHeading ? "h1" : "p";
	return (
		<div data-subpage className={cn("flex items-center gap-3 pt-[30px]", className)}>
			<BackButton fallbackHref={fallbackHref} />
			<Title className="min-w-0 flex-1 truncate text-center text-gf-h3 font-bold">{title}</Title>
			<CartButton />
		</div>
	);
}

/** Same footprint as {@link PageBar} for Suspense fallbacks, so nothing moves when it lands. */
export function PageBarSkeleton() {
	return (
		<div data-subpage className="flex items-center gap-3 pt-[30px]">
			<div className="size-[50px] rounded-full bg-flash-white" />
			<div className="mx-auto h-[30px] w-40 rounded-full bg-flash-white" />
			<div className="size-[50px] rounded-full bg-flash-white" />
		</div>
	);
}
