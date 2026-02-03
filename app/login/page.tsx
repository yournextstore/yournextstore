import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
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

export default async function LoginPage() {
	const user = await getUser();

	if (user) {
		redirect("/account");
	}

	return (
		<div className="min-h-screen bg-background-dark py-12 flex items-center">
			<div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
				{/* Header */}
				<div className="text-center mb-8">
					<YnsLink href="/" className="inline-flex items-center gap-2 mb-6">
						<MaterialIcon name="spa" className="text-primary text-4xl" />
						<span className="text-2xl font-bold text-white">Cannabo</span>
					</YnsLink>
					<h1 className="text-2xl font-bold text-white">Welcome back</h1>
					<p className="text-gray-400 mt-2">Sign in to your account</p>
				</div>

				{/* Login Form */}
				<div className="bg-dark-accent border border-border rounded-xl p-6">
					<LoginForm />
				</div>

				{/* Register Link */}
				<p className="text-center text-gray-400 mt-6">
					Don&apos;t have an account?{" "}
					<YnsLink href="/register" className="text-primary hover:text-green-400 transition-colors">
						Sign up
					</YnsLink>
				</p>
			</div>
		</div>
	);
}
