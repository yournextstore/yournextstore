import { ShirtIcon } from "lucide-react";
import { LoginForm } from "@/ui/login-form";

export default function LoginPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-50 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<ShirtIcon className="size-4" />
					</div>
					ACME Inc.
				</a>
				<LoginForm />
			</div>
		</div>
	);
}
