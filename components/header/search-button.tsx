"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { headerIconButton } from "@/components/header/icon-button";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/** The original's search: a round button that opens a command-style dialog. */
export function SearchButton() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button type="button" className={headerIconButton} aria-label="Search products">
					<Search aria-hidden="true" className="size-4" />
				</button>
			</DialogTrigger>
			<DialogContent className="top-[12%] translate-y-0 grid-cols-1 gap-0 p-4 sm:max-w-lg">
				<DialogTitle className="sr-only">Search</DialogTitle>
				<DialogDescription className="sr-only">Search the catalogue by product name</DialogDescription>
				<div className="min-w-0 pr-8">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
