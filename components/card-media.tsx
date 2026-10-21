"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** The original card's photo with its round thumbnail switcher underneath. */
export function CardMedia({
	href,
	images,
	name,
	priority = false,
	sizes,
}: {
	href: string;
	images: string[];
	name: string;
	priority?: boolean;
	sizes: string;
}) {
	const [current, setCurrent] = useState(0);
	const src = images[current] ?? images[0];

	return (
		<>
			<Link
				href={href}
				className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100"
				aria-label={name}
			>
				{src && (
					<YNSMedia
						src={src}
						alt=""
						fill
						sizes={sizes}
						priority={priority}
						className="object-cover transition duration-700 group-hover:scale-[1.03]"
					/>
				)}
			</Link>
			{images.length > 1 && (
				<div className="mt-3 flex h-10 gap-2 overflow-hidden px-1">
					{images.map((image, index) => (
						<button
							key={image}
							type="button"
							onClick={() => setCurrent(index)}
							onMouseEnter={() => setCurrent(index)}
							aria-label={`Show photo ${index + 1} of ${name}`}
							aria-pressed={current === index}
							className={cn(
								"relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-offset-2 transition",
								current === index ? "ring-2 ring-violet" : "hover:ring-2 hover:ring-neutral-300",
							)}
						>
							<YNSMedia src={image} alt="" fill sizes="40px" className="object-cover" />
						</button>
					))}
				</div>
			)}
		</>
	);
}
