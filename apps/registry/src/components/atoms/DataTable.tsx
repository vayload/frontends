type Column = {
	key: string;
	label: string;
};

interface DataTableProps {
	columns: Column[];
	data: any[];
	className?: string;
}

export function DataTable({ columns, data, className = '' }: DataTableProps) {
	return (
		<div className={`overflow-x-auto ${className}`}>
			<table className="min-w-max w-full rounded-lg border-none">
				<thead className="bg-neutral-950 text-neutral-200">
					<tr className="border-b border-neutral-800">
						{columns.map((col) => (
							<th
								key={col.key}
								className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 px-4 py-3 border-b border-neutral-800"
							>
								{col.label}
							</th>
						))}
					</tr>
				</thead>

				<tbody className="divide-y divide-neutral-800">
					{data.map((row, i) => (
						<tr key={i} className="hover:bg-neutral-900/50 transition-colors border-b border-neutral-800">
							{columns.map((col) => (
								<td key={col.key} className="px-4 py-2 text-neutral-300 text-sm">
									{row[col.key]}
								</td>
							))}
						</tr>
					))}

					{data.length === 0 && (
						<tr>
							<td colSpan={columns.length} className="px-4 py-6 text-center text-neutral-500 text-sm">
								No hay datos para mostrar
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
