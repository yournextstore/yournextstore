"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";

export type SortChoice = { value: string; label: string; href: string };

/**
 * Native underlined select, as in the original catalogue. The hrefs are built on the server
 * (they carry every active filter), so this reads no search params and also renders, inert,
 * inside the listing's Suspense fallback.
 */
export function SortSelect({
	choices,
	current,
	disabled = false,
}: {
	choices: SortChoice[];
	current: string;
	disabled?: boolean;
}) {
	const router = useRouter();
	const id = useId();

	return (
		<div className="w-full shrink-0 lg:w-52">
			<label className="label mb-2.5 block" htmlFor={id}>
				Sort by
			</label>
			<select
				id={id}
				className="field mono cursor-pointer text-[0.8125rem]"
				value={current}
				disabled={disabled}
				onChange={(event) => {
					const choice = choices.find((c) => c.value === event.target.value);
					if (choice) router.push(choice.href, { scroll: false });
				}}
			>
				{choices.map((choice) => (
					<option key={choice.value} value={choice.value}>
						{choice.label}
					</option>
				))}
			</select>
		</div>
	);
}
