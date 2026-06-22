"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

function withPreview(href: string, preview: boolean): string {
	if (!preview) return href;
	if (!href.startsWith("/") && !href.startsWith("#") && !href.startsWith("?")) return href;
	if (/[?&]preview=1\b/.test(href)) return href;
	if (href.startsWith("#")) return href;
	const separator = href.includes("?") ? "&" : "?";
	return `${href}${separator}preview=1`;
}

export const YnsLink = ({
	exactHrefMatch,
	activeClassName,
	className,
	prefetch,
	...props
}: Omit<ComponentPropsWithRef<typeof Link>, "prefetch"> & {
	exactHrefMatch?: boolean;
	activeClassName?: string;
	prefetch?: boolean | "eager";
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isPreview = searchParams.get("preview") === "1";

	const rawHref = typeof props.href === "string" ? props.href : props.href.href;
	const strHref = rawHref ? withPreview(rawHref, isPreview) : rawHref;

	const pathname = usePathname();
	const isActive =
		rawHref && (exactHrefMatch ? pathname === rawHref : pathname.startsWith(rawHref.split("?")[0] || ""));

	const conditionalPrefetch = () => {
		if (strHref && prefetch === "eager") {
			void router.prefetch(strHref);
		}
	};

	return (
		<Link
			{...props}
			href={strHref ?? props.href}
			prefetch={!!prefetch}
			className={cn(className, isActive && activeClassName)}
			{...(strHref &&
				prefetch === "eager" && {
					onMouseEnter: (e) => {
						conditionalPrefetch();
						return props.onMouseEnter?.(e);
					},
					onPointerEnter: (e) => {
						conditionalPrefetch();
						return props.onPointerEnter?.(e);
					},
					onTouchStart: (e) => {
						conditionalPrefetch();
						return props.onTouchStart?.(e);
					},
					onFocus: (e) => {
						conditionalPrefetch();
						return props.onFocus?.(e);
					},
				})}
		/>
	);
};
