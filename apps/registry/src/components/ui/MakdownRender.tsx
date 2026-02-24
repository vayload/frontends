import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ShikiHighlighter, { isInlineCode } from 'react-shiki';
import vayloadDarkShiki from '@shiki/theme-vayload';

const CodeHighlight = ({ className, children, node, ...props }: any) => {
	const code = String(children).trim();
	const match = className?.match(/language-(\w+)/);
	const language = match ? match[1] : undefined;
	const isInline = node ? isInlineCode(node) : undefined;

	return !isInline ? (
		<ShikiHighlighter language={language} theme={vayloadDarkShiki} {...props} className="bg-vayload-bg-card">
			{code}
		</ShikiHighlighter>
	) : (
		<code className={className} {...props}>
			{code}
		</code>
	);
};

interface MarkdownRendererProps {
	content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				h1: ({ children }) => (
					<h1 className="text-2xl font-bold text-neutral-100 mb-4 border-b border-neutral-800 pb-2">
						{children}
					</h1>
				),
				h2: ({ children }) => <h2 className="text-xl font-semibold text-neutral-100 mt-6 mb-3">{children}</h2>,
				h3: ({ children }) => <h3 className="text-lg font-semibold text-orange-400 mt-5 mb-2">{children}</h3>,
				p: ({ children }) => <p className="mb-4 text-neutral-300">{children}</p>,
				a: ({ href, children }) => (
					<a
						href={href}
						target="_blank"
						rel="noreferrer"
						className="text-orange-500 hover:text-orange-400 underline underline-offset-2"
					>
						{children}
					</a>
				),
				ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
				ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
				li: ({ children }) => <li className="text-neutral-300">{children}</li>,
				blockquote: ({ children }) => (
					<blockquote className="border-l-4 border-orange-500/50 pl-4 italic text-neutral-400 my-4">
						{children}
					</blockquote>
				),
				code: CodeHighlight,
				table: ({ children }) => (
					<div className="overflow-x-auto my-6">
						<table className="w-full border border-neutral-800 rounded-lg overflow-hidden">
							{children}
						</table>
					</div>
				),
				thead: ({ children }) => <thead className="bg-neutral-950 text-neutral-200">{children}</thead>,
				tbody: ({ children }) => <tbody className="divide-y divide-neutral-800">{children}</tbody>,
				tr: ({ children }) => <tr className="hover:bg-neutral-900/50 transition-colors">{children}</tr>,
				th: ({ children }) => (
					<th className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 px-4 py-2 border-b border-neutral-800">
						{children}
					</th>
				),
				td: ({ children }) => <td className="px-4 py-2 text-neutral-300 text-sm">{children}</td>,
			}}
		>
			{content}
		</ReactMarkdown>
	);
};
