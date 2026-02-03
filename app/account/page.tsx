import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/app/account/logout-button";
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

export default async function AccountPage() {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-background-dark py-12">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
						<MaterialIcon name="person" className="text-primary text-4xl" />
					</div>
					<h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
					<p className="text-gray-400 mt-2">{user.email}</p>
				</div>

				{/* Account Menu */}
				<div className="grid gap-4">
					<YnsLink
						href="/account/orders"
						className="bg-dark-accent border border-border rounded-xl p-6 flex items-center gap-4 hover:border-primary/50 transition-colors group"
					>
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<MaterialIcon name="shopping_bag" className="text-primary text-xl" />
						</div>
						<div className="flex-1">
							<h3 className="text-white font-medium group-hover:text-primary transition-colors">
								Order History
							</h3>
							<p className="text-gray-400 text-sm">View your past orders</p>
						</div>
						<MaterialIcon name="chevron_right" className="text-gray-500" />
					</YnsLink>

					<div className="bg-dark-accent border border-border rounded-xl p-6 flex items-center gap-4">
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<MaterialIcon name="location_on" className="text-primary text-xl" />
						</div>
						<div className="flex-1">
							<h3 className="text-white font-medium">Addresses</h3>
							<p className="text-gray-400 text-sm">Manage shipping addresses</p>
						</div>
						<span className="text-gray-500 text-sm">Coming soon</span>
					</div>

					<div className="bg-dark-accent border border-border rounded-xl p-6 flex items-center gap-4">
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<MaterialIcon name="settings" className="text-primary text-xl" />
						</div>
						<div className="flex-1">
							<h3 className="text-white font-medium">Account Settings</h3>
							<p className="text-gray-400 text-sm">Update your profile</p>
						</div>
						<span className="text-gray-500 text-sm">Coming soon</span>
					</div>
				</div>

				{/* Logout */}
				<div className="mt-8 text-center">
					<LogoutButton />
				</div>
			</div>
		</div>
	);
}
