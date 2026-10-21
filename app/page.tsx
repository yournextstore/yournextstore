import type { Metadata } from "next";
import { Divider, Hero, MaterialTiles, NewArrivals, Showcase } from "@/components/sections/home";
import { getCategoryShowcases } from "@/lib/catalog";
import { sentenceCase } from "@/lib/display";
import { EDITORIAL } from "@/lib/editorial";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every read below is cached, so the whole page prerenders with the shell and nothing
// streams in under the hero: no section boundaries, no layout shift.
export default async function Home() {
	const showcases = await getCategoryShowcases();
	const blocks = showcases.filter((showcase) => showcase.frames.length >= 2).slice(0, 4);
	const blockSlugs = new Set(blocks.map((block) => block.slug));
	const others = showcases.filter((showcase) => !blockSlugs.has(showcase.slug) && showcase.count > 1);
	const tiles = (others.length >= 2 ? others : showcases).slice(0, 3);
	const featured = showcases.slice(0, 3).map(({ name, slug }) => ({ name: sentenceCase(name), slug }));

	return (
		<>
			<Hero frames={EDITORIAL.hero} featured={featured} />
			<Divider />
			{blocks.map((showcase, index) => (
				<Showcase
					key={showcase.slug}
					showcase={showcase}
					index={index}
					photo={EDITORIAL.showcase[index % EDITORIAL.showcase.length] ?? null}
					textFirst={index % 2 === 0}
				/>
			))}
			<NewArrivals />
			<MaterialTiles tiles={tiles} />
		</>
	);
}
