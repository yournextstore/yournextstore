"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";

export function AuthButton() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	if (isPending) {
		return <Button variant="ghost" size="icon-sm" disabled aria-label="Loading" />;
	}

	if (!session) {
		return (
			<Button variant="ghost" size="sm" asChild>
				<Link href="/login">Sign in</Link>
			</Button>
		);
	}

	const handleSignOut = async () => {
		await signOut();
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon-sm" aria-label="User menu">
					<User />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{session.user.name || session.user.email}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOut />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
