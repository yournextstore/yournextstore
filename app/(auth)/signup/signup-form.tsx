"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

export function SignupForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setPending(true);

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const result = await signUp.email({ name, email, password });

			if (result.error) {
				setError(result.error.message ?? "Could not create account");
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
				<CardTitle>Create an account</CardTitle>
				<CardDescription>Enter your details to create a new account.</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="flex flex-col gap-4">
					{error && (
						<div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
					)}
					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" name="name" type="text" placeholder="Your name" required />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" name="email" type="email" placeholder="you@example.com" required />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" name="password" type="password" minLength={8} required />
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={pending}>
						{pending ? "Creating account..." : "Create account"}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="text-primary underline-offset-4 hover:underline">
							Sign in
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
