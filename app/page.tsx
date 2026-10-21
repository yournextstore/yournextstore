import type { Metadata } from "next";
import { AboutStrip, Benefits, CollectionNotes, Featured, Hero, HowItWorks } from "@/components/garden/home";
import { Newsletter } from "@/components/sections/newsletter";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section is a cached read, rendered without its own Suspense boundary so the whole
// page lands in the prerendered shell (no streamed segments, no layout shift).
export default function Home() {
	return (
		<>
			<Hero />
			<Benefits />
			<AboutStrip />
			<Featured />
			<HowItWorks />
			<CollectionNotes />
			<Newsletter />
		</>
	);
}
