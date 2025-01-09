"use client";

import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const inputClasses = cn(
	"appearance-none rounded-md absolute border bg-white py-2 pl-4 pr-10 w-9 opacity-0 transition-opacity ease-linear",
	"max-smb:focus:w-[calc(100vw-2rem)] max-smb:cursor-default max-smb:focus:left-4 max-smb:focus:z-20 max-smb:focus:opacity-100",
	"smb:opacity-100 smb:w-full smb:pl-4 smb:pr-10 smb:inline-block smb:static",
	"md:pl-2 md:pr-8 md:max-w-72",
	"lg:pl-4 lg:pr-10",
);

export const SearchInputPlaceholder = ({ placeholder }: { placeholder: string }) => {
	return (
		<Input
			className={cn("pointer-events-none", inputClasses)}
			placeholder={placeholder}
			type="search"
			aria-busy
			aria-disabled
		/>
	);
};

export const SearchInput = ({ placeholder }: { placeholder: string }) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const searchParamQuery = searchParams.get("q") ?? "";

	const [query, setQuery] = useState(searchParamQuery);
	const [_isQueryPending, debouncedQuery] = useDebouncedValue(query, 100);

	useEffect(() => {
		router.prefetch(`/search?q=${encodeURIComponent(query)}`);
	}, [query, router]);

	useEffect(() => {
		if (debouncedQuery) {
			router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false });
		}
	}, [debouncedQuery, router]);

	useEffect(() => {
		if (pathname === "/search" && !query) {
			router.push(`/`, { scroll: true });
		}
	}, [pathname, query, router]);

	useEffect(() => {
		if (pathname !== "/search") {
			setQuery("");
		}
	}, [pathname]);

	return (
		<Input
			onChange={(e) => {
				const query = e.target.value;
				setQuery(query);
			}}
			className={inputClasses}
			placeholder={placeholder}
			type="search"
			enterKeyHint="search"
			name="search"
			value={query}
		/>
	);
};
