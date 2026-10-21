/** Placeholder for archive pages that stream behind params: the hero and the rail/grid frame. */
export function ArchiveSkeleton({ heroOnly = false }: { heroOnly?: boolean }) {
	return (
		<div className="mx-auto min-h-svh max-w-[1240px] px-4 sm:px-6" aria-busy>
			<div className="flex flex-wrap items-center gap-x-6 gap-y-3.5 border-b border-line pb-6 pt-7 sm:gap-x-12 sm:gap-y-7 sm:pb-9 sm:pt-14">
				<div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
					<div className="h-3 w-28 bg-tint" />
					<div className="h-11 w-3/4 bg-tint" />
					<div className="h-16 w-full max-w-[54ch] bg-tint" />
				</div>
				<div className="flex min-w-0 flex-[1_1_360px] gap-3 overflow-hidden pb-4">
					{[0, 1, 2].map((key) => (
						<div
							key={key}
							className="hatch aspect-[3/4] w-[64%] flex-none border border-line sm:w-auto sm:flex-1"
						/>
					))}
				</div>
			</div>
			{heroOnly ? null : (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-x-[30px] gap-y-10 pt-8 lg:ml-[312px]">
					{[0, 1, 2].map((key) => (
						<div key={key} className="hatch aspect-[3/4] border border-line" />
					))}
				</div>
			)}
		</div>
	);
}
