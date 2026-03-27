"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setPending(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const result = await signIn.email({ email, password });

			if (result.error) {
				setError(result.error.message ?? "Invalid email or password");
				setPending(false);
				return;
			}
		} catch {
			setError("Something went wrong. Please try again.");
			setPending(false);
			return;
		}

		router.push("/");
		router.refresh();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign in</CardTitle>
				<CardDescription>Enter your email and password to sign in to your account.</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="flex flex-col gap-4">
					{error && (
						<div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
					)}
					<div className="flex flex-col gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" name="email" type="email" placeholder="you@example.com" required />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" name="password" type="password" required />
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={pending}>
						{pending ? "Signing in..." : "Sign in"}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="text-primary underline-offset-4 hover:underline">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
