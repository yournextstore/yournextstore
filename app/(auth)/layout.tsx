import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4">
			<div className="mb-8">
				<Link href="/" className="text-2xl font-bold">
					Your Next Store
				</Link>
			</div>
			<div className="w-full max-w-sm">{children}</div>
		</div>
	);
}
