import Link from "next/link";
import { Fragment } from "react";

type Crumb = { href?: string; label: string };

/**
 * The lilac band listing pages open on, carrying the original hero's colour and type down to the
 * pages it never had. `data-band` turns the header lilac above it.
 */
export function ListingBand({
	title,
	crumbs,
	description,
	children,
}: {
	title: string;
	crumbs: Crumb[];
	description?: string | null;
	children?: React.ReactNode;
}) {
	return (
		<section data-band className="relative overflow-hidden bg-lilac pt-10 pb-14 md:pt-16 md:pb-20">
			<div className="sp-container relative">
				<nav aria-label="Breadcrumb">
					<ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold uppercase">
						{crumbs.map((crumb, index) => (
							<Fragment key={`${crumb.label}-${index}`}>
								{index > 0 && <li aria-hidden="true">/</li>}
								<li className="min-w-0">
									{crumb.href ? (
										<Link href={crumb.href} className="underline-offset-4 hover:underline">
											{crumb.label}
										</Link>
									) : (
										<span aria-current="page" className="line-clamp-1">
											{crumb.label}
										</span>
									)}
								</li>
							</Fragment>
						))}
					</ol>
				</nav>
				<h1 className="font-title mt-5 text-sp-3 break-words md:text-sp-3-md">{title}</h1>
				{description && <p className="mt-5 max-w-2xl text-sp-8 leading-[1.8]">{description}</p>}
				{children}
			</div>
		</section>
	);
}
