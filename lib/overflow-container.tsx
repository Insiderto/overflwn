"use client";

import {
	Children,
	Fragment,
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { ReactNode } from "react";
import {
	ITEM_WRAPPER_STYLE,
	MEASUREMENT_BASE_STYLE,
	MEASUREMENT_ITEMS_STYLE,
	VISIBLE_CONTAINER_STYLE,
} from "./overflow-container-styles";
import type { OverflowContainerProps } from "./overflow-container-types";
import { sharedResizeObserver } from "./shared-resize-observer";

export type { OverflowContainerProps } from "./overflow-container-types";

/**
 * Displays as many children as fit in a row by width.
 * Hides overflow behind custom render (e.g., "More" button).
 */
const OverflowContainerBase = ({
	children,
	renderHiddenElements,
	as: Component = "div",
	className = "",
	gap = 8,
}: OverflowContainerProps) => {
	if (gap < 0) {
		throw new Error(
			`OverflowContainer: gap must be non-negative, got ${gap}. Negative gaps break width calculations.`,
		);
	}

	const containerRef = useRef<HTMLElement>(null);
	const itemsRef = useRef<HTMLDivElement>(null);
	const moreSizerRef = useRef<HTMLDivElement>(null);

	const [visibleCount, setVisibleCount] = useState(0);

	const isResizing = useRef(false);

	const cachedWidths = useRef<number[]>([]);
	const cachedMoreWidth = useRef<number>(0);
	const measurementComplete = useRef(false);
	const lastChildrenLength = useRef(0);

	const childrenArray = useMemo(() => Children.toArray(children), [children]);

	const getChildKey = useCallback(
		(child: ReactNode, index: number): string | number => {
			if (
				child &&
				typeof child === "object" &&
				"key" in child &&
				child.key != null
			) {
				return child.key;
			}
			return index;
		},
		[],
	);
	const calculateVisibleItems = useCallback(() => {
		const containerEl = containerRef.current;
		const itemsEl = itemsRef.current;

		if (!containerEl) return;

		const containerWidth = containerEl.getBoundingClientRect().width;

		if (containerWidth <= 0) {
			setVisibleCount(0);
			return;
		}

		const needsMeasurement = cachedWidths.current.length === 0;

		if (needsMeasurement && (!itemsEl || itemsEl.children.length === 0)) {
			setVisibleCount(0);
			return;
		}

		// Batch read to avoid layout thrashing
		if (needsMeasurement && itemsEl) {
			const items = itemsEl.children;
			cachedWidths.current = [];

			for (let i = 0; i < items.length; i++) {
				const item = items[i] as HTMLElement;
				cachedWidths.current.push(item.getBoundingClientRect().width);
			}
			measurementComplete.current = true;
		}

		if (
			renderHiddenElements &&
			cachedMoreWidth.current === 0 &&
			moreSizerRef.current
		) {
			cachedMoreWidth.current =
				moreSizerRef.current.getBoundingClientRect().width || 0;
		}

		const moreWidth = renderHiddenElements ? cachedMoreWidth.current : 0;
		const widths = cachedWidths.current;

		if (widths.length === 0) {
			setVisibleCount(0);

			return;
		}

		let totalWidth = 0;
		let count = 0;
		const totalItems = widths.length;

		for (let i = 0; i < widths.length; i++) {
			const itemWidth = widths[i];
			const gapWidth = i > 0 ? gap : 0;
			const tentative = totalWidth + gapWidth + itemWidth;

			const remaining = totalItems - (i + 1);
			const needsMore = remaining > 0 && !!renderHiddenElements;
			const moreSpace = needsMore ? (i + 1 > 0 ? gap : 0) + moreWidth : 0;

			if (tentative + moreSpace <= containerWidth) {
				totalWidth = tentative;
				count = i + 1;
			} else {
				break;
			}
		}

		if (count === 0) {
			setVisibleCount(0);

			return;
		}

		setVisibleCount(count);
	}, [gap, renderHiddenElements]);

	useLayoutEffect(() => {
		const raf = requestAnimationFrame(() => {
			calculateVisibleItems();
		});

		const handleResize = () => {
			if (!isResizing.current) {
				isResizing.current = true;
				calculateVisibleItems();
				isResizing.current = false;
			}
		};

		const container = containerRef.current;
		const moreSizer = moreSizerRef.current;

		if (container) {
			sharedResizeObserver.observe(container, handleResize);
		}
		if (moreSizer) {
			sharedResizeObserver.observe(moreSizer, handleResize);
		}

		return () => {
			cancelAnimationFrame(raf);
			if (container) {
				sharedResizeObserver.unobserve(container);
			}
			if (moreSizer) {
				sharedResizeObserver.unobserve(moreSizer);
			}
		};
	}, [calculateVisibleItems]);

	useEffect(() => {
		if (childrenArray.length !== lastChildrenLength.current) {
			cachedWidths.current = [];
			cachedMoreWidth.current = 0;
			measurementComplete.current = false;
			lastChildrenLength.current = childrenArray.length;
		}

		const raf = requestAnimationFrame(() => {
			calculateVisibleItems();
		});
		return () => cancelAnimationFrame(raf);
	}, [childrenArray.length, calculateVisibleItems]);

	const visibleElements = useMemo(
		() => childrenArray.slice(0, visibleCount),
		[childrenArray, visibleCount],
	);

	const hiddenElements = useMemo(
		() => childrenArray.slice(visibleCount),
		[childrenArray, visibleCount],
	);

	const hiddenIndexes = useMemo(
		() =>
			Array.from(
				{ length: childrenArray.length - visibleCount },
				(_, i) => i + visibleCount,
			),
		[childrenArray.length, visibleCount],
	);

	const measurementItemsStyle = useMemo(
		() => ({
			...MEASUREMENT_ITEMS_STYLE,
			gap: `${gap}px`,
		}),
		[gap],
	);

	const visibleContainerStyle = useMemo(
		() => ({
			...VISIBLE_CONTAINER_STYLE,
			gap: `${gap}px`,
		}),
		[gap],
	);

	return (
		<Component
			ref={containerRef}
			className={className}
			style={visibleContainerStyle}
		>
			{!measurementComplete.current && (
				<div
					ref={itemsRef}
					aria-hidden
					inert
					role="presentation"
					style={measurementItemsStyle}
				>
					{Children.map(childrenArray, (child, i) => (
						<div key={getChildKey(child, i)} style={ITEM_WRAPPER_STYLE}>
							{child}
						</div>
					))}
				</div>
			)}

			{renderHiddenElements && cachedMoreWidth.current === 0 && (
				<div
					ref={moreSizerRef}
					aria-hidden
					inert
					role="presentation"
					style={MEASUREMENT_BASE_STYLE}
				>
					{renderHiddenElements(
						childrenArray.length > 0 ? [childrenArray[0]] : [],
						childrenArray.length > 0 ? [0] : [],
					)}
				</div>
			)}

			<>
				{Children.map(visibleElements, (child, i) => (
					<Fragment key={getChildKey(child, i)}>{child}</Fragment>
				))}

				{hiddenElements.length > 0 &&
					renderHiddenElements &&
					renderHiddenElements(hiddenElements, hiddenIndexes)}
			</>
		</Component>
	);
};

export const OverflowContainer = memo(OverflowContainerBase);
