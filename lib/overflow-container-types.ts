import type { ElementType, ReactNode } from "react";

export interface OverflowContainerProps {
	/** Elements to display. Can be a ReactNode or an array. */
	children: ReactNode | ReactNode[];
	/**
	 * Render function for hidden elements (e.g., "More" button/badge).
	 * The returned node will be placed on the right.
	 */
	renderHiddenElements?: (
		hiddenElements: ReactNode[],
		hiddenIndexes: number[],
	) => ReactNode;
	/** HTML element type for the container (default: "div") */
	as?: ElementType;
	/** Class name for the outer container */
	className?: string;
	/** Gap between elements in px (default: 8) */
	gap?: number;
}