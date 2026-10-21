import { PitchRail } from "@/components/field/pitch-rail";
import { SectionHead } from "@/components/field/section-head";
import { GRID_REFS } from "@/lib/field";

export function Pitch() {
	return (
		<section id="pitch" className="section-x section-y scroll-mt-16">
			<SectionHead
				gridRef={GRID_REFS[2]}
				eyebrow="CAMP TO CAMP"
				title={
					<>
						Six stops
						<br />
						on a day in the hills.
					</>
				}
				lead="Where the kit actually goes, from the first brew at the tent door to the last light over camp. Follow the rail — it advances on its own, or jump to any stop."
			/>
			<PitchRail />
		</section>
	);
}
