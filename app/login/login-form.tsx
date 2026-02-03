"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { login } from "@/app/account/actions";
import { MaterialIcon } from "@/components/icons/material-icon";

export function LoginForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		startTransition(async () => {
			const result = await login(email, password);
			if (result.success) {
				router.push("/account");
				router.refresh();
			} else {
				setError(result.error || "Login failed");
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
					{error}
				</div>
			)}

			<div>
				<label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
					Email
				</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					className="w-full bg-background-dark border border-border rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
					Password
				</label>
				<div className="relative">
					<input
						type={showPassword ? "text" : "password"}
						id="password"
						name="password"
						required
						className="w-full bg-background-dark border border-border rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						placeholder="Enter your password"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
					>
						<MaterialIcon name={showPassword ? "visibility_off" : "visibility"} className="text-xl" />
					</button>
				</div>
			</div>

			<button
				type="submit"
				disabled={isPending}
				className="w-full bg-primary hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isPending ? "Signing in..." : "Sign in"}
			</button>
		</form>
	);
}
