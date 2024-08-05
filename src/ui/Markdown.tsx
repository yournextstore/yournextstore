import "server-only";

import { MDXRemote } from "next-mdx-remote/rsc";

export const Markdown = async ({ source }: { source: string }) => {
	return <MDXRemote source={source} options={{ mdxOptions: { format: "md" } }} />;
};
