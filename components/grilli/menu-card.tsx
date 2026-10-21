import Link from "next/link";
import type { MenuItem } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** One line of the original's menu: a rounded thumbnail, the name, a badge, a ruled run to the price. */
export function MenuCard({ item, headingLevel = 3 }: { item: MenuItem; headingLevel?: 3 | 4 }) {
	const Heading = headingLevel === 3 ? "h3" : "h4";
	const href = `/product/${item.slug}`;
	return (
		<div className="group flex items-start gap-5">
			<Link
				href={href}
				tabIndex={-1}
				aria-hidden="true"
				className="relative size-[100px] shrink-0 overflow-hidden rounded-[24px] bg-gold"
			>
				{item.image && (
					<YNSMedia
						src={item.image}
						alt=""
						fill
						sizes="100px"
						className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-70"
					/>
				)}
			</Link>
			<div className="min-w-0 flex-1">
				<div className="xs:flex xs:items-center xs:gap-[15px]">
					<Heading className="min-w-0 font-display text-title-3 break-words text-white">
						<Link href={href} className="transition-colors hover:text-gold">
							{item.name}
						</Link>
					</Heading>
					{item.badge && (
						<span className="mt-2.5 inline-block bg-gold px-2.5 font-display text-label-1 leading-[1.4] text-eerie uppercase xs:mt-0 xs:shrink-0">
							{item.badge}
						</span>
					)}
					<span aria-hidden="true" className="menu-rule" />
					<span className="my-2.5 flex shrink-0 items-baseline gap-2 font-display text-title-2 text-gold xs:my-0">
						{item.compareAt && (
							<del className="font-sans text-label-1 text-silver">
								<span className="sr-only">Was </span>
								{item.compareAt}
							</del>
						)}
						{item.price}
					</span>
				</div>
				{item.summary && (
					<p className="mt-1 line-clamp-2 text-label-1 leading-[1.6] text-silver">{item.summary}</p>
				)}
			</div>
		</div>
	);
}
