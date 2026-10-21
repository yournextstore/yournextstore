import type { Metadata } from "next";
import {
	AtAGlance,
	BeforeYouGo,
	FindYourWay,
	HouseNotes,
	InfoBar,
	Masthead,
	RoomGallery,
	ShelfMenu,
	Tagline,
} from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// The original's single page, section for section. Every section is a cached read rendered
// without its own Suspense boundary, so the whole page lands in the prerendered shell.
export default function Home() {
	return (
		<>
			<Masthead />
			<InfoBar />
			<Tagline />
			<AtAGlance />
			<ShelfMenu />
			<RoomGallery />
			<FindYourWay />
			<HouseNotes />
			<BeforeYouGo />
		</>
	);
}
