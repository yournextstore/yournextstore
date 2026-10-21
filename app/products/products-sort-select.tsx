"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";
import { sortOptions } from "@/lib/sort";

/** The original's plain bordered native select. Navigates to the first page of the new order. */
export function SortSelect({ basePath, current }: { basePath: string; current: string }) {
	const router = useRouter();
	const id = useId();

	return (
		<div className="flex items-center gap-3">
			<label htmlFor={id}>Sort by:</label>
			<select
				id={id}
				value={current}
				onChange={(event) => {
					const value = event.target.value;
					router.push(value === sortOptions[0].value ? basePath : `${basePath}?sort=${value}`, {
						scroll: false,
					});
				}}
				className="border border-black/40 bg-white px-2 py-1 text-sm"
			>
				{sortOptions.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
