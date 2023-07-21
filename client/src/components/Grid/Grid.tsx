import React, { FC } from "react";

import { Grid as MaterialGrid } from "@material-ui/core";

interface GridProps {
	direction: "row" | "row-reverse" | "column" | "column-reverse" | undefined;
	justify: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined;
	alignment: "stretch" | "center" | "flex-start" | "flex-end" | "baseline" | undefined;
	style?: React.CSSProperties;
	className?: string;
}

export const Grid: FC<GridProps> = ({ direction, justify, alignment, style, className, children }) => {
	return (
		<MaterialGrid
			container
			direction={direction}
			justify={justify}
			alignItems={alignment}
			style={style}
			className={className}
		>
			{children}
		</MaterialGrid>
	);
};
