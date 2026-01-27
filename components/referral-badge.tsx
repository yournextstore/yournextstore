import { commerce } from "@/lib/commerce";

export async function ReferralBadge() {
	let subdomain = "store";
	try {
		const { store } = await commerce.meGet();
		subdomain = store.subdomain;
	} catch {}

	const referralUrl = `https://yournextstore.com/?utm_source=yns-store&utm_medium=referral&utm_campaign=${subdomain}`;

	return (
		<a
			href={referralUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-md shadow-sm text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-all duration-200 hover:shadow-md hover:scale-101 no-underline"
		>
			<svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 740">
				<path d="M129.5-.5h480c63.415 11.908 105.249 48.575 125.5 110a737.34 737.34 0 0 1 4.5 20v480c-11.88 63.39-48.547 105.223-110 125.5a737.34 737.34 0 0 1-20 4.5h-480C66.11 727.62 24.277 690.953 4 629.5a739.235 739.235 0 0 1-4.5-20v-480C11.382 66.108 48.049 24.275 109.5 4a739.235 739.235 0 0 1 20-4.5Z" />
				<path
					fill="#fefefe"
					d="M206.5 120.5h62a4038.157 4038.157 0 0 0 1.5 155 6516.604 6516.604 0 0 0 197.5.5 4.457 4.457 0 0 0 2-1.5 5968.962 5968.962 0 0 0 1-154h62c.331 72.571-.002 145.071-1 217.5-108.333.5-216.666.667-325 .5v-218Z"
				/>
			</svg>
			<span>Made with YNS</span>
		</a>
	);
}
