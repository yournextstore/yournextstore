import { ProcessStepper } from "@/components/brew/process-stepper";
import { SectionHead } from "@/components/brew/section-head";

export function Process() {
	return (
		<section id="process" className="section-x section-y scroll-mt-16">
			<SectionHead
				eyebrow="How it works"
				title={
					<>
						Shelf to order, <em>in six moves.</em>
					</>
				}
				lead="Choosing a machine should be as measured as pulling a shot. Each step shows its numbers before you take it, from the first spec sheet to the order page."
			/>
			<ProcessStepper />
		</section>
	);
}
