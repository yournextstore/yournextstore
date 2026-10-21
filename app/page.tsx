import type { Metadata } from "next";
import { HomeSections } from "@/components/sections/home";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return <HomeSections />;
}
