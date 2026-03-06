"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type SearchFormProps = {
	initialQuery?: string;
};

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [query, setQuery] = useState(initialQuery);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = query.trim();
		if (trimmed) {
			startTransition(() => {
				router.push(`/search?q=${encodeURIComponent(trimmed)}`);
			});
		}
	}

	return (
		<form onSubmit={handleSubmit} className="relative max-w-xl w-full">
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
				<input
					type="search"
					name="q"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search products..."
					className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
					autoComplete="off"
				/>
			</div>
			{isPending && (
				<div className="absolute right-4 top-1/2 -translate-y-1/2">
					<div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</form>
	);
}
