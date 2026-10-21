"use client";

import Link from "next/link";
import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { chipClass, sortSelectClass } from "@/components/njx/catalog-styles";

type SortOption = { value: string; label: string };

// Build a sort href that preserves every active filter and resets to the first page.
function buildSortHref(
	searchParams: ReadonlyURLSearchParams,
	pathname: string,
	value: string,
	defaultValue: string | undefined,
): string {
	const params = new URLSearchParams(searchParams.toString());
	// Any sort change keeps the result set but reorders it — return to the first page.
	params.delete("page");
	if (value === defaultValue) {
		params.delete("sort");
	} else {
		params.set("sort", value);
	}
	return params.size ? `${pathname}?${params}` : pathname;
}

/** The original's labelled native sort select. Reads the current sort from the URL. */
export function SortSelect({ options }: { options: readonly SortOption[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;

	return (
		<label className="flex shrink-0 items-center gap-2 text-[13px] text-muted-foreground">
			Sort
			<select
				value={current}
				onChange={(e) =>
					router.push(buildSortHref(searchParams, pathname, e.target.value, defaultValue), { scroll: false })
				}
				className={sortSelectClass}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</label>
	);
}

/** Category chips over the full catalogue; "All" clears the category filter. */
export function CategoryChips({ categories }: { categories: { slug: string; name: string }[] }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const current = searchParams.get("category");

	const hrefFor = (slug: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		if (slug) params.set("category", slug);
		else params.delete("category");
		return params.size ? `${pathname}?${params}` : pathname;
	};

	return (
		<>
			<Link
				href={hrefFor(null)}
				aria-current={current ? undefined : "page"}
				className={chipClass}
				scroll={false}
			>
				All
			</Link>
			{categories.map((category) => (
				<Link
					key={category.slug}
					href={hrefFor(category.slug)}
					aria-current={current === category.slug ? "page" : undefined}
					className={chipClass}
					scroll={false}
				>
					{category.name}
				</Link>
			))}
		</>
	);
}
