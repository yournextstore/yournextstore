import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { InstagramWall } from "@/components/sections/instagram-wall";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Story } from "@/components/sections/story";
import { TeaClub } from "@/components/sections/tea-club";
import { TrustStrip } from "@/components/sections/trust-strip";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<TrustStrip />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Flagship blends"
				description="Single-garden leaves, slow-oxidised and packed within seven days of harvest."
				limit={3}
			/>
			<Story />
			<TeaClub />
			<Press />
			<About />
			<InstagramWall />
			<Newsletter />
		</>
	);
}
