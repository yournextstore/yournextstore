import type { Metadata } from "next";
import { Suspense } from "react";
import { ConferenceHero } from "@/components/sections/conference-hero";
import { TicketGrid, TicketGridSkeleton } from "@/components/sections/ticket-grid";
import { LineupSection } from "@/components/sections/why-attend";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<ConferenceHero />

			{/* Main Content Grid */}
			<section className="grid grid-cols-1 md:grid-cols-12 flex-grow">
				<LineupSection />
				<Suspense fallback={<TicketGridSkeleton />}>
					<TicketGrid />
				</Suspense>
			</section>
		</main>
	);
}
