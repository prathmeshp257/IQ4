import React, { FC, ReactChildren } from "react";

interface FlexProps {
	direction?:
		| "-moz-initial"
		| "inherit"
		| "initial"
		| "revert"
		| "unset"
		| "column"
		| "column-reverse"
		| "row"
		| "row-reverse"
		| undefined;
	justify?:
		| "space-around"
		| "space-between"
		| "space-evenly"
		| "stretch"
		| "center"
		| "end"
		| "flex-end"
		| "flex-start"
		| "start";
	align?:
		| "inherit"
		| "initial"
		| "revert"
		| "unset"
		| "stretch"
		| "center"
		| "end"
		| "flex-end"
		| "flex-start"
		| "start"
		| "normal"
		| "self-end"
		| "self-start"
		| "baseline";
	children?: JSX.Element[] | ReactChildren | React.ReactFragment;
	className?: string;
	wrap?: "nowrap" | "wrap" | "wrap-reverse";
	style?: React.CSSProperties;
	onClick?: () => void;
}

export const Flex: FC<FlexProps> = ({ direction, justify, align, wrap, children, style, className, onClick }) => {
	return (
		<div
			className={className}
			onClick={onClick}
			style={{
				display: "flex",
				flexDirection: direction,
				flexWrap: wrap,
				justifyContent: justify,
				alignItems: align,
				...style
			}}
		>
			{children}
		</div>
	);
};

Flex.defaultProps = {
	className: "flex-container"
};
