import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * GoCart's lowercase wordmark with the oversized green full stop. A two-word store name gets the
 * original's two-tone treatment (first word green); one word stays slate.
 */
export function Wordmark({ name, className }: { name: string; className?: string }) {
	const [first, ...rest] = name.trim().split(/\s+/);
	return (
		<Link
			href="/"
			aria-label={`${name} home`}
			className={cn(
				"inline-block whitespace-nowrap text-4xl font-semibold lowercase text-slate-700",
				className,
			)}
		>
			{rest.length > 0 ? (
				<>
					<span className="text-go-green">{first}</span>
					{rest.join(" ")}
				</>
			) : (
				first
			)}
			<span className="text-[1.33em] leading-0 text-go-green">.</span>
		</Link>
	);
}
