"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Below md the search lives in a sheet that drops from the top, as in the original. */
export function MobileSearch() {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Search"
				className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-accent md:hidden"
			>
				<SearchIcon className="size-4" />
			</SheetTrigger>
			<SheetContent side="top" className="gap-0 px-4 pt-12 pb-6">
				<SheetTitle className="sr-only">Search</SheetTitle>
				<SheetDescription className="sr-only">Search the store's products</SheetDescription>
				<MobileSearchInput onNavigate={() => setOpen(false)} />
			</SheetContent>
		</Sheet>
	);
}
