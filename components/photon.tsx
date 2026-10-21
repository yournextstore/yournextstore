import Link from "next/link";
import type { ReactNode } from "react";
import type { CollectionTile } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * Photon's editorial block: a full-bleed colour field or photograph (16:9 → 4:3 → 1:1) with
 * its copy hung from the vertical midline, flush left at the half-ch inset.
 */
export function EditorialBlock({
	className,
	image,
	grayscale = false,
	tint = true,
	priority = false,
	children,
}: {
	className?: string;
	image?: string | null;
	grayscale?: boolean;
	/** darkens the photo for white type; off when dark type sits on a light photo */
	tint?: boolean;
	priority?: boolean;
	children: ReactNode;
}) {
	return (
		<section className={cn("photon-block", className)}>
			{image && (
				<>
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="100vw"
						priority={priority}
						className={cn("object-cover", grayscale && "grayscale contrast-125")}
					/>
					{tint && <div aria-hidden className="absolute inset-0 bg-black/25" />}
				</>
			)}
			<div className="absolute inset-x-0 top-1/2 max-w-[60rem] p-[var(--main-padding)]">{children}</div>
		</section>
	);
}

/** A collection as a tall full-bleed photograph, its name set in difference blend at the midline. */
export function CollectionBlock({ tile, priority = false }: { tile: CollectionTile; priority?: boolean }) {
	return (
		<Link
			href={tile.href}
			className="relative block h-[80vh] overflow-hidden bg-black text-white max-md:h-[70vh] hover:no-underline"
		>
			{tile.image && (
				<YNSMedia src={tile.image} alt="" fill sizes="100vw" priority={priority} className="object-cover" />
			)}
			<h2 className="absolute top-1/2 left-0 z-10 p-[var(--main-padding)] text-photon-title mix-blend-difference">
				{tile.name}
			</h2>
		</Link>
	);
}

/** The black "All …" block that heads Photon's collections list. */
export function AllBlock({ href, label, className }: { href: string; label: string; className?: string }) {
	return (
		<Link
			href={href}
			className={cn("relative block h-[80vh] bg-black text-white max-md:h-[70vh]", className)}
		>
			<span className="absolute top-1/2 left-0 p-[var(--main-padding)] text-photon-title">{label}</span>
		</Link>
	);
}
