export function dom<T extends Element = Element>(
	input?: string | T | Iterable<T> | null,
	context: ParentNode = document,
) {
	return new Dom<T>(input, context);
}

class Dom<T extends Element = Element> {
	private elements: T[];

	constructor(input?: string | T | Iterable<T> | null, context: ParentNode = document) {
		if (!input) {
			this.elements = [];
		} else if (typeof input === 'string') {
			this.elements = Array.from(context.querySelectorAll<T>(input));
		} else if (input instanceof Element) {
			this.elements = [input as T];
		} else {
			this.elements = Array.from(input).filter((el): el is T => el instanceof Element);
		}
	}

	get length() {
		return this.elements.length;
	}

	get first(): T | undefined {
		return this.elements[0];
	}

	toArray() {
		return [...this.elements];
	}

	[Symbol.iterator]() {
		return this.elements[Symbol.iterator]();
	}

	forEach(fn: (el: T, i: number) => void) {
		this.elements.forEach(fn);
		return this;
	}

	map<R>(fn: (el: T, i: number) => R): R[] {
		return this.elements.map(fn);
	}

	on<K extends keyof HTMLElementEventMap>(
		type: K,
		handler: (ev: HTMLElementEventMap[K]) => void,
		options?: AddEventListenerOptions,
	) {
		this.forEach((el) => el.addEventListener(type, handler as any, options));
		return this;
	}

	off<K extends keyof HTMLElementEventMap>(type: K, handler: (ev: HTMLElementEventMap[K]) => void) {
		this.forEach((el) => el.removeEventListener(type, handler as any));
		return this;
	}

	emit(type: string, detail?: unknown) {
		const event = new CustomEvent(type, { detail });
		this.forEach((el) => el.dispatchEvent(event));
		return this;
	}

	html(): string;
	html(value: string): this;
	html(value?: string) {
		if (value === undefined) return this.first?.innerHTML ?? '';
		return this.forEach((el) => (el.innerHTML = value));
	}

	text(): string;
	text(value: string): this;
	text(value?: string) {
		if (value === undefined) return this.first?.textContent ?? '';
		return this.forEach((el) => (el.textContent = value));
	}

	addClass(...names: string[]) {
		return this.forEach((el) => el.classList.add(...names));
	}

	removeClass(...names: string[]) {
		return this.forEach((el) => el.classList.remove(...names));
	}

	toggleClass(name: string, force?: boolean) {
		return this.forEach((el) => el.classList.toggle(name, force));
	}

	hasClass(name: string) {
		return this.elements.some((el) => el.classList.contains(name));
	}

	attr(name: string): string | null;
	attr(name: string, value: string | null): this;
	attr(name: string, value?: string | null) {
		if (value === undefined) return this.first?.getAttribute(name) ?? null;

		return this.forEach((el) => (value === null ? el.removeAttribute(name) : el.setAttribute(name, value)));
	}

	style(styles: Partial<CSSStyleDeclaration>) {
		return this.forEach((el) => Object.assign((el as unknown as HTMLElement).style, styles));
	}

	append(content: string | Element | Dom) {
		const nodes = this.#resolve(content);

		this.forEach((el, i) => {
			nodes.forEach((node) => {
				el.appendChild(i === 0 ? node : node.cloneNode(true));
			});
		});

		return this;
	}

	remove() {
		return this.forEach((el) => el.remove());
	}

	empty() {
		return this.forEach((el) => (el.innerHTML = ''));
	}

	find(selector: string) {
		const found: Element[] = [];

		this.forEach((el) => {
			found.push(...el.querySelectorAll(selector));
		});

		return dom(found);
	}

	parent() {
		const parents = new Set<Element>();

		this.forEach((el) => {
			if (el.parentElement) parents.add(el.parentElement);
		});

		return dom(parents);
	}

	children(selector?: string) {
		const result: Element[] = [];

		this.forEach((el) => {
			const kids = Array.from(el.children);
			result.push(...(selector ? kids.filter((k) => k.matches(selector)) : kids));
		});

		return dom(result);
	}

	animate(
		props: Partial<CSSStyleDeclaration> & {
			x?: number;
			y?: number;
			scale?: number;
			rotate?: number;
		},
		options:
			| number
			| {
					duration?: number;
					easing?: string;
					delay?: number;
					onFinish?: () => void;
			  } = 300,
	) {
		const {
			duration = typeof options === 'number' ? options : (options.duration ?? 300),
			easing = typeof options === 'number' ? 'ease' : (options.easing ?? 'ease'),
			delay = typeof options === 'number' ? 0 : (options.delay ?? 0),
			onFinish = typeof options === 'number' ? undefined : options.onFinish,
		} = typeof options === 'number' ? { duration: options } : options;

		const animations: Animation[] = [];

		this.forEach((el) => {
			const transformParts: string[] = [];

			if ('x' in props) transformParts.push(`translateX(${props.x}px)`);
			if ('y' in props) transformParts.push(`translateY(${props.y}px)`);
			if ('scale' in props) transformParts.push(`scale(${props.scale})`);
			if ('rotate' in props) transformParts.push(`rotate(${props.rotate}deg)`);

			const keyframe: any = { ...props };

			if (transformParts.length) {
				keyframe.transform = transformParts.join(' ');
				delete keyframe.x;
				delete keyframe.y;
				delete keyframe.scale;
				delete keyframe.rotate;
			}

			const anim = el.animate([keyframe], {
				duration,
				easing,
				delay,
				fill: 'forwards',
			});

			if (onFinish) {
				anim.addEventListener('finish', onFinish, { once: true });
			}

			animations.push(anim);
		});

		return {
			finished: Promise.all(animations.map((a) => a.finished)),
			cancel: () => animations.forEach((a) => a.cancel()),
		};
	}

	async fadeIn(duration = 300) {
		this.style({ opacity: '0', display: '' });

		this.forEach((el) => {
			el.animate([{ opacity: 0 }, { opacity: 1 }], { duration, fill: 'forwards' });
		});

		return this;
	}

	async fadeOut(duration = 300) {
		this.forEach((el) => {
			const anim = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration, fill: 'forwards' });

			anim.addEventListener('finish', () => ((el as unknown as HTMLElement).style.display = 'none'), {
				once: true,
			});
		});

		return this;
	}

	#resolve(content: string | Element | Dom): Node[] {
		if (content instanceof Dom) return content.toArray();

		if (content instanceof Element) return [content];

		const template = document.createElement('template');
		template.innerHTML = content.trim();
		return Array.from(template.content.childNodes);
	}
}

export const $ = dom;
