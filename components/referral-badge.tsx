import { meGetCached } from "@/lib/commerce";
import { cn } from "@/lib/utils";

export async function ReferralBadge({ docked = false }: { docked?: boolean }) {
	let subdomain = "store";
	try {
		const { store } = await meGetCached();
		subdomain = store.subdomain;
	} catch {}

	const referralUrl = `https://yournextstore.com/?utm_source=yns-store&utm_medium=referral&utm_campaign=${subdomain}`;

	return (
		<a
			href={referralUrl}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				// Docked: positioned by the store-chat dock next to the launcher instead of pinning itself.
				docked ? "flex" : "fixed bottom-4 right-4 z-50 flex",
				"items-center gap-1.5 px-3 py-1.5 bg-background/90 backdrop-blur-sm border border-border rounded-md shadow-sm text-xs font-medium text-muted-foreground transition-all duration-200 hover:shadow-md hover:scale-101 no-underline",
			)}
		>
			<svg
				aria-hidden="true"
				className="size-3.5 fill-current"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="-5 -23.5 232 232"
			>
				<path d="M173.51 0C180.183 0.000207302 185.928 4.70988 187.238 11.2529L218.654 168.237C220.387 176.901 213.761 184.984 204.925 184.984H17.0854C8.24839 184.984 1.62124 176.898 3.35782 168.233L34.8217 11.249C36.1327 4.70771 41.8768 0 48.5482 0H173.51ZM74.0395 24.6611L80.184 55.4658H141.85L148.022 24.6611H74.0395Z" />
			</svg>
			<span>Made with YNS</span>
		</a>
	);
}
