"use client";

import { Menu } from "@base-ui/react/menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortOption = { value: string; label: string };

/** "○ SORT: Newest" listbox from the original collection toolbar: an ink dropdown of uppercase options. */
export function HullSort({ options }: { options: readonly SortOption[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const defaultValue = options[0]?.value;
	const current = searchParams.get("sort") ?? defaultValue;
	const currentLabel = options.find((o) => o.value === current)?.label ?? options[0]?.label;

	const onChange = (value: unknown) => {
		if (typeof value !== "string") {
			return;
		}
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		if (value === defaultValue) {
			params.delete("sort");
		} else {
			params.set("sort", value);
		}
		router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
	};

	return (
		<Menu.Root modal={false}>
			<Menu.Trigger className="hull-indicator flex cursor-pointer items-center p-4 text-nav">
				<span className="mr-2 hidden font-semibold uppercase sm:inline">Sort:</span>
				<span className="sr-only sm:hidden">Sort: </span>
				{currentLabel}
			</Menu.Trigger>
			<Menu.Portal>
				<Menu.Positioner align="end" sideOffset={0} className="z-40 outline-none">
					<Menu.Popup className="hull-inverted bg-background p-2 whitespace-nowrap text-foreground outline-none">
						<Menu.RadioGroup value={current} onValueChange={onChange}>
							{options.map((option) => (
								<Menu.RadioItem
									key={option.value}
									value={option.value}
									className="cursor-pointer px-2 py-1 text-nav uppercase outline-none transition-colors data-[highlighted]:bg-foreground data-[highlighted]:text-background data-[checked]:underline"
								>
									{option.label}
								</Menu.RadioItem>
							))}
						</Menu.RadioGroup>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	);
}
