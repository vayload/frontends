interface SkeletonProps {
	className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
	return <div className={`animate-pulse bg-neutral-800/50 rounded ${className}`} />;
};

export const SkeletonText = ({ lines = 1 }: { lines?: number }) => {
	return (
		<div className="space-y-2">
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton key={i} className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`} />
			))}
		</div>
	);
};

export const SkeletonTableRow = ({ columns, isTable }: { columns: number; isTable?: boolean }) => {
	if (isTable) {
		return (
			<tr className="animate-pulse">
				{Array.from({ length: columns }).map((_, i) => (
					<td key={i} className="px-4 py-3">
						<Skeleton className="h-4 w-full" />
					</td>
				))}
			</tr>
		);
	}

	return (
		<div className="animate-pulse">
			{Array.from({ length: columns }).map((_, i) => (
				<div key={i} className="px-4 py-3">
					<Skeleton className="h-4 w-full" />
				</div>
			))}
		</div>
	);
};

export const SkeletonCard = () => {
	return (
		<div className="bg-neutral-950/30 border border-neutral-800 border-dashed rounded-lg p-6 animate-pulse">
			<div className="flex items-center gap-4">
				<div className="w-12 h-12 bg-neutral-800/50 rounded-full" />
				<div className="flex-1">
					<Skeleton className="h-5 w-48 mb-2" />
					<Skeleton className="h-4 w-64" />
				</div>
			</div>
			<div className="mt-6">
				<Skeleton className="h-10 w-32" />
			</div>
		</div>
	);
};
