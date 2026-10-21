import Link from "next/link";
import { ArrowLongRightIcon } from "@/components/icons";

/** The uppercase statement line under the hero, with its underlined "Find out more". */
export function Statement() {
	return (
		<section className="px-6 pt-12 pb-12 sm:px-12 sm:pt-24 sm:pb-16">
			<p className="mx-auto max-w-[53rem] text-center text-display-1 uppercase">
				Good skin is a daily ritual, and every ritual begins with a little care.
			</p>
			<div className="mt-4 flex justify-center">
				<Link href="/about" className="arrow-link">
					Find out more
					<ArrowLongRightIcon className="size-6" />
				</Link>
			</div>
		</section>
	);
}
