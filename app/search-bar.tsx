"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
	const [query, setQuery] = useState("");
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full md:w-[400px] relative group">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="w-full pl-6 pr-12 py-3 bg-card rounded-full border-none shadow-soft focus:ring-2 focus:ring-primary text-sm transition-all outline-none text-foreground placeholder-muted-foreground"
				placeholder="Search products..."
			/>
			<button
				type="submit"
				className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center transition-transform group-hover:scale-105 hover:bg-foreground/90"
			>
				<Search className="w-4 h-4" />
			</button>
		</form>
	);
}
