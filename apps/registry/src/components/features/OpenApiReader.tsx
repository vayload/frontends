import React, { useState, useEffect } from 'react';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';
import { ChevronRight, Search, Globe, Lock, Box, Cpu, Send, Code, Layers } from 'lucide-react';

interface OpenApiSpec {
	openapi: string;
	info: {
		title: string;
		version: string;
		description?: string;
	};
	paths: Record<string, any>;
	components?: {
		schemas?: Record<string, any>;
	};
}

const MethodBadge = ({ method }: { method: string }) => {
	const colors: Record<string, string> = {
		get: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
		post: 'bg-green-500/10 text-green-400 border-green-500/20',
		put: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
		delete: 'bg-red-500/10 text-red-400 border-red-500/20',
		patch: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
	};

	return (
		<span
			className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
				colors[method.toLowerCase()] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
			}`}
		>
			{method}
		</span>
	);
};

const resolveSchema = (schema: any, components?: any): any => {
	if (!schema) return null;
	if (schema.$ref) {
		const refPath = schema.$ref.replace('#/components/schemas/', '');
		return components?.schemas?.[refPath] || { type: 'object', description: 'Reference not found' };
	}
	return schema;
};

const SchemaViewer = ({ schema, components, level = 0 }: { schema: any; components?: any; level?: number }) => {
	const resolved = resolveSchema(schema, components);
	if (!resolved) return <span className="text-neutral-600">void</span>;

	if (resolved.type === 'object' && resolved.properties) {
		return (
			<div className={`${level > 0 ? 'ml-4 border-l border-neutral-800 pl-4 mt-2' : ''} space-y-2`}>
				{Object.entries(resolved.properties).map(([key, prop]: [string, any]) => (
					<div key={key} className="text-xs group">
						<div className="flex items-baseline gap-2">
							<span className="font-mono text-orange-400 font-medium">{key}:</span>
							<span className="text-neutral-500 text-[10px] uppercase">{prop.type || 'any'}</span>
							{resolved.required?.includes(key) && (
								<span className="text-red-500/50 font-bold ml-1">*</span>
							)}
						</div>
						{prop.description && <p className="text-neutral-500 mt-0.5 italic">{prop.description}</p>}
						<SchemaViewer schema={prop} components={components} level={level + 1} />
					</div>
				))}
			</div>
		);
	}

	if (resolved.type === 'array' && resolved.items) {
		return (
			<div className={`${level > 0 ? 'ml-4 border-l border-neutral-800 pl-4 mt-2' : ''}`}>
				<span className="text-neutral-600 text-[10px] uppercase font-bold tracking-tighter">Array of:</span>
				<SchemaViewer schema={resolved.items} components={components} level={level + 1} />
			</div>
		);
	}

	return null;
};

export const OpenApiReader: React.FC<{ specUrl?: string; initialSpec?: OpenApiSpec }> = ({ specUrl, initialSpec }) => {
	const [spec, setSpec] = useState<OpenApiSpec | null>(initialSpec || null);
	const [loading, setLoading] = useState(!!specUrl);
	const [activePath, setActivePath] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [baseUrl, setBaseUrl] = useState('https://api.vayload.io/v2');
	const [execResult, setExecResult] = useState<any>(null);
	const [execLoading, setExecLoading] = useState(false);

	useEffect(() => {
		if (specUrl) {
			fetch(specUrl)
				.then((res) => res.json())
				.then((data) => {
					setSpec(data);
					setLoading(false);
				})
				.catch((err) => {
					console.error('Failed to fetch OpenAPI spec:', err);
					setLoading(false);
				});
		}
	}, [specUrl]);

	const handleTryItOut = async (endpoint: any) => {
		setExecLoading(true);
		setExecResult(null);
		const url = `${baseUrl.replace(/\/$/, '')}${endpoint.path}`;
		const start = Date.now();
		try {
			const response = await fetch(url, {
				method: endpoint.method.toUpperCase(),
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			});
			const elapsed = `${Date.now() - start}ms`;
			let data: any;
			try {
				data = await response.json();
			} catch {
				data = { message: await response.text() };
			}
			setExecResult({ status: response.status, time: elapsed, data, error: !response.ok });
		} catch (err: any) {
			const elapsed = `${Date.now() - start}ms`;
			// CORS or network error — fall back to sandbox mock
			setExecResult({
				status: 0,
				time: elapsed,
				error: true,
				data: { error: 'Network error or CORS blocked', message: err?.message, hint: `Target: ${url}` },
			});
		} finally {
			setExecLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center p-20 text-neutral-500 font-mono">
				<div className="animate-pulse flex items-center gap-3">
					<Cpu className="animate-spin" size={18} />
					Loading API Specification...
				</div>
			</div>
		);
	}

	if (!spec) {
		return (
			<div className="p-12 text-center bg-neutral-900/50 border border-dashed border-neutral-800 rounded-2xl">
				<p className="text-neutral-400 mb-4">No OpenAPI specification provided.</p>
			</div>
		);
	}

	const endpoints = Object.entries(spec.paths).flatMap(([path, methods]) =>
		Object.entries(methods).map(([method, details]: [string, any]) => ({
			path,
			method,
			summary: details.summary || details.description || path,
			tags: details.tags || [],
			operationId: details.operationId,
			details,
		})),
	);

	const filteredEndpoints = endpoints.filter(
		(e) =>
			e.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
			e.summary.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
			{/* Sidebar */}
			<aside className="w-full md:w-80 shrink-0 space-y-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
					<input
						type="text"
						placeholder="Search endpoints..."
						className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-neutral-200 focus:outline-none focus:border-orange-500/50 transition-colors"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className="space-y-1">
					<h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-2 px-3">
						Endpoints ({filteredEndpoints.length})
					</h4>
					<div className="space-y-0.5 custom-scrollbar max-h-[70vh] overflow-y-auto">
						{filteredEndpoints.map((endpoint, i) => (
							<button
								key={`${endpoint.path}-${endpoint.method}-${i}`}
								onClick={() => {
									setActivePath(`${endpoint.method}-${endpoint.path}`);
									setExecResult(null);
								}}
								className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all text-left ${
									activePath === `${endpoint.method}-${endpoint.path}`
										? 'bg-orange-500/10 border border-orange-500/20 text-white'
										: 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 border border-transparent'
								}`}
							>
								<MethodBadge method={endpoint.method} />
								<span className="truncate flex-1 font-mono">{endpoint.path}</span>
								<ChevronRight size={14} className="opacity-40" />
							</button>
						))}
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<section className="flex-1 space-y-12 min-w-0">
				{activePath ? (
					endpoints
						.filter((e) => `${e.method}-${e.path}` === activePath)
						.map((endpoint, i) => {
							const requestBody = endpoint.details.requestBody?.content?.['application/json']?.schema;
							const responses = endpoint.details.responses || {};

							return (
								<div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
									<div className="mb-8 p-6 bg-neutral-900/30 rounded-2xl border border-neutral-800">
										<div className="flex items-center gap-3 mb-4">
											<MethodBadge method={endpoint.method} />
											<h2 className="text-xl font-bold text-white font-mono break-all">
												{endpoint.path}
											</h2>
										</div>
										<p className="text-neutral-400 text-base leading-relaxed">{endpoint.summary}</p>
									</div>

									<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
										<div className="lg:col-span-12 space-y-10">
											{/* Request Configuration */}
											<div className="flex flex-col gap-4 p-6 bg-neutral-950 border border-neutral-800 rounded-xl">
												<div className="flex items-center justify-between">
													<h3 className="text-xs font-bold uppercase text-neutral-500 flex items-center gap-2">
														<Globe size={14} /> Base Location
													</h3>
													<Badge variant="outline" className="text-[10px]">
														PRODUCTION
													</Badge>
												</div>
												<input
													className="bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-xs text-orange-500 font-mono focus:outline-none focus:border-neutral-700 w-full"
													value={baseUrl}
													onChange={(e) => setBaseUrl(e.target.value)}
												/>
											</div>

											{/* Parameters */}
											{endpoint.details.parameters && (
												<section>
													<h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-4 flex items-center gap-2">
														<Box size={14} /> Parameters
													</h3>
													<div className="overflow-hidden border border-neutral-800 rounded-xl bg-neutral-900/20">
														<table className="w-full text-left text-xs">
															<thead className="bg-neutral-900/50 text-neutral-500">
																<tr>
																	<th className="px-4 py-3 font-semibold uppercase tracking-wider">
																		Name
																	</th>
																	<th className="px-4 py-3 font-semibold uppercase tracking-wider">
																		Location
																	</th>
																	<th className="px-4 py-3 font-semibold uppercase tracking-wider">
																		Description
																	</th>
																</tr>
															</thead>
															<tbody className="divide-y divide-neutral-800">
																{endpoint.details.parameters.map(
																	(param: any, pIdx: number) => (
																		<tr
																			key={pIdx}
																			className="hover:bg-neutral-800/10 transition-colors"
																		>
																			<td className="px-4 py-3">
																				<div className="flex flex-col">
																					<span className="font-mono text-orange-400">
																						{param.name}
																					</span>
																					{param.required && (
																						<span className="text-[9px] text-red-500/70 font-bold uppercase mt-0.5">
																							Required
																						</span>
																					)}
																				</div>
																			</td>
																			<td className="px-4 py-3">
																				<Badge className="bg-neutral-800 text-neutral-400 border-none scale-90 origin-left">
																					{param.in}
																				</Badge>
																			</td>
																			<td className="px-4 py-3 text-neutral-400 leading-relaxed font-sans">
																				{param.description || '-'}
																			</td>
																		</tr>
																	),
																)}
															</tbody>
														</table>
													</div>
												</section>
											)}

											{/* Request Body */}
											{requestBody && (
												<section>
													<h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-4 flex items-center gap-2">
														<Layers size={14} /> Request Body (JSON)
													</h3>
													<div className="p-6 bg-neutral-900/20 border border-neutral-800 rounded-xl">
														<SchemaViewer
															schema={requestBody}
															components={spec.components}
														/>
													</div>
												</section>
											)}

											{/* Responses */}
											<section>
												<h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-4 flex items-center gap-2">
													<Globe size={14} /> Response Options
												</h3>
												<div className="space-y-4">
													{Object.entries(responses).map(
														([code, resp]: [string, any], rIdx) => {
															const responseSchema =
																resp.content?.['application/json']?.schema;
															return (
																<Card
																	key={rIdx}
																	className="bg-neutral-900/20 border-neutral-800 p-0 overflow-hidden"
																>
																	<div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-800">
																		<span
																			className={`text-[10px] font-bold px-2 py-0.5 rounded ${
																				code.startsWith('2')
																					? 'bg-green-500/10 text-green-400'
																					: 'bg-red-500/10 text-red-400'
																			}`}
																		>
																			{code}
																		</span>
																		<span className="text-xs font-medium text-neutral-300">
																			{resp.description}
																		</span>
																	</div>
																	{responseSchema && (
																		<div className="px-6 py-4">
																			<SchemaViewer
																				schema={responseSchema}
																				components={spec.components}
																			/>
																		</div>
																	)}
																</Card>
															);
														},
													)}
												</div>
											</section>

											{/* Try it out Section */}
											<section className="pt-6 border-t border-neutral-800">
												<div className="flex items-center justify-between mb-6">
													<h3 className="text-xs font-bold uppercase tracking-widest text-neutral-600 flex items-center gap-2">
														<Cpu size={14} /> Interactive Shell
													</h3>
													<button
														onClick={() => handleTryItOut(endpoint)}
														disabled={execLoading}
														className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-orange-950/20"
													>
														{execLoading ? (
															<Cpu className="animate-spin" size={14} />
														) : (
															<Send size={14} />
														)}
														{execLoading ? 'Executing...' : 'Run Request'}
													</button>
												</div>

												{execResult && (
													<div className="animate-in zoom-in-95 fade-in duration-300">
														<div className="flex items-center gap-4 mb-3 text-[10px] font-mono font-bold uppercase">
															<span
																className={
																	execResult.error
																		? 'text-red-400'
																		: 'text-emerald-500'
																}
															>
																{execResult.status > 0
																	? `Status: ${execResult.status}`
																	: 'Network / CORS Error'}
															</span>
															<span className="text-neutral-600">
																Time: {execResult.time}
															</span>
														</div>
														<div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl relative">
															<div className="flex items-center justify-between px-5 py-2.5 border-b border-neutral-800">
																<span className="text-[10px] font-mono text-neutral-600 uppercase font-bold">
																	Response Body
																</span>
																<Code size={14} className="text-neutral-700" />
															</div>
															<pre className="p-6 text-[12px] font-mono text-neutral-300 overflow-x-auto custom-scrollbar leading-relaxed">
																{JSON.stringify(execResult.data, null, 2)}
															</pre>
														</div>
													</div>
												)}
											</section>
										</div>
									</div>
								</div>
							);
						})
				) : (
					<div className="flex flex-col items-center justify-center h-[500px] text-center bg-neutral-900/10 border border-dashed border-neutral-800/50 rounded-2xl p-12">
						<div className="size-20 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mb-8 text-neutral-700 shadow-2xl">
							<Box size={36} />
						</div>
						<h3 className="text-xl font-bold text-white mb-3">Vayload API Sandbox</h3>
						<p className="text-neutral-500 max-w-sm leading-relaxed text-sm">
							Choose an endpoint from the technical reference sidebar to inspect schemas, headers, and
							execute live test requests against the sandbox environment.
						</p>
					</div>
				)}
			</section>
		</div>
	);
};
