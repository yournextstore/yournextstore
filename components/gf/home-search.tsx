"use client";

import type { ReactNode } from "react";
import { MobileSearchInput } from "@/components/search/mobile-search-input";

/** The home page's search well; suggestions drop under it, Enter opens /search. */
export function HomeSearch({ trailing }: { trailing?: ReactNode }) {
	return <MobileSearchInput onNavigate={() => {}} placeholder="Find something new" trailing={trailing} />;
}
