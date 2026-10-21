"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type LookItem = { id: string; name: string; href: string; image: string | null; price: string | null };

// Hotspot positions on the scene, as percentages (the original places them by hand per image).
const SPOTS = [
	{ left: 38, top: 62 },
	{ left: 69, top: 46 },
	{ left: 80, top: 19 },
];

/**
 * A wide scene with round "+" hotspots; each opens a small product card on hover, focus or tap.
 */
export function ShopTheLook({ image, items }: { image: string; items: LookItem[] }) {
	const [open, setOpen] = useState<string | null>(null);

	return (
		<div className="relative aspect-4/5 overflow-hidden rounded-md bg-secondary sm:aspect-16/9">
			<YNSMedia src={image} alt="" fill sizes="100vw" className="object-cover" />
			{items.map((item, index) => {
				const spot = SPOTS[index % SPOTS.length] ?? { left: 50, top: 50 };
				const isOpen = open === item.id;
				return (
					<div
						key={item.id}
						className="group/spot absolute -translate-x-1/2 -translate-y-1/2"
						style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
					>
						<button
							type="button"
							aria-expanded={isOpen}
							aria-label={`Show ${item.name}`}
							onClick={() => setOpen(isOpen ? null : item.id)}
							onFocus={() => setOpen(item.id)}
							className="relative inline-flex size-8 items-center justify-center rounded-md bg-white text-foreground shadow-md"
						>
							<span
								aria-hidden
								className="absolute inset-0 animate-ping rounded-md bg-white/50 motion-reduce:hidden"
							/>
							<PlusIcon aria-hidden className="relative size-4" strokeWidth={1.5} />
						</button>
						<div
							className={cn(
								"absolute bottom-full left-1/2 z-10 mb-3 w-60 -translate-x-1/2 transition-opacity",
								spot.left > 70 && "right-0 left-auto translate-x-0",
								isOpen
									? "visible opacity-100"
									: "invisible opacity-0 group-hover/spot:visible group-hover/spot:opacity-100",
							)}
						>
							<Link
								href={item.href}
								className="flex items-center gap-3 rounded-md bg-white p-2.5 text-foreground shadow-lg"
								onFocus={() => setOpen(item.id)}
							>
								<span className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-secondary">
									{item.image && (
										<YNSMedia src={item.image} alt="" fill sizes="56px" className="object-cover" />
									)}
								</span>
								<span className="min-w-0">
									<span className="block text-body-sm line-clamp-2">{item.name}</span>
									{item.price && (
										<span className="mt-1 block text-body-sm text-muted-foreground">{item.price}</span>
									)}
								</span>
							</Link>
						</div>
					</div>
				);
			})}
		</div>
	);
}
