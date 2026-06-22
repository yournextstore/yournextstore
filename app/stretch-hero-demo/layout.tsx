export default function StretchHeroDemoLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<style>{`
				body > div.flex.min-h-screen.flex-col > header.sticky.top-0.z-50 { display: none !important; }
				body > div.flex.min-h-screen.flex-col > footer { display: none !important; }
				body > div.flex.min-h-screen.flex-col [data-referral-badge],
				body > div.flex.min-h-screen.flex-col a[href*="yournextstore.com"] { display: none !important; }
			`}</style>
			{children}
		</>
	);
}
