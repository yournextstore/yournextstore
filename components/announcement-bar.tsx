import { YnsLink } from "@/components/yns-link";

export function AnnouncementBar() {
	return (
		<div className="bg-foreground text-background">
			<div className="mx-auto flex max-w-[1400px] items-center justify-center px-4 py-2 text-center sm:px-6 lg:px-10">
				<p className="text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs">
					<span className="text-zap">Every $5 spent is a chance to win $10,000</span>
					<span className="hidden sm:inline"> in YNS sweeps. </span>
					<span className="sm:hidden"> · </span>
					<YnsLink
						prefetch={"eager"}
						href="/faq"
						className="underline decoration-zap/60 underline-offset-4 transition-colors hover:text-zap"
					>
						YNS.COM/SWEEPS
					</YnsLink>
					<span className="text-zap"> for more info!</span>
				</p>
			</div>
		</div>
	);
}
