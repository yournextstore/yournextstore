import type { ReactNode } from "react";

export function FeatureBanner({ heading, text, icon }: { heading: string; text: string; icon: ReactNode }) {
	return (
		<div className="flex flex-col gap-3 rounded-md border border-border bg-secondary p-6">
			<div>{icon}</div>
			<div>
				<h3 className="text-xl font-semibold">{heading}</h3>
				<p>{text}</p>
			</div>
		</div>
	);
}
