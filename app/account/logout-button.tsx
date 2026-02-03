"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/app/account/actions";
import { MaterialIcon } from "@/components/icons/material-icon";

export function LogoutButton() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleLogout = () => {
		startTransition(async () => {
			await logout();
			router.push("/");
			router.refresh();
		});
	};

	return (
		<button
			type="button"
			onClick={handleLogout}
			disabled={isPending}
			className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
		>
			<MaterialIcon name="logout" />
			{isPending ? "Logging out..." : "Log out"}
		</button>
	);
}
