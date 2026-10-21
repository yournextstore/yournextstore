import type { Metadata } from "next";
import { HomeHero, HomeMosaic, HomeShelves } from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<HomeHero />
			<HomeShelves />
			<HomeMosaic />
		</>
	);
}
