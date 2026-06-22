import { StretchFooter } from "@/components/sections/stretch-footer";
import { StretchHero } from "@/components/sections/stretch-hero";
import { StretchAnnouncementBar, StretchHeader } from "@/components/sections/stretch-topbar";

export default function StretchHeroDemo() {
	return (
		<main>
			<StretchAnnouncementBar />
			<div className="relative">
				<StretchHeader />
				<StretchHero />
			</div>
			<StretchFooter />
		</main>
	);
}
