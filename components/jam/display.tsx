import Link from "next/link";
import { Packshot } from "@/components/packshot";
import { cn } from "@/lib/utils";

/** The original's large grey tile (home shelves, "All categories"): piece centred, big title, item count. */
export function DisplayMedium({
	href,
	title,
	subtitle,
	image,
	headingLevel = "h2",
	priority = false,
}: {
	href: string;
	title: string;
	subtitle: string;
	image: string | null;
	headingLevel?: "h2" | "h3";
	priority?: boolean;
}) {
	const Heading = headingLevel;
	return (
		<Link href={href} className="group block bg-stage p-8 pb-0 transition-colors hover:bg-stage-hover">
			<div className="flex h-56 items-center justify-center sm:h-64">
				<Packshot
					src={image}
					alt=""
					sizes="(max-width: 1024px) 60vw, 30vw"
					className="h-full transition-transform duration-500 group-hover:scale-[1.03]"
					priority={priority}
				/>
			</div>
			<div className="mt-4 mb-8">
				<Heading className="mb-1 text-3xl font-semibold tracking-[-0.01em] text-foreground">{title}</Heading>
				<p className="text-xs text-ink-soft">{subtitle}</p>
			</div>
		</Link>
	);
}

/** The original's small grey tile ("Trending Now", related products). */
export function DisplaySmall({
	href,
	title,
	subtitle,
	image,
	className,
}: {
	href: string;
	title: string;
	subtitle: string;
	image: string | null;
	className?: string;
}) {
	return (
		<Link
			href={href}
			className={cn(
				"group block bg-stage px-6 pt-10 pb-2 transition-colors hover:bg-stage-hover lg:p-6 lg:pb-0",
				className,
			)}
		>
			<div className="flex h-36 items-center justify-center">
				<Packshot
					src={image}
					alt=""
					sizes="(max-width: 1024px) 40vw, 12vw"
					className="h-full transition-transform duration-500 group-hover:scale-[1.04]"
				/>
			</div>
			<div className="mt-3">
				<h3 className="mb-1 text-xl font-semibold tracking-[-0.01em] text-foreground">{title}</h3>
				<p className="mb-4 text-xs text-ink-soft">{subtitle}</p>
			</div>
		</Link>
	);
}
