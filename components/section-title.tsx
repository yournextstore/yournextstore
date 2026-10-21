import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** GoCart's centred section title: heading, one line of copy and an optional green "View more". */
export function SectionTitle({
	title,
	description,
	href,
	as: Heading = "h2",
}: {
	title: string;
	description?: string;
	href?: string;
	as?: "h1" | "h2";
}) {
	return (
		<div className="flex flex-col items-center text-center">
			<Heading className="text-2xl font-semibold text-slate-800">{title}</Heading>
			<div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-slate-600">
				{description && <p className="max-w-lg">{description}</p>}
				{href && (
					<Link href={href} className="flex items-center gap-1 text-go-green-ink transition hover:gap-2">
						View more <ArrowRight className="size-3.5" aria-hidden />
					</Link>
				)}
			</div>
		</div>
	);
}
