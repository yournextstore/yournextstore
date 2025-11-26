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
			<form onSubmit={handleSubmit} className="hidden sm:block">
				<div className="relative">
					<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						ref={inputRef}
						type="search"
						name="q"
						placeholder="Search..."
						defaultValue={searchParams.get("q") ?? ""}
						className="h-9 w-48 rounded-full border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					/>
				</div>
			</form>
			<YnsLink
				href="/search"
				className="p-2 hover:bg-secondary rounded-full transition-colors sm:hidden"
				aria-label="Search"
			>
				<Search className="w-6 h-6" />
			</YnsLink>
		</>
	);
}
