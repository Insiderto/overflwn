"use client";

import {
	Children,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import type { ReactNode } from "react";

// Custom hook for debounced function
function useDebounce<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const callbackRef = useRef<T>(callback);

	// Update the callback ref when callback changes
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	return useCallback(
		(...args: Parameters<T>) => {
			const timeoutId = setTimeout(() => {
				callbackRef.current(...args);
			}, delay);

			return () => clearTimeout(timeoutId);
		},
		[delay],
	);
}

export interface OverflowContainerProps {
	/**
	 * Elements to display in the container.
	 * Each child will be measured and displayed if it fits within the container width (horizontal) or height (vertical).
	 */
	children: ReactNode[];
	/**
	 * Optional render function for hidden elements (e.g., a "More" button or badge).
	 * @param hiddenElements - Array of React nodes that didn't fit in the container
	 * @param hiddenIndexes - Array of indexes corresponding to the hidden elements in the original children array
	 * @returns A React node to render (e.g., a badge showing "+X more" or a dropdown)
	 * @example
	 * renderHiddenElements={(hidden, hiddenIndexes) => (
	 *   <Badge>+{hidden.length} more</Badge>
	 * )}
	 */
	renderHiddenElements?: (
		hiddenElements: ReactNode[],
		hiddenIndexes: number[],
	) => ReactNode;
	/**
	 * Optional class name for the container.
	 * You can use this to apply custom styles to the container element.
	 */
	className?: string;
	/**
	 * Gap between elements in pixels.
	 * @default 8
	 */
	gap?: number;
}

/**
 * OverflowContainer automatically displays as many children as fit within its width,
 * hiding the rest behind a customizable render function (e.g., a "More" button or badge).
 *
 * @component
 * @example
 * ```tsx
 * <OverflowContainer
 *   renderHiddenElements={(hidden, hiddenIndexes) => (
 *     <Badge>+{hidden.length} more</Badge>
 *   )}
 *   gap={10}
 * >
 *   {tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
 * </OverflowContainer>
 * ```
 */
export const OverflowContainer = ({
	children,
	renderHiddenElements,
	className = "",
	gap = 8,
}: OverflowContainerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const itemsRef = useRef<HTMLDivElement>(null);
	const moreButtonRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(children.length);
	const [isCalculated, setIsCalculated] = useState(false);

	const childrenArray = Children.toArray(children);

	const calculateVisibleItems = useCallback(() => {
		if (!containerRef.current || !itemsRef.current) return;
		const containerWidth = containerRef.current.offsetWidth;
		const items = itemsRef.current.children;
		if (containerWidth === 0 || items.length === 0) return;

		let moreButtonWidth = 0;
		if (moreButtonRef.current && renderHiddenElements) {
			moreButtonWidth = moreButtonRef.current.offsetWidth;
		}
		let totalWidth = 0;
		let count = 0;
		for (let i = 0; i < items.length; i++) {
			const item = items[i] as HTMLElement;
			const itemWidth = item.offsetWidth;
			const gapWidth = i > 0 ? gap : 0;
			const newTotalWidth = totalWidth + itemWidth + gapWidth;
			const remainingItems = children.length - (i + 1);
			const needsMoreButton = remainingItems > 0 && renderHiddenElements;
			const moreButtonSpace = needsMoreButton ? moreButtonWidth + gap : 0;
			if (newTotalWidth + moreButtonSpace <= containerWidth) {
				totalWidth = newTotalWidth;
				count = i + 1;
			} else {
				break;
			}
		}
		setVisibleCount(count);
		setIsCalculated(true);
	}, [gap, renderHiddenElements, children.length]);

	// Create debounced version of the calculation function
	const debouncedCalculate = useDebounce(calculateVisibleItems, 100);

	useLayoutEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			debouncedCalculate();
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		// Initial calculation with a small delay
		const timer = setTimeout(() => {
			calculateVisibleItems();
		}, 10);

		return () => {
			resizeObserver.disconnect();
			clearTimeout(timer);
		};
	}, [calculateVisibleItems, debouncedCalculate]);

	const visibleElements = childrenArray.slice(0, visibleCount);
	const hiddenElements = childrenArray.slice(visibleCount);
	const hiddenIndexes = Array.from(
		{ length: childrenArray.length - visibleCount },
		(_, i) => i + visibleCount,
	);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{
				display: "flex",
				flexDirection: orientation === "horizontal" ? "row" : "column",
				alignItems: orientation === "horizontal" ? "center" : "stretch",
				overflow: "hidden",
				position: "relative",
				...(orientation === "vertical" ? { height: "100%" } : {}),
				// Hide content until calculation is complete
				visibility: isCalculated ? "visible" : "hidden",
			}}
		>
			<div
				ref={itemsRef}
				style={{
					position: "absolute",
					visibility: "hidden",
					display: "flex",
					flexDirection: orientation === "horizontal" ? "row" : "column",
					alignItems: orientation === "horizontal" ? "center" : "stretch",
					gap: `${gap}px`,
					whiteSpace: orientation === "horizontal" ? "nowrap" : "normal",
					pointerEvents: "none",
					...(orientation === "horizontal"
						? { height: 0, width: "max-content" }
						: { width: "100%", height: "max-content" }),
				}}
			>
				{Children.map(childrenArray, (child) => (
					<div style={{ flexShrink: 0 }}>{child}</div>
				))}
			</div>
			{renderHiddenElements && (
				<div
					ref={moreButtonRef}
					style={{
						position: "absolute",
						visibility: "hidden",
						flexShrink: 0,
						pointerEvents: "none",
						...(orientation === "horizontal"
							? { height: 0, width: "max-content" }
							: { width: "100%", height: "max-content" }),
					}}
				>
					{renderHiddenElements([childrenArray[0]], [0])}
				</div>
			)}
			<div
				style={{
					display: "flex",
					flexDirection: orientation === "horizontal" ? "row" : "column",
					alignItems: orientation === "horizontal" ? "center" : "stretch",
					gap: `${gap}px`,
					width: "100%",
				}}
			>
				{Children.map(visibleElements, (child) => (
					<div style={{ flexShrink: 0 }}>{child}</div>
				))}
				{hiddenElements.length > 0 && renderHiddenElements && (
					<div style={{ flexShrink: 0 }}>
						{renderHiddenElements(hiddenElements, hiddenIndexes)}
					</div>
				)}
			</div>
		</div>
	);
};
