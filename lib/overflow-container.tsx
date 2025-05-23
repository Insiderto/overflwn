"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface OverflowContainerProps {
	/**
	 * Elements to display in the container.
	 * Each child will be measured and displayed if it fits within the container width.
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

	useEffect(() => {
		const calculateVisibleItems = () => {
			if (!containerRef.current || !itemsRef.current) return;
			const containerWidth = containerRef.current.offsetWidth;
			const items = itemsRef.current.children;
			if (containerWidth === 0 || items.length === 0) return;

			// Get width of the hidden elements renderer (e.g., More button)
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
		};
		const resizeObserver = new ResizeObserver(() => {
			calculateVisibleItems();
		});
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}
		// Initial calculation
		const timer = setTimeout(calculateVisibleItems, 10);
		return () => {
			resizeObserver.disconnect();
			clearTimeout(timer);
		};
	}, [children, gap, renderHiddenElements]);

	const visibleElements = children.slice(0, visibleCount);
	const hiddenElements = children.slice(visibleCount);
	const hiddenIndexes = Array.from(
		{ length: children.length - visibleCount },
		(_, i) => i + visibleCount,
	);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				position: "relative",
			}}
		>
			<div
				ref={itemsRef}
				style={{
					position: "absolute",
					visibility: "hidden",
					display: "flex",
					alignItems: "center",
					gap: `${gap}px`,
					whiteSpace: "nowrap",
					pointerEvents: "none",
					height: 0,
				}}
			>
				{children.map((child, index) => (
					<div
						key={`measure-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
						style={{ flexShrink: 0 }}
					>
						{child}
					</div>
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
						height: 0,
					}}
				>
					{renderHiddenElements([children[0]], [0])}
				</div>
			)}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: `${gap}px`,
				}}
			>
				{visibleElements.map((child, index) => (
					<div
						key={`visible-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
						style={{ flexShrink: 0 }}
					>
						{child}
					</div>
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
