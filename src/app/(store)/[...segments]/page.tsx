import { MDXRemote } from "next-mdx-remote/rsc";
import * as Commerce from "commerce-kit";
import { notFound } from "next/navigation";
import Link, { type LinkProps } from "next/link";

export default async function Page({ params }: { params: { segments?: string[] } }) {
	const { config } = await Commerce.contextGet();

	if (!params.segments) {
		return notFound();
	}

	const path = `/${params.segments.join("/")}`;
	const page = config.pages[path];

	if (!page) {
		return notFound();
	}

	return (
		<div className="prose pb-8 pt-4 lg:prose-lg xl:prose-xl">
			<MDXRemote
				source={page.content}
				components={{
					a: (props) => <Link {...(props as LinkProps)} />,
				}}
			/>
		</div>
	);
}
