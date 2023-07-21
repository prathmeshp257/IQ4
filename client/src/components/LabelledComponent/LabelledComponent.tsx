import React, { FC } from "react";
import { Flex } from "../Flex";

interface LabelledComponentProps {
	label?: string;
	children: JSX.Element | JSX.Element[];
	className?: string;
	style?: React.CSSProperties;
}

export const LabelledComponent: FC<LabelledComponentProps> = ({ label, children, className = "", style }) => {
	return (
		<Flex direction="column" className={className} style={style}>
			<h4 className="labelled-component__label">{label}</h4>
			<div className="labelled-component__children">{children}</div>
		</Flex>
	);
};
