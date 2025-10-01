type ResizeCallback = (entry: ResizeObserverEntry) => void;

class SharedResizeObserver {
	private observer: ResizeObserver | null = null;
	private callbacks = new Map<Element, ResizeCallback>();
	private pendingUpdates = new Set<Element>();
	private rafId: number | null = null;

	constructor() {
		if (typeof window !== "undefined") {
			this.observer = new ResizeObserver((entries) => {
				for (const entry of entries) {
					this.pendingUpdates.add(entry.target);
				}

				if (this.rafId === null) {
					this.rafId = requestAnimationFrame(() => {
						const updates = Array.from(this.pendingUpdates);
						this.pendingUpdates.clear();
						this.rafId = null;

						for (const target of updates) {
							const callback = this.callbacks.get(target);
							if (callback) {
								const entry = entries.find((e) => e.target === target);
								if (entry) callback(entry);
							}
						}
					});
				}
			});
		}
	}

	observe(element: Element, callback: ResizeCallback) {
		this.callbacks.set(element, callback);
		this.observer?.observe(element);
	}

	unobserve(element: Element) {
		this.callbacks.delete(element);
		this.pendingUpdates.delete(element);
		this.observer?.unobserve(element);
	}

	disconnect() {
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
		this.callbacks.clear();
		this.pendingUpdates.clear();
		this.observer?.disconnect();
	}
}

export const sharedResizeObserver = new SharedResizeObserver();