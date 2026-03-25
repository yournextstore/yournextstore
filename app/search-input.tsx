"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { YnsLink } from "@/components/yns-link";

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("q");
		if (typeof query === "string" && query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, []);

	return (
		<>
			<form onSubmit={handleSubmit} className="hidden md:block">
				<div className="relative">
					<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search pieces, rooms, materials"
						defaultValue={searchParams.get("q") ?? ""}
						className="h-10 w-56 border border-border/80 bg-background px-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground/85 transition-colors focus:border-ring focus:outline-none lg:w-72"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="flex h-10 w-10 items-center justify-center border border-border/80 bg-background transition-colors hover:bg-[var(--surface-soft)] md:hidden"
				aria-label="Search"
			>
				<Search className="h-[1.125rem] w-[1.125rem]" />
			</YnsLink>
		</>
	);
}
