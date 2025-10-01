export const MEASUREMENT_BASE_STYLE = {
	position: "absolute" as const,
	visibility: "hidden" as const,
	pointerEvents: "none" as const,
	height: 0,
	width: "max-content" as const,
};

export const MEASUREMENT_ITEMS_STYLE = {
	...MEASUREMENT_BASE_STYLE,
	display: "flex" as const,
	flexDirection: "row" as const,
	whiteSpace: "nowrap" as const,
};

export const VISIBLE_CONTAINER_STYLE = {
	display: "flex" as const,
	flexDirection: "row" as const,
	width: "100%",
	whiteSpace: "nowrap" as const,
};

export const ITEM_WRAPPER_STYLE = {
	flexShrink: 0,
};
