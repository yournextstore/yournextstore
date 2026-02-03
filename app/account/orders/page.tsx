import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MaterialIcon } from "@/components/icons/material-icon";
import { YnsLink } from "@/components/yns-link";

async function getUser() {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get("user");
	if (!userCookie?.value) return null;

	try {
		return JSON.parse(userCookie.value) as { email: string; name: string };
	} catch {
		return null;
	}
}

export default async function OrdersPage() {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-background-dark py-12">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-center gap-4 mb-8">
					<YnsLink href="/account" className="text-gray-400 hover:text-white transition-colors">
						<MaterialIcon name="arrow_back" />
					</YnsLink>
					<h1 className="text-2xl font-bold text-white">Order History</h1>
				</div>

				{/* Empty State */}
				<div className="bg-dark-accent border border-border rounded-xl p-12 text-center">
					<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
						<MaterialIcon name="receipt_long" className="text-primary text-3xl" />
					</div>
					<h2 className="text-xl font-medium text-white mb-2">No orders yet</h2>
					<p className="text-gray-400 mb-6">When you place orders, they will appear here.</p>
					<YnsLink
						href="/"
						className="inline-flex items-center gap-2 bg-primary hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
					>
						Start Shopping
						<MaterialIcon name="arrow_forward" />
					</YnsLink>
				</div>
			</div>
		</div>
	);
}
