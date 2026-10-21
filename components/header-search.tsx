"use client";

import { ChevronDown, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId } from "react";
import type { NavCategory } from "@/lib/catalog";

/** Category select + query + green button, as in the original header. No URL reads: it stays in the shell. */
export function HeaderSearch({ categories }: { categories: NavCategory[] }) {
	const router = useRouter();
	const id = useId();

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const q = String(data.get("q") ?? "").trim();
		const category = String(data.get("category") ?? "");
		if (!q) {
			router.push(category ? `/category/${category}` : "/products");
			return;
		}
		const params = new URLSearchParams({ q });
		if (category) {
			params.set("category", category);
		}
		router.push(`/search?${params}`);
	};

	return (
		<search className="w-full">
			<form onSubmit={onSubmit} action="/search" className="flex h-10 w-full items-stretch">
				<div className="relative w-24 shrink-0 sm:w-[140px]">
					<label htmlFor={`${id}-category`} className="sr-only">
						Category
					</label>
					<select
						id={`${id}-category`}
						name="category"
						defaultValue=""
						className="h-full w-full appearance-none truncate rounded-l-md border border-r-0 border-input bg-background py-0 pr-8 pl-3 text-sm text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
					>
						<option value="">All</option>
						{categories.map((category) => (
							<option key={category.id} value={category.slug}>
								{category.name}
							</option>
						))}
					</select>
					<ChevronDown
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
					/>
				</div>
				<label htmlFor={`${id}-q`} className="sr-only">
					Search products
				</label>
				<input
					id={`${id}-q`}
					type="search"
					name="q"
					placeholder="Search..."
					autoComplete="off"
					className="h-full min-w-0 flex-1 border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
				/>
				<button
					type="submit"
					aria-label="Search"
					className="flex w-10 shrink-0 items-center justify-center rounded-r-md bg-[var(--footer)] text-[var(--footer-foreground)] transition-opacity hover:opacity-90 dark:bg-primary dark:text-primary-foreground"
				>
					<SearchIcon className="size-4" />
				</button>
			</form>
		</search>
	);
}
