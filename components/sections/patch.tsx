import { PatchPanel } from "@/components/rack/patch-panel";
import { SectionHead } from "@/components/rack/section-head";
import { getRackCatalog, plateName } from "@/lib/rack";

export async function Patch() {
	const { storeName } = await getRackCatalog();
	return (
		<section id="patch" className="section-x py-[clamp(4rem,9vw,7rem)]">
			<SectionHead
				kicker="Patch it"
				title="Wire it wrong. That's the right way."
				lead={
					<>
						Drag a cable from any <strong className="text-ink">OUT</strong> to any{" "}
						<strong className="text-ink">IN</strong>. Complete the classic circuit —
						source&nbsp;→&nbsp;level&nbsp;→ &nbsp;tone&nbsp;→&nbsp;output — and the beacon lights. Or ignore
						the manual and find something better; the pulse goes anywhere.
					</>
				}
			/>
			<div className="frame">
				<PatchPanel brand={plateName(storeName)} />
			</div>
		</section>
	);
}
